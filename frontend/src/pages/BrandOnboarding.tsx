import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api, apiErrorMessage } from "../lib/api";
import type { CompanyProfile, ICP } from "../lib/types";

const CHECKLIST = [
  "Reading your website…",
  "Extracting product signals…",
  "Identifying your ICP…",
  "Preparing your brand profile…",
];

export default function BrandOnboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [website, setWebsite] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [checklistIndex, setChecklistIndex] = useState(0);

  const [valueProposition, setValueProposition] = useState("");
  const [icps, setIcps] = useState<ICP[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<CompanyProfile>("/companies/me");
        if (data.completed) {
          navigate("/brand/overview");
          return;
        }
        setProfile(data);
        setStep(Math.max(1, Math.min(2, data.onboardingStep)));
        if (data.valueProposition) setValueProposition(data.valueProposition);
        if (data.icps?.length) setIcps(data.icps);
      } catch (err) {
        setError(apiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  useEffect(() => {
    if (!analyzing) return;
    setChecklistIndex(0);
    const interval = setInterval(() => {
      setChecklistIndex((i) => (i < CHECKLIST.length - 1 ? i + 1 : i));
    }, 600);
    return () => clearInterval(interval);
  }, [analyzing]);

  async function onAnalyze(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setAnalyzing(true);
    const start = Date.now();
    try {
      const { data } = await api.post<CompanyProfile>("/companies/me/analyze-website", { website });
      const elapsed = Date.now() - start;
      const minDuration = CHECKLIST.length * 600 + 400;
      if (elapsed < minDuration) {
        await new Promise((resolve) => setTimeout(resolve, minDuration - elapsed));
      }
      setProfile(data);
      setValueProposition(data.valueProposition ?? "");
      setIcps(data.icps);
      setStep(2);
    } catch (err) {
      setError(apiErrorMessage(err, "Could not read your website"));
    } finally {
      setAnalyzing(false);
    }
  }

  function updateIcp(index: number, field: keyof ICP, value: string) {
    setIcps((prev) => prev.map((icp, i) => (i === index ? { ...icp, [field]: value } : icp)));
  }

  async function onFinish() {
    setError("");
    setSaving(true);
    try {
      await api.patch<CompanyProfile>("/companies/me/finish", { valueProposition, icps });
      navigate("/brand/overview");
    } catch (err) {
      setError(apiErrorMessage(err, "Could not save your brand profile"));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading…</div>;
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 px-10 py-10 max-w-2xl">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-naano-dark flex items-center justify-center text-white text-sm font-bold">
            n
          </div>
        </div>

        <p className="text-xs font-bold text-naano-blue mb-2">Step {step} of 3</p>
        <div className="flex items-center gap-2 mb-8 max-w-xs">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= step ? "bg-naano-blue" : "bg-gray-200"}`} />
          ))}
        </div>

        {step === 1 && !analyzing && (
          <form onSubmit={onAnalyze}>
            <h1 className="text-3xl font-bold text-naano-dark">Your website</h1>
            <p className="text-sm text-gray-500 mt-3 max-w-md">
              We'll read your site to understand the product and your 3 main ICPs. This usually takes 20-40 seconds.
            </p>

            <label className="text-xs font-semibold text-gray-500 mt-8 block uppercase tracking-wide">
              Your website
            </label>
            <input
              type="text"
              required
              placeholder="www.yourcompany.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full max-w-md border border-gray-200 rounded-xl px-4 py-3 text-sm mt-2 focus:outline-none focus:ring-2 focus:ring-naano-blue"
            />

            {error && <p className="text-sm text-red-500 mt-3">{error}</p>}

            <button
              type="submit"
              className="mt-5 w-full max-w-md bg-naano-blue text-white font-semibold py-3 rounded-xl hover:bg-naano-blue/90"
            >
              Analyze my website
            </button>
          </form>
        )}

        {step === 1 && analyzing && (
          <div className="max-w-md">
            <h1 className="text-3xl font-bold text-naano-dark">Reading your brand…</h1>
            <p className="text-sm text-gray-500 mt-3">
              This usually takes 20-40 seconds. We'll only show you the product and 3 ICPs.
            </p>

            <div className="w-24 h-24 rounded-full bg-naano-blue/10 flex items-center justify-center mx-auto mt-10">
              <div className="w-10 h-10 rounded-lg bg-naano-dark flex items-center justify-center text-white text-sm font-bold animate-pulse">
                n
              </div>
            </div>

            <div className="mt-10 space-y-4">
              {CHECKLIST.map((label, i) => (
                <div key={label} className="flex items-center gap-3 text-sm">
                  {i < checklistIndex ? (
                    <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">
                      ✓
                    </span>
                  ) : i === checklistIndex ? (
                    <span className="w-5 h-5 rounded-full bg-naano-blue/10 text-naano-blue flex items-center justify-center text-xs font-semibold">
                      {i + 1}
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-300 flex items-center justify-center text-xs">
                      {i + 1}
                    </span>
                  )}
                  <span className={i <= checklistIndex ? "text-naano-dark font-medium" : "text-gray-400"}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-lg">
            <h1 className="text-3xl font-bold text-naano-dark">Value prop &amp; ICP</h1>
            <p className="text-sm text-gray-500 mt-1">{profile?.companyName}</p>
            <p className="text-sm text-gray-500 mt-4">
              Review these details once. Naano turns them into a brief for your creators.
            </p>

            <label className="text-xs font-semibold text-gray-500 mt-6 block uppercase tracking-wide">
              Value proposition
            </label>
            <p className="text-xs text-gray-400 mt-0.5">What the company does, for whom, how — 4 to 6 sentences. Edit if needed.</p>
            <textarea
              value={valueProposition}
              onChange={(e) => setValueProposition(e.target.value)}
              rows={6}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mt-2 focus:outline-none focus:ring-2 focus:ring-naano-blue"
            />

            <label className="text-xs font-semibold text-gray-500 mt-6 block uppercase tracking-wide">
              3 ideal customers (ICP)
            </label>
            <p className="text-xs text-gray-400 mt-0.5">The audiences your creators need to understand.</p>
            <div className="space-y-3 mt-2">
              {icps.map((icp, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-naano-blue/10 text-naano-blue flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <div className="flex-1 space-y-2">
                      <input
                        value={icp.title}
                        onChange={(e) => updateIcp(i, "title", e.target.value)}
                        className="w-full font-semibold text-naano-dark text-sm focus:outline-none border-b border-transparent focus:border-naano-blue"
                      />
                      <textarea
                        value={icp.description}
                        onChange={(e) => updateIcp(i, "description", e.target.value)}
                        rows={2}
                        className="w-full text-sm text-gray-500 focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {error && <p className="text-sm text-red-500 mt-3">{error}</p>}

            <button
              onClick={onFinish}
              disabled={saving}
              className="mt-6 w-full bg-naano-blue text-white font-semibold py-3 rounded-xl hover:bg-naano-blue/90 disabled:opacity-60"
            >
              {saving ? "Creating your brief…" : "Confirm and continue"}
            </button>
          </div>
        )}
      </div>

      <div className="hidden md:flex flex-1 bg-naano-blue text-white flex-col justify-center px-14">
        <h2 className="text-4xl font-bold leading-tight">Creators. Brands. Results.</h2>
        <p className="mt-5 text-white/80 max-w-md">
          Run LinkedIn creator campaigns that drive real business - discover creators, track performance, pay in one
          click.
        </p>
        <p className="mt-10 text-sm text-white/60">Built for B2B marketing teams</p>
        <p className="mt-6 text-xs text-white/40">Signed in as {user?.email}</p>
      </div>
    </div>
  );
}
