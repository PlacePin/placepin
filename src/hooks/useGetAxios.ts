import axios from "axios";
import { useEffect, useState } from "react";

export const useGetAxios = (url: string, deps: any[] = []) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const res = await axios.get(url);
        if (!cancelled) setData(res.data);
      } catch (err: any) {
        if (!cancelled) setError(err.message || "Unknown error");
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, deps);

  return { data, error };
}
