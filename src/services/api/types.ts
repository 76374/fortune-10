export type ApiMethod = "get" | "post" | "put" | "delete";

export type ApiClient = {
  call<T>(path: string, method: ApiMethod, data?: unknown): Promise<T>;
}
