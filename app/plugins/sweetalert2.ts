import Swal from "sweetalert2";

export default defineNuxtPlugin(() => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  const btnClass =
    "v-btn v-btn--elevated v-theme--light v-btn--density-default v-btn--size-default v-btn--variant-elevated text-none font-weight-bold me-2";
  const Confirm = Swal.mixin({
    cancelButtonColor: "#CFD8DC",
    reverseButtons: true,
    customClass: {
      confirmButton: `${btnClass} bg-primary`,
      cancelButton: `${btnClass} bg-grey`,
    },
    buttonsStyling: false,
  });

  return {
    provide: {
      swal: Swal,
      toast: Toast,
      confirm: Confirm,
    },
  };
});
