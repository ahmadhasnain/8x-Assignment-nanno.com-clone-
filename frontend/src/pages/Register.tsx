import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiErrorMessage } from "../lib/api";
import type { Role } from "../lib/types";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("CREATOR");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await register(email, password, role, fullName);
      navigate(user.role === "CREATOR" ? "/onboarding" : "/brand-onboarding");
    } catch (err) {
      setError(apiErrorMessage(err, "Could not create your account"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-card shadow-lg p-8">
        <h1 className="text-2xl font-bold text-naano-dark">Join naano</h1>
        <p className="text-sm text-gray-500 mt-1">Create your account to get started.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole("CREATOR")}
              className={`text-sm font-medium py-2 rounded-xl border ${
                role === "CREATOR" ? "bg-naano-blue text-white border-naano-blue" : "border-gray-200 text-gray-500"
              }`}
            >
              I'm a Creator
            </button>
            <button
              type="button"
              onClick={() => setRole("COMPANY")}
              className={`text-sm font-medium py-2 rounded-xl border ${
                role === "COMPANY" ? "bg-naano-blue text-white border-naano-blue" : "border-gray-200 text-gray-500"
              }`}
            >
              I'm a Brand
            </button>
          </div>

          <input
            type="text"
            required
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-naano-blue"
          />
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-naano-blue"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-naano-blue"
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-naano-blue text-white font-medium py-2.5 rounded-xl hover:bg-naano-blue/90 disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-5 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-naano-blue font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
