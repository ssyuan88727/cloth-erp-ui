<template>
  <base-page page-title="供應商管理">
    <template #actions>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        class="rounded-lg me-3"
        @click="openForm('create')"
        text="新增"
      />
      <v-btn
        color="grey"
        prepend-icon="mdi-magnify"
        class="rounded-lg me-3"
        @click="openForm('query')"
        text="查詢"
      />
      <v-btn
        color="success"
        prepend-icon="mdi-export"
        class="rounded-lg me-3"
        @exportExcel=""
        text="匯出Excel"
      />
    </template>
    <template #formDialog>
      <v-dialog v-model="toggleVal" max-width="600px" persistent>
        <v-card class="rounded-xl">
          <!-- 內部使用 DataForm 元件 -->
          <base-data-form
            :mode="formMode"
            :formData="formData"
            @submit="handleFormSubmit"
            @cancel="closeForm"
          >
            <v-container fluid>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="formData.code"
                    label="代號"
                    required
                    :disabled="formMode === 'edit'"
                    :rules="[required, maxLength(10), isAlphaNumeric]"
                    variant="outlined"
                    density="comfortable"
                    class="mb-3"
                  />
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="formData.name"
                    label="名稱"
                    required
                    :rules="[required, maxLength(20)]"
                    variant="outlined"
                    density="comfortable"
                    class="mb-3"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="formData.contactName"
                    label="聯絡人"
                    :rules="[maxLength(20)]"
                    variant="outlined"
                    density="comfortable"
                    class="mb-3"
                  />
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="formData.contactPhone"
                    label="聯絡方式"
                    :rules="[maxLength(20)]"
                    variant="outlined"
                    density="comfortable"
                    class="mb-3"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="formData.address"
                    label="地址"
                    :rules="[maxLength(255)]"
                    variant="outlined"
                    density="comfortable"
                    class="mb-3"
                  />
                </v-col>
                <v-col>
                  <v-radio-group
                    v-model="formData.isActive"
                    label="狀態"
                    class="mb-3"
                    inline
                  >
                    <v-radio label="啟用" :value="true" />
                    <v-radio label="停用" :value="false" />
                  </v-radio-group>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="formData.createAt"
                    :disabled="formMode !== 'query'"
                    type="datetime-local"
                    label="建立時間"
                    variant="outlined"
                    density="comfortable"
                    class="mb-3"
                  />
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="formData.updateAt"
                    :disabled="formMode !== 'query'"
                    type="datetime-local"
                    label="更新時間"
                    variant="outlined"
                    density="comfortable"
                    class="mb-3"
                  />
                </v-col>
              </v-row>
            </v-container>
          </base-data-form>
        </v-card>
      </v-dialog>
    </template>
    <template #default>
      <!-- 3. 資料表格區 (Default Slot) -->

      <base-data-table
        :headers="headers"
        :items="supplier"
        :showActions="true"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </template>
  </base-page>
</template>

<script lang="ts" setup>
import type { FormMode } from "~/types/baseTypes";
import type { SupplierForm, SupplierResponse } from "~/types/supplierTypes";

definePageMeta({
  name: "供應商管理",
});

// 表格欄位設定 (動態欄位)
const headers = [
  { title: "代號", key: "code", align: "start" },
  { title: "名稱", key: "name" },
  { title: "聯絡人", key: "contactName" },
  { title: "聯絡方式", key: "contactPhone" },
  { title: "地址", key: "address" },
  { title: "狀態", key: "isActive", align: "center" },
  { title: "建立時間", key: "createdAt", align: "end" },
  { title: "更新時間", key: "updatedAt", align: "end" },
];
// 假資料
const initSupplier: SupplierResponse[] = [
  {
    id: 1,
    code: "MG",
    name: "MyGirl",
    contactName: "John Doe",
    contactPhone: "123-456-7890",
    address: "123 Main St",
    isActive: true,
    createAt: "",
    updateAt: "",
  },
  {
    id: 2,
    code: "YK",
    name: "優凱",
    contactName: "Sam Smith",
    contactPhone: "456-789-0123",
    address: "456 Elm St",
    isActive: true,
    createAt: "",
    updateAt: "",
  },
  {
    id: 3,
    code: "YG",
    name: "優格",
    contactName: "Kelly Johnson",
    contactPhone: "789-012-3456",
    address: "789 OakMain St",
    isActive: true,
    createAt: "",
    updateAt: "",
  },
];

const { required, maxLength, isAlphaNumeric } = useValidateRules();
const { get, post, put, del } = useApiClient("/supplier");
const supplier = reactive<SupplierResponse[]>(initSupplier);

// 表單狀態管理
const toggleVal = ref(false);
const formMode = ref<FormMode>("create");
const formData = reactive<SupplierResponse>({
  id: 0,
  code: "",
  name: "",
  contactName: "",
  contactPhone: "",
  address: "",
  isActive: true,
  createAt: "",
  updateAt: "",
});
const defaultForm = {
  id: 0,
  code: "",
  name: "",
  contactName: "",
  contactPhone: "",
  address: "",
  isActive: true,
  createAt: "",
  updateAt: "",
};

const openForm = (mode: FormMode, item = defaultForm) => {
  formMode.value = mode;
  // 複製一份資料給表單，確保不會直接修改表格資料
  Object.assign(formData, { ...item });
  toggleVal.value = true;
  console.log("openForm: ", toggleVal.value);
};

// 處理表格發出的編輯事件
const handleEdit = (item: SupplierResponse) => {
  openForm("edit", item);
};

// 關閉表單並重設狀態
const closeForm = () => {
  toggleVal.value = false;
  Object.assign(formData, { ...defaultForm });
};

// 處理表單提交
const handleFormSubmit = ({
  data,
  mode,
}: {
  data: SupplierForm;
  mode: "create" | "edit";
}) => {
  console.log(`Submitting form in ${mode} mode:`, data);

  if (mode === "create") {
    // 模擬新增邏輯
  } else if (mode === "edit") {
    // 模擬修改邏輯
  }
  closeForm();
};

// 處理刪除事件
const handleDelete = (item: SupplierResponse) => {};

onMounted(async () => {
  const { header, body } = await get();
  console.log(header);
  console.log(body);
});
</script>
