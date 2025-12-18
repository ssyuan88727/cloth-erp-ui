import type { FormMode, ResponseInterface } from "~/types/baseTypes";

export default (pageUrl: string) => {
  const runTimeConfig = useRuntimeConfig();
  const apiBase = runTimeConfig.public.apiBase || "http://localhost:8080";
  const fullUrl = `${apiBase}${pageUrl}`;

  // 定義基礎請求工具
  const api = {
    get: <T = ResponseInterface>(params: Record<string, any> = {}) =>
      $fetch<T>(`${fullUrl}/select`, { method: "GET", params }),

    post: <T = ResponseInterface>(body: Record<string, any> = {}) =>
      $fetch<T>(`${fullUrl}/insert`, { method: "POST", body }),

    put: <T = ResponseInterface>(body: Record<string, any> = {}) =>
      $fetch<T>(`${fullUrl}/update`, { method: "PUT", body }),

    del: <T = ResponseInterface>(id: number) =>
      $fetch<T>(`${fullUrl}/delete/${id}`, { method: "DELETE" }),
  };

  /**
   * 核心優化：策略執行器
   * 根據模式自動匹配 API 方法，並回傳標準化的 Promise
   */
  const submit = async <T = ResponseInterface>(
    mode: FormMode,
    data: any
  ): Promise<T> => {
    const strategy: Record<FormMode, () => Promise<T>> = {
      create: () => api.post<T>(data),
      edit: () => api.put<T>(data),
      query: () => api.get<T>(data),
    };

    const action = strategy[mode];
    if (!action) throw new Error(`未定義的操作模式: ${mode}`);

    return await action();
  };

  return { ...api, submit };
};
