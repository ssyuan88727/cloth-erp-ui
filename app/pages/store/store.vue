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
            <base-radio-group
              v-model="formData.isActive"
              label="狀態"
              :options="activeOptions"
            />
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
  </base-page>
</template>

<script lang="ts" setup>
import type {
  FormMode,
  RadioOption,
  ResponseInterface,
} from "~/types/baseTypes";
import type { StoreInterface, StoreTypeInterface } from "~/types/responseTypes";

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
const { get: getStoreType } = useApiClient("/store-type");
const { success, error, confirm } = useAlert();
const listData = reactive<StoreInterface[]>([]);
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
const defaultForm: StoreInterface = {
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

const edit = (item: StoreTypeInterface) => {
  openForm("edit", item);
};

const openForm = (mode: FormMode, item: StoreTypeInterface = defaultForm) => {
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
      error("提交失敗");
    });
};

const remove = async (item: StoreTypeInterface) => {
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
  getStoreType<ResponseInterface>()
    .then(({ header, body }) => {
      storeTypes.splice(0, storeTypes.length, ...body);
    })
    .catch((err) => {
      console.error(err);
      error("獲取店點類別失敗");
    });
});
</script>
