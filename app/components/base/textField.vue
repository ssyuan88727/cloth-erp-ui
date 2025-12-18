<template>
  <v-text-field
    v-model="model"
    :label="label"
    :rules="rules"
    variant="outlined"
    density="compact"
    hide-details="auto"
    clearable
    class="mb-2"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
const model = defineModel<string | number>();

interface Props {
  label?: string;
  rules?: any[];
}

defineProps<Props>();
</script>
