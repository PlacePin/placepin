import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export const useGetAxios = (
  url: string,
  token?: string,
  deps: any[] = []
): any => {
  const [data, setData] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const { accessToken } = useAuth();
  const authToken = token || accessToken;

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
        );
        if (!cancelled) setData(res.data);
      } catch (err: any) {
        if (!cancelled) setError(err.message || "Unknown error");
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [...deps, authToken]);

  return { data, error };
}
