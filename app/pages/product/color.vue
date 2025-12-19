<template>
  <base-page page-title="顏色管理">
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
    <base-data-form
      v-model="toggleVal"
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
      </v-container>
    </base-data-form>
    <base-data-table
      :headers="headers"
      :items="listData"
      deletable
      editable
      @edit="edit"
      @remove="remove"
    />
  </base-page>
</template>

<script lang="ts" setup>
import type { FormMode, ResponseInterface } from "~/types/baseTypes";
import type { ColorInterface } from "~/types/responseTypes";

const headers = [
  { title: "代號", key: "code" },
  { title: "名稱", key: "name" },
];
const { required, maxLength } = useValidateRules();
const { submit, get, del } = useApiClient("/color");
const { confirm, success } = useAlert();
const listData = reactive<ColorInterface[]>([]);

// 表單狀態管理
const toggleVal = ref<boolean>(false);
const formMode = ref<FormMode>("create");
const formData = reactive<ColorInterface>({
  id: 0,
  code: "",
  name: "",
});
const defaultForm: ColorInterface = {
  id: 0,
  code: "",
  name: "",
};

const fetchData = () => {
  get<ResponseInterface>()
    .then(({ header, body }) => {
      listData.splice(0, listData.length, ...body);
    })
    .catch((err) => {
      console.error(err);
    });
};

const edit = (item: ColorInterface) => {
  openForm("edit", item);
};

const openForm = (mode: FormMode, item: ColorInterface = defaultForm) => {
  formMode.value = mode;
  Object.assign(formData, { ...item });
  toggleVal.value = true;
};

const closeForm = () => {
  toggleVal.value = false;
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
    });
};

const remove = async (item: ColorInterface) => {
  confirm({ title: `確定刪除 ${item.name} 嗎?` }).then((res) => {
    if (res.isConfirmed) {
      del(item.id)
        .then(() => {
          success("刪除成功");
          fetchData();
        })
        .catch((error) => {
          console.error("刪除失敗", error);
        });
    }
  });
};

onMounted(() => {
  fetchData();
});
</script>
