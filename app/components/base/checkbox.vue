<template>
  <v-checkbox v-model="model" :hide-details="hideDetails" :density="density" />
</template>
<script setup lang="ts">
const model = defineModel<boolean>();
const {
  hideDetails = true,
  density = "compact",
} = defineProps<{
  hideDetails?: boolean;
  density?: 'default' | 'comfortable' | 'compact';
}>();
</script>