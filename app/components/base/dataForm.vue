<template>
  <v-form ref="formRef" @submit.prevent="submitForm">
    <v-card-title class="text-h6 font-weight-bold text-primary py-4 px-6">
      {{ formTitle }}
    </v-card-title>
    <v-card-text class="py-4 px-6">
      <slot />
    </v-card-text>
    <v-divider />
    <v-card-actions
      class="align-center justify-end py-3 px-6 bg-grey-lighten-4"
    >
      <v-btn
        variant="outlined"
        color="secondary"
        @click="closeForm"
        class="rounded-lg"
        text="取消"
      />
      <v-btn
        type="submit"
        color="primary"
        class="rounded-lg font-weight-bold"
        :text="formSubmitText"
      />
    </v-card-actions>
  </v-form>
</template>

<script lang="ts" setup>
import type { FormMode } from "~/types/baseTypes";

const { mode = "create", formData } = defineProps<{
  mode: FormMode;
  formData: object;
}>();
const emit = defineEmits(["submit", "cancel"]);

// 內部 state 避免直接修改 prop
const formRef = ref<any>(null); // Vuetify form ref
const formTitle = computed<string>(() => {
  switch (mode) {
    case "edit":
      return "編輯";
    case "query":
      return "查詢";
    default:
      return "新增";
  }
});
const formSubmitText = computed<string>(() =>
  mode === "query" ? "查詢" : "儲存"
);

const submitForm = async () => {
  if (mode !== "query") {
    const { valid } = await formRef.value.validate();
    if (!valid) return;
  }
  emit("submit", { mode, data: formData });
};
const closeForm = () => {
  emit("cancel");
};
</script>
