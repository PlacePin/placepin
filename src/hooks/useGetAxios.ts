import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";

export const useGetAxios = (
  url: string,
  token?: string,
  deps: any[] = []
): any => {
  const [data, setData] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const { accessToken } = useAuth();
  const authToken = token || accessToken;

  const fetchData = async (signal?: AbortSignal) => {
    try {
      const res = await axiosInstance.get(url, {
        headers: { Authorization: `Bearer ${authToken}` },
        signal // axios will automatically cancel the request if signal is aborted
      });
      setData(res.data);
    } catch (err: any) {
      if (axios.isCancel(err)) return; // silently ignore cancellations
      setError(err.message || 'Unknown error');
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort(); // cancels the in-flight request on unmount
  }, [...deps, authToken]);

  // Refetch is the fetchData function and will allow you to refetch data on data change

  return { data, error, refetch: () => fetchData() };
}
