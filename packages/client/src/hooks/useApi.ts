import { useEffect, useState } from "react";
import { ExceptionKind, type Result } from "common-types";

export default function useApi<T>(path: `/${string}`, init?: RequestInit) {
  const [result, setResult] = useState<Result<T>>([null, { kind: ExceptionKind.Other }]);

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL + path, init)
      .then((res) => res.json() as Promise<T>)
      .then((data) => setResult([data, null]));
  }, [path, init]);

  return result;
}