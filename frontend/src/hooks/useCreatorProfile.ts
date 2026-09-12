import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, apiErrorMessage } from "../lib/api";
import type { CreatorProfile } from "../lib/types";

export function useCreatorProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<CreatorProfile>("/creators/me");
        if (!data.completed) {
          navigate("/onboarding");
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
