import type { SweetAlertOptions } from "sweetalert2";

export const useAlert = () => {
  const { $swal, $toast, $confirm } = useNuxtApp();

  return {
    success: (title: string) => $toast.fire({ icon: "success", title }),
    error: (text: string) =>
      $swal.fire({ icon: "error", title: "錯誤", text }),
    confirm: (options: SweetAlertOptions) => {
      options = {
        ...options,
        icon: "warning",
        showCancelButton: options.showCancelButton ?? true,
        confirmButtonText: options.confirmButtonText ?? "確定",
        cancelButtonText: options.cancelButtonText ?? "取消",
      };
      return $confirm.fire(options);
    },
  };
};
