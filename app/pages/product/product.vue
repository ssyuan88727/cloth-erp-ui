<template>
  <base-page title="商品管理">
    <template #actions>
      <base-btn text="新增" prepend-icon="mdi-plus" color="primary" @click="openForm('create')" />
      <base-btn text="查詢" prepend-icon="mdi-magnify" color="grey" @click="openForm('query')" />
    </template>
    <base-data-form v-model="toggleForm" :mode="formMode" :formData="formData" @submit="formSubmit" @cancel="closeForm">
      <v-row>
        <v-col>
          <base-text-field v-model="formData.code" label="代號" :disabled="formMode === 'edit'"
            :rules="[required, maxLength(20)]" />
        </v-col>
        <v-col>
          <base-text-field v-model="formData.name" label="名稱" :rules="[required, maxLength(20)]" />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <base-autocomplete v-model="formData.tagIds" label="標籤" :items="tags" multiple item-title="name"
            item-value="id" />
        </v-col>
        <v-col>
          <base-text-field v-model="formData.unitPrc" label="單價" type="number" :rules="[required]" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <base-radio-group v-model="formData.isActive" label="狀態" :options="activeOptions" />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <base-textarea v-model="formData.remark" label="備註" :rules="[maxLength(255)]" />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <base-date-picker v-if="formMode !== 'query'" v-model="formData.createAt" type="datetime-local" disabled
            label="建立時間" />
          <v-row v-else>
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
    <base-data-table :headers="headers" :items="listData" deletable editable show-detail @edit="edit" @remove="remove"
      @detail="fetchDetailData">
      <template #item.tags="{ item: { tags } }">
        <v-chip v-for="tag in tags" :key="tag.id" color="primary" class="me-1" size="small" label>
          {{ tag.name }}
        </v-chip>
      </template>
      <template #item.isActive="{ value }">
        <v-chip :color="value ? 'success' : 'error'" size="small" label>
          {{ value ? "啟用" : "停用" }}
        </v-chip>
      </template>
    </base-data-table>
    <!-- detail -->
    <base-detail-dialog v-model="toggleDetail" title="商品 SKU 列表" :header="detailHeader" :items="detailList" deletable
      editable @edit="editDetail" @remove="removeDetail">
      <template #actions>
        <base-btn text="新增" prepend-icon="mdi-plus" color="primary" @click="openDetailForm('create')" />
      </template>
      <template #item.isActive="{ value }">
        <v-chip :color="value ? 'success' : 'error'" size="small" label>
          {{ value ? "啟用" : "停用" }}
        </v-chip>
      </template>
    </base-detail-dialog>
    <base-data-form v-model="toggleDetailForm" :mode="detailFormMode" :formData="detailFormData"
      @submit="detailFormSubmit" @cancel="closeDetailForm">
      <v-row>
        <v-col>
          <base-autocomplete v-model="detailFormData.supplierId" label="供應商" :items="suppliers" item-title="name"
            item-value="id" :rule="[required]" :disabled="detailFormMode === 'edit'" />
        </v-col>
        <v-col>
          <base-autocomplete v-model="detailFormData.colorId" label="顏色" :items="colors" item-title="name"
            item-value="id" :rule="[required]" :disabled="detailFormMode === 'edit'" />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <base-autocomplete v-model="detailFormData.sizeId" label="尺寸" :items="sizes" item-title="name" item-value="id"
            :rules="[required]" :disabled="detailFormMode === 'edit'" />
        </v-col>
        <v-col>
          <base-text-field v-model="detailFormData.skuCode" label="SKU" disabled />
        </v-col>

      </v-row>
      <v-row>
        <v-col>
          <base-text-field v-model="detailFormData.costPrc" label="成本價" type="number" :rule="[required]" />
        </v-col>
        <v-col>
          <base-radio-group v-model="detailFormData.isActive" label="狀態" :options="activeOptions" />
        </v-col>
      </v-row>
    </base-data-form>
  </base-page>
</template>

<script lang="ts" setup>
import type {
  FormMode,
  RadioOption,
  ResponseInterface,
} from "~/types/baseTypes";
import type { ColorInterface, ProductInterface, ProductSkuInterface, SizeInterface, SupplierInterface, TagInterface } from "~/types/responseTypes";

const headers = [
  { title: "代號", key: "code" },
  { title: "名稱", key: "name" },
  { title: "標籤", key: "tags", align: "start" },
  { title: "單價", key: "unitPrc" },
  { title: "是否啟用", key: "isActive" },
  { title: "備註", key: "remark" },
  { title: "建立時間", key: "createAt" },
  { title: "更新時間", key: "updateAt" },
];
const detailHeader = [
  { title: "SKU", key: "skuCode" },
  { title: "成本價", key: "costPrc" },
  { title: "是否啟用", key: "isActive" },
]
const { required, maxLength } = useValidateRules();
const { submit, get, del } = useApiClient("/product");
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
const toggleForm = ref<boolean>(false);
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
  toggleForm.value = true;
};

const closeForm = () => {
  toggleForm.value = false;
  Object.assign(formData, { ...defaultForm });
};

const formSubmit = async () => {
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

const { get: getProductSku, submit: submitProductSku, del: delProductSku } = useApiClient("/product-sku");
const { get: getSupplier } = useApiClient("/supplier");
const { get: getColor } = useApiClient("/color");
const { get: getSize } = useApiClient("/size");
const toggleDetail = ref<boolean>(false);
const toggleDetailForm = ref<boolean>(false);
const detailFormMode = ref<FormMode>("create");
const detailList = reactive<ProductSkuInterface[]>([])
const suppliers = reactive<SupplierInterface[]>([]);
const colors = reactive<ColorInterface[]>([]);
const sizes = reactive<SizeInterface[]>([]);

const detailFormData = reactive<ProductSkuInterface>({
  id: 0,
  skuCode: null,
  costPrc: null,
  isActive: null,
  // create
  productId: 0,
  supplierId: null,
  colorId: null,
  sizeId: null,
});
const defaultDetailForm: ProductSkuInterface = {
  id: 0,
  skuCode: null,
  costPrc: null,
  isActive: null,
  // create
  productId: 0,
  supplierId: null,
  colorId: null,
  sizeId: null,
};
const fetchDetailData = (productId: number) => {
  getProductSku<ResponseInterface>({ productId })
    .then(async ({ header, body }) => {
      detailList.splice(0, detailList.length, ...body);
      const { body: supplierBody } = await getSupplier<ResponseInterface>();
      suppliers.splice(0, suppliers.length, ...supplierBody);
      const { body: colorBody } = await getColor<ResponseInterface>();
      colors.splice(0, colors.length, ...colorBody);
      const { body: sizeBody } = await getSize<ResponseInterface>();
      sizes.splice(0, sizes.length, ...sizeBody);

      toggleDetail.value = true;
    })
    .catch((err) => {
      console.error(err);
    });
};

const openDetailForm = (mode: FormMode, item: ProductSkuInterface = defaultDetailForm) => {
  detailFormMode.value = mode;
  Object.assign(detailFormData, { ...item });
  toggleDetailForm.value = true;
};

const closeDetailForm = () => {
  toggleDetailForm.value = false;
  Object.assign(detailFormData, { ...defaultDetailForm });
};

const editDetail = (item: ProductSkuInterface) => {
  openDetailForm("edit", item);
};

const detailFormSubmit = async () => {
  Object.assign(detailFormData, { ...detailFormData, productId: detailList[0]?.productId || 0 })
  submitProductSku(detailFormMode.value, detailFormData)
    .then(({ header, body }) => {
      success("提交成功");
      fetchDetailData(detailFormData.productId)
      closeDetailForm();
    })
    .catch((err) => {
      console.error(err);
    });
};

const removeDetail = async (item: ProductSkuInterface) => {
  confirm({ title: `確定刪除 ${item.skuCode} 嗎?` }).then((res) => {
    if (res.isConfirmed) {
      delProductSku(item.id)
        .then(() => {
          success("刪除成功");
          fetchDetailData(item.productId);
        })
        .catch((error) => {
          console.error("刪除失敗", error);
        });
    }
  });
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
