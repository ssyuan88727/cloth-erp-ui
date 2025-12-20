<template>
  <base-page title="會員管理">
    <template #actions>
      <base-btn text="新增" prepend-icon="mdi-plus" color="primary" @click="openForm('create')" />
      <base-btn text="查詢" prepend-icon="mdi-magnify" color="grey" @click="openForm('query')" />
    </template>
    <base-data-form v-model="toggleForm" :mode="formMode" :formData="formData" @submit="handleFormSubmit"
      @cancel="closeForm">
      <v-row>
        <v-col>
          <base-text-field v-model="formData.code" label="代號" :disabled="formMode === 'edit'"
            :rules="[required, maxLength(20)]" />
        </v-col>
        <v-col>
          <base-text-field v-model="formData.name" label="名稱" :disabled="formMode === 'edit'"
            :rules="[required, maxLength(50)]" />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <base-text-field v-model="formData.phone" label="電話" :rules="[isNumber, maxLength(20)]" />
        </v-col>
        <v-col>
          <base-text-field v-model="formData.email" label="電子郵件" type="email" :rules="[isEmail, maxLength(100)]" />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <base-text-field v-model="formData.address" label="地址" :rules="[maxLength(255)]" />
        </v-col>
        <v-col>
          <base-date-picker v-if="formMode !== 'query'" v-model="formData.joinDate" label="加入日期"
            :disabled="formMode === 'edit'" />
          <v-row v-else>
            <v-col>
              <base-date-picker v-model="formData.joinDateS" label="加入日期(起)" />
            </v-col>
            <v-col>
              <base-date-picker v-model="formData.joinDateE" label="加入日期(迄)" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <base-radio-group v-model="formData.isActive" label="狀態" :options="activeOptions" />
        </v-col>
        <v-col>
          <base-date-picker v-if="formMode !== 'query'" v-model="formData.createAt" label="建立時間" disabled />
          <v-row v-else>
            <v-col>
              <base-date-picker v-model="formData.createAtS" label="建立時間(起)" />
            </v-col>
            <v-col>
              <base-date-picker v-model="formData.createAtE" label="建立時間(迄)" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <base-date-picker v-if="formMode !== 'query'" v-model="formData.updateAt" label="更新時間" disabled />
          <v-row v-else>
            <v-col>
              <base-date-picker v-model="formData.updateAtS" label="更新時間(起)" />
            </v-col>
            <v-col>
              <base-date-picker v-model="formData.updateAtE" label="更新時間(迄)" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </base-data-form>
    <base-data-table :headers="headers" :items="listData" deletable editable @edit="edit" @remove="remove">
      <template #item.isActive="{ value }">
        <v-chip :color="value ? 'success' : 'error'" size="small" label>
          {{ value ? "一般" : "封鎖" }}
        </v-chip>
      </template>
    </base-data-table>
  </base-page>
</template>

<script lang="ts" setup>
import type {
  FormMode,
  RadioOption,
  ResponseInterface,
} from "~/types/baseTypes";
import type { MemberInterface } from "~/types/responseTypes";

const headers = [
  { title: "代號", key: "code" },
  { title: "名稱", key: "name" },
  { title: "電話", key: "phone" },
  { title: "電子郵件", key: "email" },
  { title: "地址", key: "address" },
  { title: "加入日期", key: "joinDate" },
  { title: "總購買件數", key: "totQty" },
  { title: "總消費金額", key: "totAmt" },
  { title: "總消費次數", key: "totCnt" },
  { title: "狀態", key: "isActive" },
  { title: "建立時間", key: "createAt" },
  { title: "更新時間", key: "updateAt" },
];
const { required, maxLength, isNumber, isEmail } = useValidateRules();
const { submit, get, del } = useApiClient("/member");
const { confirm, error, success } = useAlert();
const listData = reactive<MemberInterface[]>([]);
const activeOptions = computed<RadioOption[]>(() => {
  const options: RadioOption[] = [
    { label: "一般", value: true },
    { label: "封鎖", value: false },
  ];
  if (formMode.value === "query") {
    options.unshift({ label: "全部", value: null });
  }
  return options;
});

// 表單狀態管理
const toggleForm = ref<boolean>(false);
const formMode = ref<FormMode>("create");
const formData = reactive<MemberInterface>({
  id: 0,
  code: "",
  name: "",
  phone: "",
  email: "",
  address: "",
  joinDate: "",
  totQty: 0,
  totAmt: 0,
  totCnt: 0,
  isActive: true,
  createAt: "",
  updateAt: "",
  // query
  joinDateS: "",
  joinDateE: "",
  createAtS: "",
  createAtE: "",
  updateAtS: "",
  updateAtE: "",
});
const defaultForm: MemberInterface = {
  id: 0,
  code: "",
  name: "",
  phone: "",
  email: "",
  address: "",
  joinDate: "",
  totQty: 0,
  totAmt: 0,
  totCnt: 0,
  isActive: true,
  createAt: "",
  updateAt: "",
  // query
  joinDateS: "",
  joinDateE: "",
  createAtS: "",
  createAtE: "",
  updateAtS: "",
  updateAtE: "",
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

const edit = (item: MemberInterface) => {
  openForm("edit", item);
};

const openForm = (mode: FormMode, item: MemberInterface = defaultForm) => {
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

const remove = async (item: MemberInterface) => {
  confirm({ title: `確定刪除 ${item.name} 嗎?` }).then((res) => {
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
