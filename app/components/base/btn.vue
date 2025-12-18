<template>
  <v-btn
    :color="color"
    :variant="variant"
    :loading="loading"
    :disabled="disabled"
    :prepend-icon="prependIcon"
    :append-icon="appendIcon"
    class="text-none font-weight-bold"
    v-bind="$attrs"
  >
    <slot />
  </v-btn>
</template>

<script setup lang="ts">
interface Props {
  color?: string;
  variant?: "flat" | "text" | "elevated" | "tonal" | "outlined" | "plain";
  loading?: boolean;
  disabled?: boolean;
  prependIcon?: string;
  appendIcon?: string;
}

withDefaults(defineProps<Props>(), {
  color: "primary",
  variant: "elevated",
  loading: false,
  disabled: false,
});
</script>
