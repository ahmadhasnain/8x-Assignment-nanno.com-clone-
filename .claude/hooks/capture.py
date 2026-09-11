#!/usr/bin/env python3
"""Capture hook for 8x assignment prompt/response logging.

Invoked by Claude Code hooks (UserPromptSubmit and Stop) defined in
.claude/settings.json. Reads the hook event JSON from stdin and appends
a log entry to .agent-logs/<timestamp>_<session_id>.md.

Must never crash the session: all errors are swallowed and written to
.agent-logs/.capture-errors.log instead, and the script always exits 0.
"""
import sys
import os
import re
import json
import glob
import time
import subprocess
import traceback
from datetime import datetime, timezone

DEFAULT_MODEL = "claude-sonnet-5"
DEFAULT_TOOL = "claude-code"
DEFAULT_PROJECT = "naano-mvp"

FRONTMATTER_ORDER = [
    "session_id", "date", "author", "model", "tool", "project",
    "total_exchanges", "first_prompt_time", "last_prompt_time",
]


def now_iso():
    dt = datetime.now(timezone.utc)
    return dt.strftime("%Y-%m-%dT%H:%M:%S.") + f"{dt.microsecond // 1000:03d}Z"


def read_stdin_json():
    try:
        raw = sys.stdin.read()
        return json.loads(raw) if raw.strip() else {}
    except Exception:
        return {}


def get_project_dir():
    return os.environ.get("CLAUDE_PROJECT_DIR") or os.getcwd()


def get_author():
    for cmd in (["gh", "api", "user", "--jq", ".login"], ["git", "config", "user.name"]):
        try:
            out = subprocess.run(cmd, capture_output=True, text=True, timeout=5)
            if out.returncode == 0 and out.stdout.strip():
                return out.stdout.strip()
        except Exception:
            pass
    return os.environ.get("USER", "unknown")


def find_log_file(log_dir, session_id):
    matches = glob.glob(os.path.join(log_dir, f"*_{session_id}.md"))
    return matches[0] if matches else None


def parse_frontmatter(text):
    m = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    fm = {}
    if m:
        for line in m.group(1).splitlines():
            if ":" in line:
                k, v = line.split(":", 1)
                fm[k.strip()] = v.strip()
    return fm, (m.end() if m else 0)


def render_frontmatter(fm):
    lines = ["---"]
    for k in FRONTMATTER_ORDER:
        if k in fm:
            lines.append(f"{k}: {fm[k]}")
    lines.append("---")
    return "\n".join(lines) + "\n"


def create_new_file(log_dir, session_id, ts, model, author, project):
    os.makedirs(log_dir, exist_ok=True)
    date = ts[:10]
    fname_ts = ts[:19].replace(":", "-").replace("T", "_")
    filename = f"{fname_ts}_{session_id}.md"
    path = os.path.join(log_dir, filename)
    fm = {
        "session_id": session_id,
        "date": date,
        "author": author,
        "model": model,
        "tool": DEFAULT_TOOL,
        "project": project,
        "total_exchanges": "0",
        "first_prompt_time": ts,
        "last_prompt_time": ts,
    }
    short_id = session_id[:8]
    header = (
        render_frontmatter(fm)
        + f"\n# Session Log - {date}\n\n"
        + f"Session: `{short_id}` | Project: `{project}` | Author: `{author}`\n"
    )
    with open(path, "w") as f:
        f.write(header)
    return path


def latest_model_from_transcript(transcript_path):
    if not transcript_path or not os.path.exists(transcript_path):
        return None
    try:
        with open(transcript_path) as f:
            lines = f.readlines()
    except Exception:
        return None
    for line in reversed(lines):
        line = line.strip()
        if not line:
            continue
        try:
            d = json.loads(line)
        except Exception:
            continue
        if d.get("type") == "assistant" and d.get("message", {}).get("model"):
            return d["message"]["model"]
    return None


def extract_final_response(transcript_path):
    """Walk the transcript backwards, collecting assistant text blocks until
    hitting the real user prompt boundary (a 'user' entry whose message
    content is a plain string, as opposed to a tool_result list)."""
    if not transcript_path or not os.path.exists(transcript_path):
        return "", DEFAULT_MODEL
    try:
        with open(transcript_path) as f:
            lines = f.readlines()
    except Exception:
        return "", DEFAULT_MODEL

    text_parts = []
    model = None
    for line in reversed(lines):
        line = line.strip()
        if not line:
            continue
        try:
            d = json.loads(line)
        except Exception:
            continue

        if d.get("type") == "user":
            content = d.get("message", {}).get("content")
            if isinstance(content, str):
                break  # real user prompt boundary
            continue  # tool_result, keep walking back

        if d.get("type") == "assistant":
            msg = d.get("message", {})
            if model is None and msg.get("model"):
                model = msg["model"]
            for block in msg.get("content", []) or []:
                if block.get("type") == "text" and block.get("text", "").strip():
                    text_parts.append(block["text"])
        # ignore system / queue-operation / attachment / ai-title entries

    text_parts.reverse()
    return "\n\n".join(text_parts), (model or DEFAULT_MODEL)


def append_entry(path, entry_type, session_id, ts, model, text):
    with open(path, "r") as f:
        content = f.read()
    fm, body_start = parse_frontmatter(content)
    body = content[body_start:]

    prompt_count = len(re.findall(r"\[LOG_ENTRY type=PROMPT", body))
    response_count = len(re.findall(r"\[LOG_ENTRY type=RESPONSE", body))

    if entry_type == "PROMPT":
        num = prompt_count + 1
        fm["total_exchanges"] = str(num)
    else:
        num = response_count + 1

    fm["last_prompt_time"] = ts
    fm.setdefault("first_prompt_time", ts)

    entry = (
        f"\n---\n\n"
        f"[LOG_ENTRY type={entry_type} num={num} session={session_id}]\n"
        f"timestamp: {ts}\n"
        f"model: {model}\n\n"
        f"{text}\n"
    )

    new_content = render_frontmatter(fm) + body + entry
    with open(path, "w") as f:
        f.write(new_content)


def log_error(log_dir, exc):
    try:
        os.makedirs(log_dir, exist_ok=True)
        with open(os.path.join(log_dir, ".capture-errors.log"), "a") as f:
            f.write(f"{now_iso()} {exc}\n")
    except Exception:
        pass


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else ""
    data = read_stdin_json()
    session_id = data.get("session_id") or "unknown-session"
    project_dir = get_project_dir()
    log_dir = os.path.join(project_dir, ".agent-logs")
    ts = now_iso()
    transcript_path = data.get("transcript_path")

    if mode == "prompt":
        prompt_text = data.get("prompt", "")
        model = latest_model_from_transcript(transcript_path) or DEFAULT_MODEL
        path = find_log_file(log_dir, session_id)
        if not path:
            author = get_author()
            path = create_new_file(log_dir, session_id, ts, model, author, DEFAULT_PROJECT)
        append_entry(path, "PROMPT", session_id, ts, model, prompt_text)

    elif mode == "stop":
        # The transcript file write can lag slightly behind the Stop event
        # firing, so retry briefly before giving up on finding text.
        response_text, model = extract_final_response(transcript_path)
        attempts = 0
        while not response_text.strip() and attempts < 8:
            time.sleep(0.25)
            response_text, model = extract_final_response(transcript_path)
            attempts += 1
        if not response_text.strip():
            response_text = "[no text response captured for this turn]"
        path = find_log_file(log_dir, session_id)
        if not path:
            author = get_author()
            path = create_new_file(log_dir, session_id, ts, model, author, DEFAULT_PROJECT)
        append_entry(path, "RESPONSE", session_id, ts, model, response_text)


if __name__ == "__main__":
    try:
        main()
    except Exception:
        try:
            log_error(os.path.join(get_project_dir(), ".agent-logs"), traceback.format_exc())
        except Exception:
            pass
    sys.exit(0)
