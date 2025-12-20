<template>
  <base-page title="退回原因">
    <template #actions>
      <base-btn text="新增" prepend-icon="mdi-plus" color="primary" @click="openForm('create')" />
      <base-btn text="查詢" prepend-icon="mdi-magnify" color="grey" @click="openForm('query')" />
    </template>
    <base-data-form v-model="toggleForm" :mode="formMode" :formData="formData" @submit="handleFormSubmit"
      @cancel="closeForm">
      <v-row>
        <v-col cols="6">
          <base-text-field v-model="formData.reason" label="原因" required :rules="[required, maxLength(20)]" />
        </v-col>
      </v-row>
    </base-data-form>
    <base-data-table :headers="headers" :items="listData" deletable editable @edit="edit" @remove="remove" />
  </base-page>
</template>

<script lang="ts" setup>
import type { FormMode, ResponseInterface } from "~/types/baseTypes";
import type { ReturnReasonInterface } from "~/types/responseTypes";

const headers = [{ title: "原因", key: "reason", align: "center" }];
const { required, maxLength } = useValidateRules();
const { submit, get, del } = useApiClient("/return-reason");
const { confirm, success, error } = useAlert();
const listData = reactive<ReturnReasonInterface[]>([]);

// 表單狀態管理
const toggleForm = ref<boolean>(false);
const formMode = ref<FormMode>("create");
const formData = reactive<ReturnReasonInterface>({
  id: 0,
  reason: "",
});
const defaultForm: ReturnReasonInterface = {
  id: 0,
  reason: "",
};

const fetchData = () => {
  get<ResponseInterface>()
    .then(({ header, body }) => {
      listData.splice(0, listData.length, ...body);
    })
    .catch((err) => {
      console.error(err);
      error("獲取資料失敗");
    });
};

const edit = (item: ReturnReasonInterface) => {
  openForm("edit", item);
};

const openForm = (
  mode: FormMode,
  item: ReturnReasonInterface = defaultForm
) => {
  formMode.value = mode;
  Object.assign(formData, { ...item });
  toggleForm.value = true;
};

const closeForm = () => {
  toggleForm.value = false;
  Object.assign(formData, { ...defaultForm });
};

const handleFormSubmit = async () => {
  submit(formMode.value, formData)
    .then(({ header, body }) => {
      success("提交成功");
      if (formMode.value === "query") {
        listData.splice(0, listData.length, ...body);
      } else {
        fetchData();
      }
      closeForm();
    })
    .catch((err) => {
      console.error(err);
      error("提交失敗");
    });
};

const remove = async (item: ReturnReasonInterface) => {
  confirm({ title: `確定刪除 ${item.reason} 嗎?` }).then((res) => {
    if (res.isConfirmed) {
      del(item.id)
        .then(() => {
          success("刪除成功");
          fetchData();
        })
        .catch((error) => {
          console.error("刪除失敗", error);
          error("刪除失敗");
        });
    }
  });
};

onMounted(() => {
  fetchData();
});
</script>
