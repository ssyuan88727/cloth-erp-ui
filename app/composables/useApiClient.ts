// app/composables/useApiClient.ts
import type { FormMode, ResponseInterface } from "~/types/baseTypes";
import type { NitroFetchOptions, NitroFetchRequest } from "nitropack";

export default (pageUrl: string) => {
  const runTimeConfig = useRuntimeConfig();
  const apiBase = runTimeConfig.public.apiBase || "http://localhost:8080";
  const fullUrl = `${apiBase}${pageUrl}`;
  const { success, error } = useAlert();

  // 封裝內部通用 Fetch 工具
  const fetcher = <T>(
    url: NitroFetchRequest,
    method: NitroFetchOptions<NitroFetchRequest>["method"],
    data?: any
  ) => {
    return $fetch<T>(url, {
      method,
      // GET 使用 params, 其他使用 body
      [method === "GET" ? "params" : "body"]: data,
      onResponseError({
        response: {
          _data: {
            header: { message },
          },
        },
      }) {
        // [效能至上] 在此處攔截 401/500 等錯誤，可連動全域通知元件
        console.error(`API Error on ${url}:`, message);
        error(message);
      },
    });
  };

  const api = {
    get: <T = ResponseInterface>(params = {}) =>
      fetcher<T>(`${fullUrl}/select`, "GET", params),

    post: <T = ResponseInterface>(body = {}) =>
      fetcher<T>(`${fullUrl}/insert`, "POST", body),

    put: <T = ResponseInterface>(body = {}) =>
      fetcher<T>(`${fullUrl}/update`, "PUT", body),

    del: <T = ResponseInterface>(id: number | string) =>
      fetcher<T>(`${fullUrl}/delete/${id}`, "DELETE"),
  };

  /**
   * 核心優化：策略執行器
   * 限制 mode 類型，排除不需要發送 API 的 'view' 模式
   */
  const submit = async <T = ResponseInterface>(
    mode: Exclude<FormMode, "view"> | FormMode,
    data: any
  ): Promise<T> => {
    const strategy: Partial<Record<FormMode, () => Promise<T>>> = {
      create: () => api.post<T>(data),
      edit: () => api.put<T>(data),
      query: () => api.get<T>(data),
    };

    const action = strategy[mode];
    if (!action) {
      const errMsg = `[ApiClient] 未定義的操作模式或該模式不需要提交: ${mode}`;
      console.error(errMsg);
      error(errMsg);
      throw new Error(errMsg);
    }
    return await action();
  };
  return { ...api, submit };
};
