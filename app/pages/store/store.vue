<template>
  <base-page page-title="店鋪管理">
    <template #actions>
      <base-btn
        text="新增"
        prepend-icon="mdi-plus"
        color="primary"
        @click="openForm('create')"
      />
      <base-btn
        text="查詢"
        prepend-icon="mdi-magnify"
        color="grey"
        @click="openForm('query')"
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
                  <base-text-field
                    v-model="formData.code"
                    label="代號"
                    :disabled="formMode === 'edit'"
                    :rules="[required, maxLength(10)]"
                  />
                </v-col>
                <v-col>
                  <base-text-field
                    v-model="formData.name"
                    label="名稱"
                    :rules="[required, maxLength(20)]"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <base-autocomplete
                    v-model="formData.storeTypeId"
                    label="店鋪類別"
                    :rules="[required]"
                    :items="storeTypes"
                    :multiple="formMode === 'query'"
                    item-title="name"
                    item-value="id"
                  />
                </v-col>
                <v-col>
                  <base-radio-group v-model="formData.isActive" label="狀態">
                    <v-radio
                      v-if="formMode === 'query'"
                      label="全部"
                      :value="null"
                    />
                    <v-radio label="啟用" :value="true" />
                    <v-radio label="停用" :value="false" />
                  </base-radio-group>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <base-date-picker
                    v-if="formMode !== 'query'"
                    v-model="formData.createAt"
                    label="建立時間"
                    disabled
                  />
                  <v-row v-else>
                    <v-col>
                      <base-date-picker
                        v-model="formData.createAtS"
                        label="建立時間(起)"
                      />
                    </v-col>
                    <v-col>
                      <base-date-picker
                        v-model="formData.createAtE"
                        label="建立時間(迄)"
                      />
                    </v-col>
                  </v-row>
                </v-col>
                <v-col>
                  <base-date-picker
                    v-if="formMode !== 'query'"
                    v-model="formData.updateAt"
                    label="更新時間"
                    disabled
                  />
                  <v-row v-else>
                    <v-col>
                      <base-date-picker
                        v-model="formData.updateAtS"
                        label="更新時間(起)"
                      />
                    </v-col>
                    <v-col>
                      <base-date-picker
                        v-model="formData.updateAtE"
                        label="更新時間(迄)"
                      />
                    </v-col>
                  </v-row>
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
        :items="listData"
        deletable
        editable
        @edit="edit"
        @remove="remove"
      >
        <template #item.storeType="{ value }">
          {{ value.name }}
        </template>
        <template #item.isActive="{ value }">
          <v-chip :color="value ? 'success' : 'error'" size="small" label>
            {{ value ? "啟用" : "停用" }}
          </v-chip>
        </template>
      </base-data-table>
    </template>
  </base-page>
</template>

<script lang="ts" setup>
import type { FormMode, ResponseInterface } from "~/types/baseTypes";
import type { StoreInterface, StoreTypeInterface } from "~/types/responseTypes";

definePageMeta({
  name: "店鋪管理",
});

const headers = [
  { title: "代號", key: "code" },
  { title: "名稱", key: "name" },
  { title: "店鋪類別", key: "storeType" },
  { title: "狀態", key: "isActive" },
  { title: "建立時間", key: "createAt" },
  { title: "更新時間", key: "updateAt" },
];
const { required, maxLength } = useValidateRules();
const { submit, get, del } = useApiClient("/store");
const listData = reactive<StoreInterface[]>([]);

// 表單狀態管理
const toggleVal = ref<boolean>(false);
const formMode = ref<FormMode>("create");
const formData = reactive<StoreInterface>({
  id: 0,
  code: "",
  name: "",
  storeType: {
    id: 0,
    name: "",
  },
  storeTypeId: 0,
  isActive: true,
  createAt: "",
  updateAt: "",
  // query
  createAtS: "",
  createAtE: "",
  updateAtS: "",
  updateAtE: "",
});
const defaultForm = {
  id: 0,
  code: "",
  name: "",
  storeType: {
    id: 0,
    name: "",
  },
  storeTypeId: 0,
  isActive: true,
  createAt: "",
  updateAt: "",
  // query
  createAtS: "",
  createAtE: "",
  updateAtS: "",
  updateAtE: "",
};
const storeTypes = reactive<StoreTypeInterface[]>([]);

const fetchData = async () => {
  const response = await get<ResponseInterface | StoreInterface[]>();
  const items = Array.isArray(response) ? response : response?.body;
  if (Array.isArray(items)) {
    listData.splice(0, listData.length, ...items);
    console.log(listData);
  }
};

const edit = (item: StoreInterface) => {
  openForm("edit", item);
};

const openForm = (mode: FormMode, item: StoreInterface = defaultForm) => {
  formMode.value = mode;
  // 複製一份資料給表單，確保不會直接修改表格資料
  Object.assign(formData, { ...item });
  toggleVal.value = true;
};

// 關閉表單並重設狀態
const closeForm = () => {
  toggleVal.value = false;
  Object.assign(formData, { ...defaultForm });
};

// 處理表單提交
const handleFormSubmit = async ({
  mode,
  data,
}: {
  mode: FormMode;
  data: StoreInterface;
}) => {
  try {
    console.log(data);
    debugger;
    const response = await submit(mode, data);
    // 如果是查詢，直接更新列表；如果是新增/修改，建議重新獲取全部資料
    if (mode === "query") {
      const items = Array.isArray(response) ? response : response?.body;
      if (Array.isArray(items)) {
        listData.splice(0, listData.length, ...items);
      }
    } else {
      await fetchData(); // 封裝後的重整函數
    }
    closeForm();
  } catch (error) {
    console.error("提交失敗", error);
    // 此處可擴充全域 Snackbar 提示
  }
};

// 處理刪除事件
const remove = async (id: number) => {
  try {
    const { header } = await del(id);
    await fetchData();
  } catch (error) {
    console.error("刪除失敗", error);
    // 此處可擴充全域 Snackbar 提示
  }
};

onMounted(async () => {
  await fetchData();

  const { get: getStoreTypes } = useApiClient("/store-type");
  const res = await getStoreTypes<ResponseInterface | StoreTypeInterface[]>();
  const items = Array.isArray(res) ? res : res?.body;
  if (Array.isArray(items)) {
    storeTypes.splice(0, storeTypes.length, ...items);
  }
});
</script>
