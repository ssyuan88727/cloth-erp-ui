<template>
  <base-page page-title="退回原因">
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
                <v-col cols="6">
                  <base-text-field
                    v-model="formData.reason"
                    label="原因"
                    required
                    :rules="[required, maxLength(20)]"
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
        :items="listData"
        :showActions="true"
        @edit="editHandler"
        @remove="remove"
      />
    </template>
  </base-page>
</template>

<script lang="ts" setup>
import type { FormMode, ResponseInterface } from "~/types/baseTypes";
import type { ReturnReasonInterface } from "~/types/responseTypes";

definePageMeta({
  name: "退回原因",
});

const headers = [{ title: "原因", key: "reason", align: "center" }];
const { required, maxLength } = useValidateRules();
const { submit, get, del } = useApiClient("/return-reason");
const listData = reactive<ReturnReasonInterface[]>([]);

// 表單狀態管理
const toggleVal = ref<boolean>(false);
const formMode = ref<FormMode>("create");
const formData = reactive<ReturnReasonInterface>({
  id: 0,
  reason: "",
});
const defaultForm = {
  id: 0,
  reason: "",
};

const fetchData = async () => {
  const { body } = await get<ResponseInterface>();
  listData.splice(0, listData.length, ...body);
};

const editHandler = (item: ReturnReasonInterface) => {
  openForm("edit", item);
};

const openForm = (mode: FormMode, item: ReturnReasonInterface = defaultForm) => {
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
  data: ReturnReasonInterface;
}) => {
  try {
    const { body } = await submit(mode, data);
    // 如果是查詢，直接更新列表；如果是新增/修改，建議重新獲取全部資料
    if (mode === "query") {
      listData.splice(0, listData.length, ...body);
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
});
</script>
