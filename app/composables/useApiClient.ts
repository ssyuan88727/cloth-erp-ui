import type { FormMode, ResponseInterface } from "~/types/baseTypes";

export default (pageUrl: string) => {
  const runTimeConfig = useRuntimeConfig();
  const apiBase = runTimeConfig.public.apiBase || "http://localhost:8080";
  const fullUrl = `${apiBase}${pageUrl}`;

  // 封裝通用請求邏輯，處理 Token 或錯誤攔截
  const fetchOptions = (method: string, bodyOrParams?: any) => ({
    method,
    [method === "GET" ? "params" : "body"]: bodyOrParams,
    onResponseError({ response }: any) {
      // 可以在這裡串接全域通知系統 (如 Pinia Store 的 Alert)
      console.error(`API Error [${response.status}]:`, response._data?.message);
    },
  });

  const api = {
    get: <T = ResponseInterface>(params = {}) =>
      $fetch<T>(`${fullUrl}/select`, fetchOptions("GET", params) as any),

    post: <T = ResponseInterface>(body = {}) =>
      $fetch<T>(`${fullUrl}/insert`, fetchOptions("POST", body) as any),

    put: <T = ResponseInterface>(body = {}) =>
      $fetch<T>(`${fullUrl}/update`, fetchOptions("PUT", body) as any),

    del: <T = ResponseInterface>(id: number | string) =>
      $fetch<T>(`${fullUrl}/delete/${id}`, { method: "DELETE" }),
  };

  /**
   * 策略執行器優化：
   * 1. 支援泛型 T 確保回傳結構正確
   * 2. 移除 data: any，改用更嚴謹的類型約束
   */
  const submit = async <T = ResponseInterface>(
    mode: FormMode,
    data: Record<string, any>
  ): Promise<T> => {
    const strategy: Record<Exclude<FormMode, "view">, () => Promise<T>> = {
      create: () => api.post<T>(data),
      edit: () => api.put<T>(data),
      query: () => api.get<T>(data),
    };

    const action = strategy[mode as keyof typeof strategy];
    if (!action) {
      throw new Error(`[API Client] 模式 "${mode}" 未匹配到對應的端點路徑。`);
    }

    return await action();
  };

  return { ...api, submit };
};
