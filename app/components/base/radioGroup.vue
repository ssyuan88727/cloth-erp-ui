<template>
  <v-radio-group
    v-model="internalValue"
    :label="label"
    class="mb-3"
    v-bind="$attrs"
  >
    <slot />
  </v-radio-group>
</template>

<script lang="ts" setup>
const { modelValue = "", label = "" } = defineProps<{
  modelValue?: string | number | boolean | null;
  label?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const internalValue = computed({
  get: () => modelValue,
  set: (newValue) => {
    emit("update:modelValue", newValue);
  },
});
</script>
