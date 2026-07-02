import { useEffect, useState } from "react";

export default function useApi<T>(path: string) {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    fetch("http://localhost:5174/api/v1" + path)
      .then((res) => res.json() as Promise<T>)
      .then((data) => setData(data));
  });

  return data;
}