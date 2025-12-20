<template>
  <v-textarea v-model="model" :label="label" :rules="rules" :rows="rows" variant="outlined" density="compact"
    hide-details="auto" clearable color="primary" auto-grow v-bind="$attrs" />
</template>

<script setup lang="ts">
const model = defineModel<string | number | null>();
const { label = '',
  rules = [],
  rows = 3,
} = defineProps<{
  label?: string;
  rules?: any[];
  rows?: string | number;
}>();
</script>

<style scoped>
:deep(.v-field__input) {
  line-height: 1.5;
}
</style>