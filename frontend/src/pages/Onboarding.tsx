import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api, apiErrorMessage } from "../lib/api";
import type { CreatorProfile } from "../lib/types";
import { MarketplaceCard } from "../components/MarketplaceCard";

const INDUSTRIES = [
  "Technology",
  "Marketing",
  "Sales",
  "Finance",
  "HR",
  "Healthcare",
  "Education",
  "Real Estate",
  "E-commerce",
  "Consulting",
];

const COUNTRIES: { name: string; flag: string }[] = [
  { name: "Pakistan", flag: "🇵🇰" },
  { name: "United States", flag: "🇺🇸" },
  { name: "United Kingdom", flag: "🇬🇧" },
  { name: "Germany", flag: "🇩🇪" },
  { name: "France", flag: "🇫🇷" },
  { name: "India", flag: "🇮🇳" },
  { name: "United Arab Emirates", flag: "🇦🇪" },
  { name: "Canada", flag: "🇨🇦" },
];

export default function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [importing, setImporting] = useState(false);

  const [country, setCountry] = useState(COUNTRIES[0].name);
  const [industries, setIndustries] = useState<string[]>([]);
  const [savingStep3, setSavingStep3] = useState(false);

  const [recommendedPrice, setRecommendedPrice] = useState<number | null>(null);
  const [pricePerPost, setPricePerPost] = useState<number>(0);
  const [bundleEnabled, setBundleEnabled] = useState(false);
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<CreatorProfile>("/creators/me");
        setProfile(data);
        setStep(data.completed ? 4 : Math.max(1, data.onboardingStep));
        if (data.country) setCountry(data.country);
        if (data.industries?.length) setIndustries(data.industries);
        if (data.bio) setBio(data.bio);
      } catch (err) {
        setError(apiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function onImport(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setImporting(true);
    try {
      const { data } = await api.post<CreatorProfile>("/creators/me/import-linkedin", { url: linkedinUrl });
      setProfile(data);
      setStep(3);
    } catch (err) {
      setError(apiErrorMessage(err, "Could not import this profile"));
    } finally {
      setImporting(false);
    }
  }

  function toggleIndustry(ind: string) {
    setIndustries((prev) => {
      if (prev.includes(ind)) return prev.filter((i) => i !== ind);
      if (prev.length >= 3) return prev;
      return [...prev, ind];
    });
  }

  async function onStep3Submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSavingStep3(true);
    try {
      const countryFlag = COUNTRIES.find((c) => c.name === country)?.flag;
      const { data } = await api.patch<CreatorProfile>("/creators/me/step3", { country, countryFlag, industries });
      setProfile(data);
      const { data: priceData } = await api.get<{ recommendedPrice: number }>("/creators/me/recommended-price");
      setRecommendedPrice(priceData.recommendedPrice);
      setPricePerPost(priceData.recommendedPrice);
      setStep(4);
    } catch (err) {
      setError(apiErrorMessage(err, "Could not save your details"));
    } finally {
      setSavingStep3(false);
    }
  }

  async function onCreateProfile() {
    setError("");
    setSaving(true);
    try {
      const { data } = await api.patch<CreatorProfile>("/creators/me/step4", {
        pricePerPost,
        bundleEnabled,
        bio: bio || undefined,
      });
      setProfile(data);
      setRevealed(true);
    } catch (err) {
      setError(apiErrorMessage(err, "Could not create your profile"));
    } finally {
      setSaving(false);
    }
  }

  const potentialCost = recommendedPrice
    ? Math.round(recommendedPrice * (1 + industries.length * 0.3))
    : 50 + industries.length * 100;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading…</div>;
  }

  if (revealed && profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <h1 className="text-2xl font-bold text-naano-dark">Here is your Marketplace card</h1>
        <p className="text-sm text-gray-500 mt-1 mb-8">Click the card to flip it and see your full profile.</p>
        <MarketplaceCard
          creator={{
            id: profile.id,
            fullName: profile.fullName,
            headline: profile.headline,
            photoUrl: profile.photoUrl,
            country: profile.country,
            countryFlag: profile.countryFlag,
            followers: profile.followers,
            reactionsPerPost: profile.reactionsPerPost,
            impressionsPerPost: profile.impressionsPerPost,
            commentsPerPost: profile.commentsPerPost,
            engagementRate: profile.engagementRate,
            industries: profile.industries,
            bio: profile.bio,
            pricePerPost: profile.pricePerPost,
          }}
        />
        <button
          onClick={() => navigate("/creator/overview")}
          className="mt-8 bg-naano-blue text-white font-medium px-6 py-3 rounded-xl hover:bg-naano-blue/90"
        >
          Continue to my profile
        </button>
      </div>
    );
  }

  const previewCreator = profile
    ? {
        id: profile.id,
        fullName: profile.fullName,
        headline: profile.headline,
        photoUrl: profile.photoUrl,
        country: step >= 3 ? country : profile.country,
        countryFlag: profile.countryFlag,
        followers: profile.followers,
        reactionsPerPost: profile.reactionsPerPost,
        impressionsPerPost: profile.impressionsPerPost,
        commentsPerPost: profile.commentsPerPost,
        engagementRate: profile.engagementRate,
        industries: step >= 3 ? industries : profile.industries,
        bio: profile.bio,
        pricePerPost: step >= 4 ? pricePerPost : profile.pricePerPost,
      }
    : null;

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full ${s <= step ? "bg-naano-blue" : "bg-gray-200"}`}
            />
          ))}
        </div>
        <p className="text-xs text-gray-400 font-medium mb-6">Step {step} of 4</p>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            {step === 1 && (
              <div className="bg-white rounded-card shadow-lg p-8 max-w-md">
                <h1 className="text-2xl font-bold text-naano-dark">Your Naano account is ready</h1>
                <p className="text-sm text-gray-500 mt-3">
                  Welcome, <span className="font-medium text-naano-dark">{user?.email}</span>. Your account has
                  been created. Next, let's set up your creator marketplace card.
                </p>
                <button
                  onClick={() => setStep(2)}
                  className="mt-6 w-full bg-naano-blue text-white font-medium py-2.5 rounded-xl hover:bg-naano-blue/90"
                >
                  Continue to card setup
                </button>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={onImport} className="bg-white rounded-card shadow-lg p-8 max-w-md">
                <h1 className="text-2xl font-bold text-naano-dark">Add your public LinkedIn profile</h1>
                <p className="text-sm text-gray-500 mt-3">
                  Paste your LinkedIn profile URL and we'll import your public stats to build your card.
                </p>
                <input
                  type="url"
                  required
                  placeholder="https://linkedin.com/in/your-name"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm mt-5 focus:outline-none focus:ring-2 focus:ring-naano-blue"
                />
                {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
                <button
                  type="submit"
                  disabled={importing}
                  className="mt-5 w-full bg-naano-blue text-white font-medium py-2.5 rounded-xl hover:bg-naano-blue/90 disabled:opacity-60"
                >
                  {importing ? "Importing…" : "Import profile"}
                </button>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={onStep3Submit} className="bg-white rounded-card shadow-lg p-8 max-w-md">
                <h1 className="text-2xl font-bold text-naano-dark">Complete your creator card</h1>
                <p className="text-sm text-gray-500 mt-3">Select your country and up to 3 industries.</p>

                <label className="text-xs font-medium text-gray-500 mt-5 block">Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm mt-1.5 focus:outline-none focus:ring-2 focus:ring-naano-blue"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>

                <label className="text-xs font-medium text-gray-500 mt-5 block">
                  Industries ({industries.length}/3)
                </label>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {INDUSTRIES.map((ind) => (
                    <button
                      key={ind}
                      type="button"
                      onClick={() => toggleIndustry(ind)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-full border ${
                        industries.includes(ind)
                          ? "bg-naano-blue text-white border-naano-blue"
                          : "border-gray-200 text-gray-500"
                      }`}
                    >
                      {ind}
                    </button>
                  ))}
                </div>

                <div className="mt-5 bg-naano-blue/5 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Potential cost</span>
                  <span className="text-lg font-bold text-naano-dark">€{potentialCost}</span>
                </div>

                {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
                <button
                  type="submit"
                  disabled={savingStep3 || industries.length === 0}
                  className="mt-5 w-full bg-naano-blue text-white font-medium py-2.5 rounded-xl hover:bg-naano-blue/90 disabled:opacity-60"
                >
                  {savingStep3 ? "Saving…" : "Continue"}
                </button>
              </form>
            )}

            {step === 4 && (
              <div className="bg-white rounded-card shadow-lg p-8 max-w-md">
                <h1 className="text-2xl font-bold text-naano-dark">Complete your creator card</h1>
                <p className="text-sm text-gray-500 mt-3">
                  Based on your profile, here's the price we recommend per sponsored post.
                </p>

                <div className="mt-5 bg-naano-blue/5 rounded-xl p-5 text-center">
                  <div className="text-3xl font-bold text-naano-dark">€{pricePerPost}</div>
                  <div className="text-xs text-gray-400 mt-1">recommended price / post</div>
                  <input
                    type="number"
                    min={1}
                    value={pricePerPost}
                    onChange={(e) => setPricePerPost(Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm mt-4 text-center focus:outline-none focus:ring-2 focus:ring-naano-blue"
                  />
                </div>

                <label className="flex items-center gap-2 mt-5 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={bundleEnabled}
                    onChange={(e) => setBundleEnabled(e.target.checked)}
                    className="rounded"
                  />
                  Enable bundle pricing (optional)
                </label>

                <label className="text-xs font-medium text-gray-500 mt-4 block">Bio (optional)</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm mt-1.5 focus:outline-none focus:ring-2 focus:ring-naano-blue"
                />

                {error && <p className="text-sm text-red-500 mt-3">{error}</p>}

                <button
                  onClick={onCreateProfile}
                  disabled={saving}
                  className="mt-5 w-full bg-naano-blue text-white font-medium py-2.5 rounded-xl hover:bg-naano-blue/90 disabled:opacity-60"
                >
                  {saving ? "Creating…" : "Create my marketplace profile"}
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            {previewCreator && previewCreator.fullName ? (
              <MarketplaceCard creator={previewCreator} />
            ) : (
              <div className="w-full max-w-sm h-64 rounded-card border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 text-sm">
                Your card preview will appear here
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
