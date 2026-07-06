import { useEffect, useState } from "react";

export default function useApi<T>(path: `/${string}`, init?: RequestInit) {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + path, init)
      .then((res) => res.json() as Promise<T>)
      .then((data) => setData(data));
  }, [path, init]);

  return data;
}