<template>
  <v-container fluid class="pa-6">
    <header class="d-flex align-center mb-6">
      <div>
        <h1 class="text-h5 font-weight-bold color-primary">
          <slot name="title">{{ title }}</slot>
        </h1>
        <v-breadcrumbs v-if="breadcrumbs.length" :items="breadcrumbs" class="pa-0 mt-1" />
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
const {
  title = "",
  breadcrumbs = [],
} = defineProps<{
  title?: string;
  breadcrumbs?: any[];
}>();
</script>

<style scoped>
.v-container {
  min-height: calc(100vh - 64px);
  background-color: #f5f7fa;
}
</style>
