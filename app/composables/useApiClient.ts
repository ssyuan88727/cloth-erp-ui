export default (pageUrl: string) => {
  const runTimeConfig = useRuntimeConfig(),
    apiBase = runTimeConfig.public.apiBase || "http://localhost:8080",
    fullUrl = `${apiBase}${pageUrl}`;
  return {
    get: async <ResponseInterface>(params: Record<string, any> = {}) =>
      await $fetch<ResponseInterface>(`${fullUrl}/select`, {
        method: "GET",
        params,
      }),
    post: async <ResponseInterface>(body: Record<string, any> = {}) =>
      await $fetch<ResponseInterface>(`${fullUrl}/insert`, {
        method: "POST",
        body,
      }),
    put: async <ResponseInterface>(body: Record<string, any> = {}) =>
      await $fetch<ResponseInterface>(`${fullUrl}/update`, {
        method: "PUT",
        body,
      }),
    del: async <ResponseInterface>(id: number) =>
      await $fetch<ResponseInterface>(`${fullUrl}/delete/${id}`, {
        method: "DELETE",
      }),
  };
};
