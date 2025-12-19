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
              :rules="[required, maxLength(20)]"
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
              v-model="formData.tagIds"
              label="標籤"
              :items="tags"
              multiple
              item-title="name"
              item-value="id"
            />
          </v-col>
          <v-col>
            <base-text-field
              v-model="formData.unitPrc"
              label="單價"
              type="number"
              :rules="[required]"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <base-radio-group
              v-model="formData.isActive"
              label="狀態"
              :options="activeOptions"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <base-textarea
              v-model="formData.remark"
              label="備註"
              :rules="[maxLength(255)]"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col></v-col>
          <v-col></v-col>
        </v-row>
        // todo
        null; remark: string | null; createAt: string | null; updateAt: string |
        null; // query  | null; createAtS: string | null;
        createAtE: string | null; updateAtS: string | null; updateAtE: string |
        null;
      </v-container>
    </base-data-form>
    <base-data-table
      :headers="headers"
      :items="listData"
      deletable
      editable
      show-detail
      @edit="edit"
      @remove="remove"
      @detail="detail"
    >
      <template #item.tags="{ item: { tags } }">
        <v-chip
          v-for="tag in tags"
          :key="tag.id"
          color="primary"
          class="me-1"
          size="small"
          label
        >
          {{ tag.name }}
        </v-chip>
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
import type { ProductInterface, TagInterface } from "~/types/responseTypes";

const headers = [
  { title: "代號", key: "code" },
  { title: "名稱", key: "name" },
  { title: "標籤", key: "tags" },
  { title: "單價", key: "unitPrc" },
  { title: "是否啟用", key: "isActive" },
  { title: "備註", key: "remark" },
  { title: "建立時間", key: "createAt" },
  { title: "更新時間", key: "updateAt" },
];
const { required, maxLength } = useValidateRules();
const { submit, get, del } = useApiClient("/product");
const { get: getProductSku } = useApiClient("/productSku");
const { get: getTag } = useApiClient("/tag");
const { confirm, success } = useAlert();
const listData = reactive<ProductInterface[]>([]);
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
const tags = reactive<TagInterface[]>([]);

// 表單狀態管理
const toggleVal = ref<boolean>(false);
const formMode = ref<FormMode>("create");
const formData = reactive<ProductInterface>({
  id: 0,
  code: "",
  name: "",
  tags: [],
  unitPrc: null,
  isActive: null,
  remark: "",
  createAt: "",
  updateAt: "",
  // query
  tagIds: [],
  createAtS: "",
  createAtE: "",
  updateAtS: "",
  updateAtE: "",
});
const defaultForm: ProductInterface = {
  id: 0,
  code: "",
  name: "",
  tags: [],
  unitPrc: null,
  isActive: null,
  remark: "",
  createAt: "",
  updateAt: "",
  // query
  tagIds: [],
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
    });
};

const edit = (item: ProductInterface) => {
  openForm("edit", item);
};

const openForm = (mode: FormMode, item: ProductInterface = defaultForm) => {
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

const remove = async (item: ProductInterface) => {
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

const detail = (item: ProductInterface) => {
  console.log(item);
  // TODO
  // getProductSku<ResponseInterface>(item)
  //   .then(({ header, body }) => {
  //     console.log(body);
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //   });
};

onMounted(() => {
  fetchData();
  getTag<ResponseInterface>()
    .then(({ header, body }) => {
      tags.splice(0, tags.length, ...body);
    })
    .catch((err) => {
      console.error(err);
    });
});
</script>
