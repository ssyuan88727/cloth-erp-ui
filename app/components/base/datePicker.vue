<template>
  <v-menu v-model="isMenuOpen" :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-text-field
        :model-value="model"
        v-bind="{ ...props, ...$attrs }"
        :label="label"
        readonly
        variant="outlined"
        density="compact"
        hide-details="auto"
        prepend-inner-icon="mdi-calendar"
        color="primary"
      />
    </template>
    <v-date-picker
      v-model="internalDate"
      color="primary"
      :min="min"
      :max="max"
      @update:model-value="handleDateUpdate"
    />
  </v-menu>
</template>

<script setup lang="ts">
const model = defineModel<string | null>();
const {
  label,
  min = new Date("1900-01-01"),
  max = new Date(),
} = defineProps<{ label?: string; min?: Date; max?: Date }>();

const isMenuOpen = ref(false);
const internalDate = ref(model.value ? new Date(model.value) : null);

const handleDateUpdate = (newDate: Date | null) => {
  if (newDate) {
    // 簡單格式化 YYYY-MM-DD
    model.value = newDate.toISOString().split("T")[0];
    isMenuOpen.value = false;
  }
};
</script>
