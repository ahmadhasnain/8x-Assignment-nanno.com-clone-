# Capture Test — 8x Assignment

## Tool and model

- Tool: **Claude Code** (running here via the Claude Desktop app, `local-agent-mode`,
  entrypoint `claude-desktop`)
- Model: **claude-sonnet-5** for both planning and execution — no separate
  plan/execute model split is configured in this setup.

## Mechanism

Claude Code hooks, configured in **`.claude/settings.json`**:

- `UserPromptSubmit` — fires on every submitted prompt, before Claude processes it.
  Receives JSON on stdin including `session_id`, `transcript_path`, and `prompt`.
- `Stop` — fires when Claude finishes responding for a turn. Receives JSON on stdin
  including `session_id` and `transcript_path` (no direct text of the response).

Both events are wired to the same handler script, **`.claude/hooks/capture.py`**,
invoked as:

```
python3 "${CLAUDE_PROJECT_DIR}/.claude/hooks/capture.py" prompt
python3 "${CLAUDE_PROJECT_DIR}/.claude/hooks/capture.py" stop
```

The script:
- On `prompt`: appends the verbatim prompt text straight from the hook's stdin JSON.
- On `stop`: reads the JSONL file at `transcript_path`, walks it backwards from the
  end, and collects only `text`-type content blocks from `assistant` entries until it
  hits the real user-prompt boundary (a `user` entry whose `message.content` is a
  plain string, as opposed to a `tool_result` list). This excludes `thinking` blocks,
  `tool_use` blocks, and tool results — only the final visible response text is kept.
- Creates one file per session at `.agent-logs/<timestamp>_<session_id>.md`, keeps a
  YAML frontmatter block updated (`total_exchanges`, `last_prompt_time`, etc.), and
  appends numbered `[LOG_ENTRY type=PROMPT|RESPONSE ...]` blocks.
- Never throws: all exceptions are caught and written to
  `.agent-logs/.capture-errors.log` instead of surfacing to the user, and the script
  always exits 0 so a bug in the hook can never block a turn.

## Path to the log files

`.agent-logs/` in the repo root. Three session files exist from testing:

- `.agent-logs/2026-09-11_18-52-41_2a36740f-4f25-4eec-83d8-eb7110845669.md` — first
  fresh-session canary, capture worked correctly (prompt + full response).
- `.agent-logs/2026-09-11_18-57-47_c23d8b99-c922-4ec9-8263-13bfacc738e8.md` — second
  fresh-session canary, prompt captured but response capture failed (see below).
- `.agent-logs/2026-09-11_19-00-20_ef6cc196-e563-40c3-8afa-31a224898fb2.md` — third
  fresh-session canary, sent after the fix, capture worked correctly (prompt + full
  response). This is the confirmed "second session" proof required by step 4.

## Both canary entries, pasted raw

**Session `2a36740f` — worked on first try:**

```
[LOG_ENTRY type=PROMPT num=1 session=2a36740f-4f25-4eec-83d8-eb7110845669]
timestamp: 2026-09-11T18:52:41.750Z
model: claude-sonnet-5

CAPTURE TEST — 8x assignment, Ahmad Hasnain

---

[LOG_ENTRY type=RESPONSE num=1 session=2a36740f-4f25-4eec-83d8-eb7110845669]
timestamp: 2026-09-11T18:52:50.449Z
model: claude-sonnet-5

The repo is empty aside from `.git`, `.claude`, and `.agent-logs` — no actual project
files yet. Your message looks like a test marker rather than a task request.

What would you like me to do? For example: initialize a project, scaffold something
specific, or is this just verifying the connection is working?
```

**Session `ef6cc196` — worked after the retry-race fix:**

```
[LOG_ENTRY type=PROMPT num=1 session=ef6cc196-e563-40c3-8afa-31a224898fb2]
timestamp: 2026-09-11T19:00:20.034Z
model: claude-sonnet-5

CAPTURE TEST — 8x assignment, Ahmad Hasnain

---

[LOG_ENTRY type=RESPONSE num=1 session=ef6cc196-e563-40c3-8afa-31a224898fb2]
timestamp: 2026-09-11T19:00:26.703Z
model: claude-sonnet-5

The working directory is essentially empty — just `.git`, `.claude` config, and some
agent logs, no actual project source code. Your message "CAPTURE TEST — 8x
assignment, Ahmad Hasnain" doesn't include a specific task.

What would you like me to do? For example: create a new project here, review an
existing assignment spec, or something else?
```

## What I tried first that did not work

1. **Testing inside the currently-running session.** I installed the hooks mid-way
   through the conversation that built them, then asked the user to send the canary
   in that same, already-open session. `UserPromptSubmit` never fired for it — no
   file appeared in `.agent-logs/` at all for that session's ID. Conclusion: hooks
   registered in `.claude/settings.json` do not apply retroactively to a session that
   was already running before the settings file was written. They only take effect
   in sessions started after the config exists. This matches the assignment's own
   warning that "a hook that only works in the session that created it is not
   installed" — the fix was to test in genuinely new sessions instead.

2. **Race condition between the `Stop` hook and transcript flushing.** In session
   `c23d8b99` (see log file above), the prompt was captured correctly, but the
   response came back as `[no text response captured for this turn]` — the
   fallback string my script writes when it finds no text blocks. Comparing
   timestamps: the final assistant `text` block was written to the transcript at
   `18:57:53.254Z`, but the `Stop` hook ran and read the file at `18:57:53.315Z` —
   only ~60ms later. The hook read the transcript before the last line was flushed
   to disk. Fix: added a retry loop (up to 8 attempts, 250ms apart) in the `stop`
   branch of `capture.py` that re-reads the transcript if no text is found on the
   first pass. I deliberately left the broken `c23d8b99` log entry untouched rather
   than editing it after the fact — it's an honest record of a real bug encountered
   during setup, not something to clean up.

3. **Spawning a second session programmatically.** I first tried running
   `claude -p "..."` via Bash to create an independent second session myself instead
   of relying on the user to open a new window. The `claude` binary isn't on PATH in
   this sandboxed environment (this instance runs through the Claude Desktop app's
   agent-mode harness, not a standalone CLI install), so that approach was abandoned
   in favor of asking the user to open new windows manually.
