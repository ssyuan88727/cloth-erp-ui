<template>
  <v-card variant="flat" border class="mt-4">
    <v-toolbar color="transparent" density="comfortable">
      <v-toolbar-title class="text-subtitle-1 font-weight-bold">
        <slot name="title">{{ title }}</slot>
      </v-toolbar-title>
      <v-spacer />

      <v-menu :close-on-content-click="false" location="bottom end">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            icon="mdi-view-column-outline"
            variant="text"
            density="comfortable"
          />
        </template>
        <v-list density="compact" class="pa-2" min-width="200">
          <v-list-subheader>顯示欄位設定</v-list-subheader>
          <v-list-item v-for="header in headers" :key="header.key">
            <v-checkbox
              v-model="visibleKeys"
              :label="header.title"
              :value="header.key"
              hide-details
              density="compact"
              color="primary"
            />
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>

    <v-data-table
      v-model:expanded="expanded"
      :headers="activeHeaders"
      :items="items"
      :loading="loading"
      :show-expand="expandable"
      hover
      multi-sort
      class="base-data-table"
      v-bind="$attrs"
    >
      <template v-if="deletable" #item.delete="{ item }">
        <base-btn
          icon="mdi-delete"
          variant="text"
          color="error"
          @click="$emit('remove', item)"
        />
      </template>
      <template v-if="editable" #item.edit="{ item }">
        <base-btn
          icon="mdi-pencil"
          variant="text"
          color="primary"
          @click="$emit('edit', item)"
        />
      </template>
      <template v-if="showDetail" #item.detail="{ item }">
        <base-btn
          icon="mdi-eye"
          variant="text"
          color="secondary"
          @click="$emit('detail', item.id)"
        />
      </template>
      <template #item.serial="{ index }">
        {{ index + 1 }}
      </template>
      <template v-for="(_, name) in $slots" v-slot:[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>

      <template v-if="expandable" v-slot:expanded-row="{ columns, item }">
        <tr>
          <td :colspan="columns.length" class="bg-grey-lighten-4">
            <slot name="expanded-content" :item="item" />
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
const {
  title = "",
  headers,
  items,
  loading = false,
  expandable = false,
  deletable = false,
  editable = false,
  showDetail = false,
} = defineProps<{
  title?: string;
  headers: any[];
  items: any[];
  loading?: boolean;
  expandable?: boolean;
  deletable?: boolean;
  editable?: boolean;
  showDetail?: boolean;
}>();

const expanded = ref([]);
const visibleKeys = ref(headers.map((h) => h.key));

const activeHeaders = computed(() => {
  const newHeader = headers.filter((h) => visibleKeys.value.includes(h.key));
  if (showDetail) {
    newHeader.unshift({
      title: "詳細",
      key: "detail",
      width: 30,
      sortable: false,
    });
  }
  if (deletable) {
    newHeader.unshift({
      title: "刪除",
      key: "delete",
      width: 30,
      sortable: false,
    });
  }
  if (editable) {
    newHeader.unshift({
      title: "編輯",
      key: "edit",
      width: 30,
      sortable: false,
    });
  }
  newHeader.unshift({
    title: "序號",
    key: "serial",
    sortable: false,
    width: 50,
  });
  return newHeader.map((header) => {
    Object.assign(header, { ...header, align: header.align || "center", nowrap: true });
    return header;
  });
});
</script>

<style scoped>
.base-data-table :deep(.v-data-table-header__content) {
  white-space: nowrap !important;
  font-weight: 600;
}
.base-data-table :deep(.v-data-table__td) {
  white-space: nowrap !important;
}
.base-data-table :deep(th),
.base-data-table :deep(td) {
  border: 1px solid #e0e0e0;
}
</style>
