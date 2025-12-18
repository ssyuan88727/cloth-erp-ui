<template>
  <v-menu
    v-model="isMenuOpen"
    :close-on-content-click="false"
    transition="scale-transition"
    min-width="auto"
  >
    <template #activator="{ props }">
      <base-text-field
        v-model="formattedDate"
        v-bind="$attrs"
        :label="label"
        readonly
        @click:clear="clearDate"
        :rules="rules"
      />
    </template>

    <v-date-picker
      v-model="selectedDate"
      @update:model-value="onDateSelected"
      v-bind="$attrs"
      color="primary"
      hide-header
    />
  </v-menu>
</template>

<script setup lang="ts">
const {
  modelValue = "",
  label = "選擇日期",
  rules = [],
} = defineProps<{
  modelValue?: string; // 接收父組件 v-model 的字串日期
  label?: string;
  rules?: [];
}>();

const emit = defineEmits(["update:modelValue"]);

// 狀態控制
const isMenuOpen = ref(false);
const selectedDate = ref<Date | null>(modelValue ? new Date(modelValue) : null);

// 計算顯示在 TextField 中的格式化字串 (YYYY-MM-DD)
const formattedDate = computed(() => {
  if (!selectedDate.value) return "";
  const d = new Date(selectedDate.value);
  return d.toISOString().split("T")[0]; // 取得 YYYY-MM-DD 格式
});

// 當使用者選擇日期後觸發
const onDateSelected = (val: any) => {
  selectedDate.value = val;
  // 將格式化後的字串回傳給父組件的 v-form
  emit("update:modelValue", formattedDate.value);
  // 自動關閉選單
  isMenuOpen.value = false;
};

// 處理清除邏輯
const clearDate = () => {
  selectedDate.value = null;
  emit("update:modelValue", "");
};
</script>
