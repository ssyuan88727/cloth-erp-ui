<template>
  <v-text-field
    v-model="internalValue"
    :label="label"
    :variant="variant"
    :density="density"
    :class="classAtr"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
const {
  modelValue = "",
  label = "",
  variant = "outlined",
  density = "comfortable",
  classAtr = "mb-3",
} = defineProps<{
  modelValue?: string | number | null;
  label?: string;
  variant?:
    | "filled"
    | "outlined"
    | "plain"
    | "solo"
    | "solo-filled"
    | "solo-inverted"
    | "underlined"
    | undefined;
  density?: "default" | "comfortable" | "compact";
  classAtr?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const internalValue = computed({
  get: () => modelValue,
  set: (newValue) => {
    emit("update:modelValue", newValue);
  },
});
</script>
