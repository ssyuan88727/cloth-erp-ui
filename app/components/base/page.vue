<template>
  <!-- 頁面標題區 -->
  <v-card-title class="text-h5 font-weight-bold py-4 px-6 text-indigo-darken-2">
    {{ pageTitle }}
  </v-card-title>
  <v-divider />
  <!-- 功能按鈕區 -->
  <div class="flex align-center mb-6 px-6">
    <slot name="actions" />
  </div>
  <!-- 表單區 -->
  <slot name="formDialog" />
  <!-- 資料表格區 / 主要內容區 -->
  <v-card-text class="pa-4">
    <slot />
  </v-card-text>
</template>

<script lang="ts" setup>
const { pageTitle } = defineProps<{ pageTitle: string }>();
</script>
