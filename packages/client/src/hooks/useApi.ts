import { useEffect, useState } from "react";

export default function useApi<T>(path: `/${string}`) {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + path)
      .then((res) => res.json() as Promise<T>)
      .then((data) => setData(data));
  });

  return data;
}