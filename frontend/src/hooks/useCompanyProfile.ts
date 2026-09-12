import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, apiErrorMessage } from "../lib/api";
import type { CompanyProfile } from "../lib/types";

export function useCompanyProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<CompanyProfile>("/companies/me");
        if (!data.completed) {
          navigate("/brand-onboarding");
          return;
        }
        setProfile(data);
      } catch (err) {
        setError(apiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  return { profile, loading, error };
}
