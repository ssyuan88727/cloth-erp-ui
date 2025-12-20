<template>
  <base-page title="供應商管理">
    <template #actions>
      <base-btn text="新增" prepend-icon="mdi-plus" color="primary" @click="openForm('create')" />
      <base-btn text="查詢" prepend-icon="mdi-magnify" color="grey" @click="openForm('query')" />
    </template>
    <base-data-form v-model="toggleForm" :mode="formMode" @submit="handleFormSubmit">
      <v-row>
        <v-col>
          <base-text-field v-model="formData.code" label="代號" required :disabled="formMode === 'edit'"
            :rules="[required, maxLength(10), isAlphaNumeric]" />
        </v-col>
        <v-col>
          <base-text-field v-model="formData.name" label="名稱" required :rules="[required, maxLength(20)]" />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <base-text-field v-model="formData.contactName" label="聯絡人" :rules="[maxLength(20)]" />
        </v-col>
        <v-col>
          <base-text-field v-model="formData.contactPhone" label="聯絡方式" :rules="[isNumber, maxLength(20)]" />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <base-text-field v-model="formData.address" label="地址" :rules="[maxLength(255)]" />
        </v-col>
        <v-col>
          <base-radio-group v-model="formData.isActive" label="狀態" class="mb-3" :options="activeOptions" />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <base-date-picker v-if="formMode !== 'query'" v-model="formData.createAt" type="datetime-local" disabled
            label="建立時間" />
          <v-row v-if="formMode === 'query'">
            <v-col>
              <base-date-picker v-model="formData.createAtS" label="建立時間(起)" />
            </v-col>
            <v-col>
              <base-date-picker v-model="formData.createAtE" label="建立時間(迄)" />
            </v-col>
          </v-row>
        </v-col>
        <v-col>
          <base-date-picker v-if="formMode !== 'query'" v-model="formData.updateAt" disabled type="datetime-local"
            label="更新時間" />
          <v-row v-if="formMode === 'query'">
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
    <!-- 3. 資料表格區 (Default Slot) -->
    <base-data-table :headers="headers" :items="listData" deletable editable show-sequence @edit="edit"
      @remove="remove">
      <template #item.isActive="{ value }">
        <v-chip :color="value ? 'success' : 'error'" size="small" label>
          {{ value ? "啟用" : "停用" }}
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
import type { SupplierInterface } from "~/types/responseTypes";

// 表格欄位設定 (動態欄位)
const headers = [
  { title: "代號", key: "code" },
  { title: "名稱", key: "name" },
  { title: "聯絡人", key: "contactName" },
  { title: "聯絡方式", key: "contactPhone" },
  { title: "地址", key: "address" },
  { title: "狀態", key: "isActive" },
  { title: "建立時間", key: "createAt" },
  { title: "更新時間", key: "updateAt" },
];

const { required, maxLength, isNumber, isAlphaNumeric } = useValidateRules();
const { submit, get, del } = useApiClient("/supplier");
const { confirm, error, success } = useAlert();
const listData = reactive<SupplierInterface[]>([]);
const activeOptions = computed<RadioOption[]>(() => {
  const options: RadioOption[] = [
    { label: "啟用", value: true },
    { label: "停用", value: false },
  ];
  if (formMode.value === "query") {
    options.unshift({ label: "全部", value: null });
  }
  return options;
});

// 表單狀態管理
const toggleForm = ref<boolean>(false);
const formMode = ref<FormMode>("create");
const formData = reactive<SupplierInterface>({
  id: 0,
  code: "",
  name: "",
  contactName: "",
  contactPhone: "",
  address: "",
  isActive: true,
  createAt: "",
  updateAt: "",
  // query
  createAtS: "",
  createAtE: "",
  updateAtS: "",
  updateAtE: "",
});
const defaultForm: SupplierInterface = {
  id: 0,
  code: "",
  name: "",
  contactName: "",
  contactPhone: "",
  address: "",
  isActive: true,
  createAt: "",
  updateAt: "",
  // query
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

const edit = (item: SupplierInterface) => {
  openForm("edit", item);
};

const openForm = (mode: FormMode, item: SupplierInterface = defaultForm) => {
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

const remove = async (item: SupplierInterface) => {
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
