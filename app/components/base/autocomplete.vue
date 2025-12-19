<template>
  <v-autocomplete
    v-model="model"
    :items="items"
    :label="label"
    :item-title="itemTitle"
    :item-value="itemValue"
    variant="outlined"
    density="compact"
    hide-details="auto"
    color="primary"
    clearable
    auto-select-first
    no-data-text="查無匹配資料"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
const model = defineModel<any>();

defineProps({
  items: { type: Array, required: true },
  label: String,
  itemTitle: { type: String, default: "title" },
  itemValue: { type: String, default: "value" },
});
</script>
