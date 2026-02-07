import { useState, useEffect } from "react";

export function useWhoami() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch("/api/whoami")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch whoami");
        return r.text();
      })
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { content, loading, error };
}
