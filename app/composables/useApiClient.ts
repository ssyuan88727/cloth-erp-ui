const apiBase = useRuntimeConfig().public.apiBase || "http://localhost:8080";

export default (pageUrl: string) => {
  const fullUrl = `${apiBase}${pageUrl}`;
  return {
    get: async <T>(params: Record<string, any> = {}) =>
      await $fetch<T>(`${fullUrl}/select`, {
        method: "GET",
        params,
      }),
    post: async <T>(body: Record<string, any> = {}) =>
      await $fetch<T>(`${fullUrl}/insert`, {
        method: "POST",
        body,
      }),
    put: async <T>(body: Record<string, any> = {}) =>
      await $fetch<T>(`${fullUrl}/update`, {
        method: "PUT",
        body,
      }),
    del: async <T>(id: number) =>
      await $fetch<T>(`${fullUrl}/delete/${id}`, {
        method: "DELETE",
      }),
  };
};
