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

  const fetchData = async () => {
    try {
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setData(res.data);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    }
  };

  useEffect(() => {
    let cancelled = false;
    fetchData();
    return () => { cancelled = true; };
  }, [...deps, authToken]);

  // Refetch is the fetchData function and will allow you to refetch data on data change

  return { data, error, refetch: fetchData };
}
