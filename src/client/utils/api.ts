import type { ResultTuple } from "$/client/types.js";

const API_BASE_URL = "/api/v1";

const api = {
  get: <T>(path: Path) => fetchWrapper<T>(path, "GET"),
  post: <T>(path: Path, body?: any) => fetchWrapper<T>(path, "POST", body),
  patch: <T>(path: Path, body?: any) => fetchWrapper<T>(path, "PATCH", body),
  delete: <T>(path: Path) => fetchWrapper<T>(path, "DELETE")
} as const;

async function fetchWrapper<T>(path: Path, method: string, body?: any): Promise<ResultTuple<T>> {
  try {
    const requestInit = getRequestInit(method, body);
    const response = await fetch(API_BASE_URL + path, requestInit);
    const data = await response.json();
    return data as ResultTuple<T>;
  } catch (error) {
    return [null, [String(error)]];
  }
}

function getRequestInit(method: string, body: any) {
  return {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: body ? JSON.stringify(body) : undefined
  };
}

type Path = `/${string}`;

export default api;