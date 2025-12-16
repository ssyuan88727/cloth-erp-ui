<template>
  <v-data-table
    :headers="processedHeaders"
    :items="items"
    item-key="id"
    :items-per-page="10"
    hover
    no-data-text="沒有資料"
    class="elevation-0"
  >
    <!-- 動作欄位 (條件渲染) -->
    <template v-if="showActions" #item.actions="{ item }">
      <div class="d-flex align-center justify-center ga-2">
        <v-tooltip text="編輯">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon="mdi-pencil"
              variant="text"
              size="small"
              color="primary"
              @click="$emit('edit', item.raw)"
              aria-label="編輯"
            />
          </template>
        </v-tooltip>
        <v-tooltip text="刪除">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon="mdi-delete"
              variant="text"
              size="small"
              color="error"
              @click="$emit('delete', item.raw)"
              aria-label="刪除"
            />
          </template>
        </v-tooltip>
      </div>
    </template>
  </v-data-table>
</template>

<script lang="ts" setup>
const {
  items = [],
  headers,
  showActions = true,
} = defineProps<{
  items: any[];
  headers: any[];
  showActions: boolean;
}>();

const processedHeaders = computed(() => {
  const newHeaders = [...headers];
  if (showActions && !newHeaders.some((h) => h.key === "actions")) {
    newHeaders.unshift({
      title: "操作",
      key: "actions",
      align: "center",
      sortable: false,
    });
  }
  return newHeaders.map((header) => ({
    ...header,
  }));
});
const emit = defineEmits(["edit", "delete"]);
</script>
