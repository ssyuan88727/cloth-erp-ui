<template>
  <v-text-field
    v-model="model"
    :label="label"
    :rules="rules"
    variant="outlined"
    density="compact"
    hide-details="auto"
    clearable
    color="primary"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
const model = defineModel<string | number | null>();

interface Props {
  label?: string;
  rules?: any[];
}

defineProps<Props>();
</script>
