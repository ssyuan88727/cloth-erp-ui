<template>
  <v-radio-group
    v-model="model"
    :label="label"
    :inline="inline"
    :rules="rules"
    hide-details="auto"
    color="primary"
    class="custom-radio-group"
    v-bind="$attrs"
  >
    <template v-if="label" #label>
      <span class="text-subtitle-2 font-weight-bold mb-1">{{ label }}</span>
    </template>

    <v-radio
      v-for="opt in options"
      :key="opt.value"
      :label="opt.label"
      :value="opt.value"
      density="comfortable"
    />
  </v-radio-group>
</template>

<script setup lang="ts">
const model = defineModel<any>();

interface Option {
  label: string;
  value: any;
}

interface Props {
  label?: string;
  options: Option[];
  inline?: boolean;
  rules?: any[];
}

withDefaults(defineProps<Props>(), {
  inline: true,
  rules: () => [],
});
</script>

<style scoped>
.custom-radio-group :deep(.v-selection-control-group) {
  gap: 16px; /* 增加選項間的間距，提升觸控/點擊精準度 */
}
</style>
