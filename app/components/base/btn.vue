<template>
  <v-btn
    :class="classAtr"
    v-bind="$attrs"
  />
</template>

<script lang="ts" setup>
  const {
    classAtr = "rounded-lg me-3",
  } = defineProps<{
    classAtr?: string;
  }>();
</script>
