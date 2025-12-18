<template>
  <v-data-table
    :headers="processedHeaders"
    :items="items"
    item-key="id"
    :items-per-page="10"
    :hide-default-footer="items.length < 11"
    hover
    no-data-text="沒有資料"
    class="elevation-0"
  >
    <!-- 動作欄位 (條件渲染) -->
    <template v-if="showActions" #item.actions="{ item }">
      <div class="d-flex justify-center ga-2">
        <v-tooltip text="編輯">
          <template #activator="{ props }">
            <base-btn
              v-bind="props"
              icon="mdi-pencil"
              variant="text"
              size="small"
              color="primary"
              @click="$emit('edit', item)"
              aria-label="編輯"
            />
          </template>
        </v-tooltip>
        <v-tooltip text="刪除">
          <template #activator="{ props }">
            <base-btn
              v-bind="props"
              icon="mdi-delete"
              variant="text"
              size="small"
              color="error"
              @click="$emit('remove', item.id)"
              aria-label="刪除"
            />
          </template>
        </v-tooltip>
      </div>
    </template>
    <template v-for="header in headers" #[`item.${header.key}`]="slotProps">
      <slot :name="`item.${header.key}`" v-bind="slotProps">
        {{ slotProps.value }}
      </slot>
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
    align: "center",
    headerProps: {
      class: "text-no-wrap",
    },
    cellProps: {
      class: "text-no-wrap",
    },
  }));
});
const emit = defineEmits(["edit", "remove"]);
</script>
