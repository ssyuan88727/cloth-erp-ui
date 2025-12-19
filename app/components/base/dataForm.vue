<template>
  <v-dialog :model-value="modelValue" persistent max-width="800px">
    <v-card :loading="loading">
      <v-card-title class="d-flex align-center pa-4">
        <span class="text-h6 font-weight-bold">{{ title }}</span>
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          density="comfortable"
          @click="$emit('update:modelValue', false)"
        />
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-4">
        <v-form ref="formRef" @submit.prevent="handleSubmit">
          <slot />
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          variant="text"
          color="grey-darken-1"
          @click="$emit('update:modelValue', false)"
          text="取消"
        />
        <v-btn
          color="primary"
          variant="elevated"
          :loading="loading"
          class="px-6"
          @click="handleSubmit"
          text="儲存送出"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { FormMode } from "~/types/baseTypes";

const modelValue = defineModel<boolean>();
const {
  mode = "create",
  loading = false,
  deletable = false,
  editable = false,
} = defineProps<{
  mode?: FormMode;
  loading?: boolean;
  deletable?: boolean;
  editable?: boolean;
}>();

const emit = defineEmits(["update:modelValue", "submit"]);
const formRef = ref();
const title = computed(() => {
  switch (mode) {
    case "create":
      return "新增";
    case "edit":
      return "修改";
    case "query":
      return "查詢";
    default:
      return "未知";
  }
});

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate();
  if (mode === "query" || valid) emit("submit");
};
</script>