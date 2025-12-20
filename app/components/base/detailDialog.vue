<template>
  <v-dialog v-model="modelValue">
    <v-card class="pa-6">
      <v-card-title class="d-flex align-center pa-4">
        <span class="text-h6 font-weight-bold">{{ title }}</span>
        <v-spacer />
        <v-btn icon="mdi-close" density="comfortable" variant="text" @click="$emit('update:modelValue', false)" />
      </v-card-title>
      <div class="d-flex gap-2 pa-4">
        <v-spacer />
        <slot name="actions" />
      </div>
      <v-card-text>
        <base-data-table :headers="header" :items="items" deletable editable>
          <template v-if="deletable" #item.delete="{ item }">
            <base-btn icon="mdi-delete" variant="text" color="error" @click="$emit('remove', item)" />
          </template>
          <template v-if="editable" #item.edit="{ item }">
            <base-btn icon="mdi-pencil" variant="text" color="primary" @click="$emit('edit', item)" />
          </template>
          <template #item.serial="{ index }">
            {{ index + 1 }}
          </template>
          <template v-for="(_, name) in $slots" v-slot:[name]="slotData">
            <slot :name="name" v-bind="slotData" />
          </template>
        </base-data-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
const modelValue = defineModel<boolean>();
const {
  title = "",
  header,
  items,
  deletable = false,
  editable = false,
} = defineProps<{
  title?: string;
  header: any[];
  items: any[];
  deletable?: boolean;
  editable?: boolean;
}>();
const emit = defineEmits(["remove", "edit", "update:modelValue"])
</script>