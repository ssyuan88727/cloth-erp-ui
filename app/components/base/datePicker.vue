<template>
  <v-menu v-model="menu" :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-text-field
        :model-value="model"
        :label="label"
        readonly
        v-bind="props"
        variant="outlined"
        density="compact"
        prepend-inner-icon="mdi-calendar"
        hide-details="auto"
      />
    </template>
    <v-date-picker
      v-model="dateValue"
      color="primary"
      @update:model-value="onDateSelected"
    />
  </v-menu>
</template>

<script setup lang="ts">
const model = defineModel<string>();
const props = defineProps<{ label?: string }>();

const menu = ref(false);
const dateValue = ref(model.value ? new Date(model.value) : new Date());

const onDateSelected = (val: Date) => {
  // 這裡可以整合日期格式化工具 (如 dayjs)
  model.value = val.toISOString().split("T")[0];
  menu.value = false;
};
</script>
