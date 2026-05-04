import { useState, useCallback } from "react";
import { medicineAPI } from "../services/api";
import { useLang } from "../context/LangContext";
import toast from "react-hot-toast";

export function useMedicine() {
  const { lang } = useLang();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [cached,  setCached]  = useState(false);

  const search = useCallback(async (name) => {
    if (!name?.trim()) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await medicineAPI.search(name.trim(), lang);
      setData(res.data.data);
      setCached(!!res.data.cached);
    } catch (err) {
      const msg = err.message || "Medicine not found.";
      setError(msg);
      if (err.status !== 404) toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [lang]);

  const reset = () => { setData(null); setError(null); setCached(false); };

  return { data, loading, error, cached, search, reset };
}

export function useCompare() {
  const { lang } = useLang();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [cached,  setCached]  = useState(false);

  const compare = useCallback(async (a, b) => {
    if (!a?.trim() || !b?.trim()) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await medicineAPI.compare(a.trim(), b.trim(), lang);
      setData(res.data.data);
      setCached(!!res.data.cached);
    } catch (err) {
      const msg = err.message || "Could not compare these medicines.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [lang]);

  const reset = () => { setData(null); setError(null); setCached(false); };

  return { data, loading, error, cached, compare, reset };
}
