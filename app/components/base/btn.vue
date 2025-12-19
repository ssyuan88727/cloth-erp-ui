<template>
  <v-btn
    :color="color"
    :variant="variant"
    :prepend-icon="prependIcon"
    :append-icon="appendIcon"
    :loading="loading"
    :disabled="disabled"
    class="text-none font-weight-bold"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
interface Props {
  color?: string;
  variant?: "flat" | "text" | "elevated" | "tonal" | "outlined" | "plain";
  prependIcon?: string;
  appendIcon?: string;
  loading?: boolean;
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  color: "primary",
  variant: "elevated",
  loading: false,
  disabled: false,
});
</script>
