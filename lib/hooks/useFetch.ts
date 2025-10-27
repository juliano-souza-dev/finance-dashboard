'use client';
import { useEffect, useState } from 'react';
import { FetchError, fetchJson } from '../api';

export function useFetchJson<T>(url: string, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchJson<T>(url, options);
     
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) {
          if (err instanceof FetchError) {
            setError(`Erro ${err.status}: ${err.message}`);
          } else {
            setError((err as Error).message);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    // cleanup para evitar atualização após desmontar
    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data, error, loading, refetch: () => fetchJson<T>(url, options) };
}
