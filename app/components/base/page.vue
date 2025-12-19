<template>
  <v-container fluid class="pa-6">
    <header class="d-flex align-center mb-6">
      <div>
        <h1 class="text-h5 font-weight-bold color-primary">
          <slot name="title">{{ title }}</slot>
        </h1>
        <v-breadcrumbs
          v-if="breadcrumbs.length"
          :items="breadcrumbs"
          class="pa-0 mt-1"
        />
      </div>

      <v-spacer />

      <div class="d-flex gap-2">
        <slot name="actions" />
      </div>
    </header>

    <main>
      <slot />
    </main>
  </v-container>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  breadcrumbs?: any[];
}

withDefaults(defineProps<Props>(), {
  title: "",
  breadcrumbs: () => [],
});
</script>

<style scoped>
/* 統一 ERP 頁面背景或特定過渡效果 */
.v-container {
  min-height: calc(100vh - 64px); /* 扣除 AppBar 高度 */
  background-color: #f5f7fa; /* 輕微的灰色背景增加層次感 */
}
</style>
