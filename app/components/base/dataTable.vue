<template>
  <v-data-table
    :headers="processedHeaders"
    :items="items"
    item-key="id"
    :items-per-page="10"
    hover
    :show-expand="expandable"
    :item-value="itemValue"
    no-data-text="沒有資料"
    class="elevation-0"
  >
    <!-- 動作欄位 (條件渲染) -->
    <template v-if="deletable" #item.delete="{ item }">
      <div class="d-flex justify-center ga-2">
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
    <template v-if="editable" #item.edit="{ item }">
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
      </div>
    </template>
    <template v-if="expandable" #item.more="{ item }">
      <div class="d-flex justify-center ga-2">
        <v-tooltip :text="moreFlag ? '收合' : '更多'">
          <template #activator="{ props }">
            <base-btn
              v-bind="props"
              :icon="moreFlag ? 'mdi-chevron-up' : 'mdi-dots-vertical'"
              variant="text"
              size="small"
              color="primary"
              aria-label="更多"
              @click="more"
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
import { ref, computed } from "vue";
const {
  items = [],
  headers,
  deletable = false,
  editable = false,
  expandable = false,
  itemValue = "id",
} = defineProps<{
  items?: any[];
  headers: any[];
  deletable?: boolean;
  editable?: boolean;
  expandable?: boolean;
  itemValue?: string;
}>();

const moreFlag = ref(false);

const processedHeaders = computed(() => {
  let newHeaders = [...headers];
  if (!moreFlag.value) {
    newHeaders = newHeaders.filter((h) => !h.removable);
  }
  if (expandable && !newHeaders.some((h) => h.key === "more")) {
    newHeaders.unshift({
      title: "更多",
      key: "more",
      sortable: false,
      width: 1,
    });
  }
  if (deletable && !newHeaders.some((h) => h.key === "delete")) {
    newHeaders.unshift({
      title: "刪除",
      key: "delete",
      sortable: false,
      width: 1,
    });
  }
  if (editable && !newHeaders.some((h) => h.key === "edit")) {
    newHeaders.unshift({
      title: "編輯",
      key: "edit",
      sortable: false,
      width: 1,
    });
  }
  return newHeaders.map((header) => ({
    ...header,
    align: "center",
    headerProps: {
      class: "text-no-wrap justify-center",
    },
    cellProps: {
      class: "text-no-wrap",
    },
  }));
});
const emit = defineEmits(["edit", "remove"]);

const more = () => {
  moreFlag.value = !moreFlag.value;
};
</script>
