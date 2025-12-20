<template>
  <base-page title="採購單管理">
    <template #actions>
      <base-btn text="新增" prepend-icon="mdi-plus" color="primary" @click="openForm('create')" />
      <base-btn text="查詢" prepend-icon="mdi-magnify" color="grey" @click="openForm('query')" />
    </template>
    <base-data-form v-model="toggleForm" :mode="formMode" :formData="formData" @submit="formSubmit" @cancel="closeForm">
      <v-row>
        <v-col>
          <base-text-field v-model="formData.code" label="採購收貨單號" :disabled="formMode === 'edit'"
            :rules="[required, maxLength(20)]" />
        </v-col>
        <v-col>
          <base-date-picker v-model="formData.date" label="收貨日期" type="date" :rules="[required]" />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <base-autocomplete v-model="formData.supplierId" label="供應商" :items="suppliers" item-title="name"
            item-value="id" :rules="[required]" />
        </v-col>
        <v-col>
          <base-text-field v-model="formData.originalCode" label="原始採購單號" :rules="[maxLength(20)]" />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <base-textarea v-model="formData.remark" label="備註" :rules="[maxLength(255)]" />
        </v-col>
      </v-row>
    </base-data-form>
    <base-data-table :headers="headers" :items="listData" deletable editable show-detail @edit="edit" @remove="remove"
      @detail="fetchDetailData">
      <template #item.Confirmed="{ value }">
        <v-chip :color="value ? 'success' : 'error'" size="small" label>
          {{ value ? "是" : "否" }}
        </v-chip>
      </template>
      <template #item.Signed="{ value }">
        <v-chip :color="value ? 'success' : 'error'" size="small" label>
          {{ value ? "是" : "否" }}
        </v-chip>
      </template>
    </base-data-table>
    <!-- detail -->
    <base-detail-dialog v-model="toggleDetail" title="採購單明細" :header="detailHeader" :items="detailList" deletable
      editable @edit="editDetail" @remove="removeDetail">
      <template #actions>
        <base-btn text="新增" prepend-icon="mdi-plus" color="primary" @click="openDetailForm('create')" />
      </template>
    </base-detail-dialog>
    <base-data-form v-model="toggleDetailForm" :mode="detailFormMode" :formData="detailFormData"
      @submit="detailFormSubmit" @cancel="closeDetailForm">
      <v-row>
        <v-col>
          <base-autocomplete v-model="detailFormData.productSkuId" label="商品SKU" :items="productSkus"
            item-title="skuCode" item-value="id" :rules="[required]" :disabled="detailFormMode === 'edit'" />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <base-text-field v-model="detailFormData.qty" label="數量" type="number" :rules="[required]" />
        </v-col>
        <v-col>
          <base-text-field v-model="detailFormData.costPrc" label="單位成本" type="number" :rules="[required]" />
        </v-col>
      </v-row>
    </base-data-form>
  </base-page>
</template>

<script lang="ts" setup>
import type {
  FormMode,
  ResponseInterface,
} from "~/types/baseTypes";
import type { PurchaseReceiptInterface, PurchaseReceiptDetailInterface, SupplierInterface, ProductSkuInterface } from "~/types/responseTypes";

const headers = [
  { title: "採購收貨單號", key: "code" },
  { title: "收貨日期", key: "date" },
  { title: "供應商", key: "supplier.Name" },
  { title: "原始採購單號", key: "originalCode" },
  { title: "總數量", key: "totQty" },
  { title: "總金額", key: "totAmt" },
  { title: "已確認", key: "confirmed" },
  { title: "已簽核", key: "signed" },
  { title: "備註", key: "remark" },
  { title: "建立時間", key: "createAt" },
  { title: "更新時間", key: "updateAt" },
];
const detailHeader = [
  { title: "商品SKU", key: "productSku.skuCode" },
  { title: "數量", key: "qty" },
  { title: "單位成本", key: "costPrc" },
  { title: "小計", key: "subTot" },
]
const { required, maxLength } = useValidateRules();
const { submit, get, del } = useApiClient("/purchase-receipt");
const { get: getSupplier } = useApiClient("/supplier");
const { confirm, success } = useAlert();
const listData = reactive<PurchaseReceiptInterface[]>([]);
const suppliers = reactive<SupplierInterface[]>([]);

const toggleForm = ref<boolean>(false);
const formMode = ref<FormMode>("create");
const formData = reactive<PurchaseReceiptInterface>({
  id: 0,
  confirmed: null,
  signed: null,
  code: "",
  date: "",
  supplierId: 0,
  originalCode: "",
  totQty: 0,
  totAmt: 0,
  remark: "",
  createAt: "",
  updateAt: "",
  // query
  dateS: "",
  dateE: "",
  createAtS: "",
  createAtE: "",
  updateAtS: "",
  updateAtE: "",
});
const defaultForm: PurchaseReceiptInterface = {
  id: 0,
  confirmed: null,
  signed: null,
  code: "",
  date: "",
  supplierId: 0,
  originalCode: "",
  totQty: 0,
  totAmt: 0,
  remark: "",
  createAt: "",
  updateAt: "",
  // query
  dateS: "",
  dateE: "",
  createAtS: "",
  createAtE: "",
  updateAtS: "",
  updateAtE: "",
};

const fetchData = () => {
  get<ResponseInterface>()
    .then(({ body }) => {
      listData.splice(0, listData.length, ...body);
    })
    .catch((err) => {
      console.error(err);
    });
};

const edit = (item: PurchaseReceiptInterface) => {
  openForm("edit", item);
};

const openForm = (mode: FormMode, item: PurchaseReceiptInterface = defaultForm) => {
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
    .then(() => {
      success("提交成功");
      fetchData();
      closeForm();
    })
    .catch((err) => {
      console.error(err);
    });
};

const remove = async (item: PurchaseReceiptInterface) => {
  confirm({ title: `確定刪除 ${item.code} 嗎?` }).then((res) => {
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

const { get: getPurchaseReceiptDetail, submit: submitPurchaseReceiptDetail, del: delPurchaseReceiptDetail } = useApiClient("/purchase-receipt-detail");
const { get: getProductSku } = useApiClient("/product-sku");
const toggleDetail = ref<boolean>(false);
const toggleDetailForm = ref<boolean>(false);
const detailFormMode = ref<FormMode>("create");
const detailList = reactive<PurchaseReceiptDetailInterface[]>([])
const productSkus = reactive<ProductSkuInterface[]>([]);
const currentPurchaseReceiptId = ref<number>(0);

const detailFormData = reactive<PurchaseReceiptDetailInterface>({
  id: 0,
  purchaseReceiptId: 0,
  productSkuId: 0,
  qty: 0,
  costPrc: 0,
  subTot: 0,
});
const defaultDetailForm: PurchaseReceiptDetailInterface = {
  id: 0,
  purchaseReceiptId: 0,
  productSkuId: 0,
  qty: 0,
  costPrc: 0,
  subTot: 0,
};

const fetchDetailData = (purchaseReceiptId: number) => {
  currentPurchaseReceiptId.value = purchaseReceiptId;
  getPurchaseReceiptDetail<ResponseInterface>({ purchaseReceiptId })
    .then(async ({ body }) => {
      detailList.splice(0, detailList.length, ...body);
      const { body: productSkuBody } = await getProductSku<ResponseInterface>();
      productSkus.splice(0, productSkus.length, ...productSkuBody);
      toggleDetail.value = true;
    })
    .catch((err) => {
      console.error(err);
    });
};

const openDetailForm = (mode: FormMode, item: PurchaseReceiptDetailInterface = defaultDetailForm) => {
  detailFormMode.value = mode;
  Object.assign(detailFormData, { ...item });
  toggleDetailForm.value = true;
};

const closeDetailForm = () => {
  toggleDetailForm.value = false;
  Object.assign(detailFormData, { ...defaultDetailForm });
};

const editDetail = (item: PurchaseReceiptDetailInterface) => {
  openDetailForm("edit", item);
};

const detailFormSubmit = async () => {
  detailFormData.purchaseReceiptId = currentPurchaseReceiptId.value;
  submitPurchaseReceiptDetail(detailFormMode.value, detailFormData)
    .then(() => {
      success("提交成功");
      fetchDetailData(currentPurchaseReceiptId.value)
      closeDetailForm();
    })
    .catch((err) => {
      console.error(err);
    });
};

const removeDetail = async (item: PurchaseReceiptDetailInterface) => {
  confirm({ title: `確定刪除嗎?` }).then((res) => {
    if (res.isConfirmed) {
      delPurchaseReceiptDetail(item.id)
        .then(() => {
          success("刪除成功");
          fetchDetailData(item.purchaseReceiptId);
        })
        .catch((error) => {
          console.error("刪除失敗", error);
        });
    }
  });
};

onMounted(() => {
  fetchData();
  getSupplier<ResponseInterface>()
    .then(({ body }) => {
      suppliers.splice(0, suppliers.length, ...body);
    })
    .catch((err) => {
      console.error(err);
    });
});
</script>
