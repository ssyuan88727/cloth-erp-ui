<template>
  <v-autocomplete
    v-model="internalValue"
    v-bind="$attrs"
    :variant="variant"
    :class="classAtr"
    :clearable="clearable"
  />
</template>
<script setup lang="ts">
const {
  modelValue = "",
  variant = "outlined",
  classAtr = "mb-3",
  clearable = true,
} = defineProps<{
  modelValue?: string | string[] | number | number[] | null;
  variant?:
    | "outlined"
    | "plain"
    | "underlined"
    | "filled"
    | "solo"
    | "solo-inverted"
    | "solo-filled";
  classAtr?: string;
  clearable?: boolean;
}>();

const emit = defineEmits(["update:modelValue"]);

const internalValue = computed({
  get: () => modelValue,
  set: (newValue) => {
    emit("update:modelValue", newValue);
  },
});
</script>
