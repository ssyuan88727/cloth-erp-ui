<template>
  <v-radio-group
    v-model="model"
    :label="label"
    :inline="inline"
    hide-details="auto"
    v-bind="$attrs"
  >
    <v-radio
      v-for="opt in options"
      :key="opt.value"
      :label="opt.label"
      :value="opt.value"
      color="primary"
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
}

withDefaults(defineProps<Props>(), {
  inline: true
});
</script>