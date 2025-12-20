<template>
  <base-page title="採購訂單管理">
    <template #actions>
      <base-btn text="新增" prepend-icon="mdi-plus" color="primary" @click="openForm('create')" />
      <base-btn text="查詢" prepend-icon="mdi-magnify" color="grey" @click="openForm('query')" />
    </template>
    <base-data-form v-model="toggleForm" :mode="formMode" :formData="formData" @submit="formSubmit" @cancel="closeForm">
      <v-row>
        <v-col>
          <base-text-field v-model="formData.code" label="採購單號" :disabled="formMode === 'edit'"
            :rules="[required, maxLength(20)]" />
        </v-col>
        <v-col>
          <base-date-picker v-model="formData.date" label="訂單日期" type="date" :rules="[required]" />
        </v-col>
      </v-row>
      <v-row>
        <v-col v-if="formMode !== 'query'">
          <base-autocomplete v-model="formData.supplierId" label="供應商" :items="suppliers" item-title="name"
            item-value="id" :rules="[required]" />
        </v-col>
        <v-col v-else></v-col>
        <v-col></v-col>
      </v-row>
      <v-row>
        <v-col>
          <base-textarea v-model="formData.remark" label="備註" :rules="[maxLength(255)]" />
        </v-col>
      </v-row>
    </base-data-form>
    <base-data-table :headers="headers" :items="listData" deletable editable show-detail @edit="edit" @remove="remove"
      @detail="fetchDetailData">
      <template #item.confirmed="{ item }">
        <div class="d-flex align-center justify-center">
          <base-checkbox v-model="item.confirmed" @update:model-value="confirmChange(item)" />
        </div>
      </template>
      <template #item.signed="{ item }">
        <div class="d-flex align-center justify-center">
          <base-checkbox v-model="item.signed" @update:model-value="signChange(item)" />
        </div>
      </template>
    </base-data-table>
    <!-- detail -->
    <base-detail-dialog v-model="toggleDetail" title="採購訂單明細" :header="detailHeader" :items="detailList" deletable
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
          <base-text-field v-model="detailFormData.purchaseQty" label="採購數量" type="number" :rules="[required]" />
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
import type { PurchaseOrderInterface, PurchaseOrderDetailInterface, SupplierInterface, ProductSkuInterface } from "~/types/responseTypes";

const headers = [
  { title: "已確認", key: "confirmed" },
  { title: "已簽核", key: "signed" },
  { title: "採購單號", key: "code" },
  { title: "訂單日期", key: "date" },
  { title: "供應商", key: "supplier.name" },
  { title: "訂單總數量", key: "totQty" },
  { title: "訂單總金額", key: "totAmt" },
  { title: "備註", key: "remark" },
  { title: "建立時間", key: "createAt" },
  { title: "更新時間", key: "updateAt" },
];
const { required, maxLength } = useValidateRules();
const { submit, get, del } = useApiClient("/purchase-order");
const { get: getSupplier } = useApiClient("/supplier");
const { confirm, success } = useAlert();
const listData = reactive<PurchaseOrderInterface[]>([]);
const suppliers = reactive<SupplierInterface[]>([]);

const toggleForm = ref<boolean>(false);
const formMode = ref<FormMode>("create");
const formData = reactive<PurchaseOrderInterface>({
  id: 0,
  confirmed: false,
  signed: false,
  code: "",
  date: "",
  supplierId: 0,
  totQty: 0,
  totAmt: 0,
  remark: "",
  createAt: "",
  updateAt: "",
  // query
  supplierIds: [],
  dateS: "",
  dateE: "",
  createAtS: "",
  createAtE: "",
  updateAtS: "",
  updateAtE: "",
});
const defaultForm: PurchaseOrderInterface = {
  id: 0,
  confirmed: false,
  signed: false,
  code: "",
  date: "",
  supplierId: 0,
  totQty: 0,
  totAmt: 0,
  remark: "",
  createAt: "",
  updateAt: "",
  // query
  supplierIds: [],
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

const edit = (item: PurchaseOrderInterface) => {
  openForm("edit", item);
};

const openForm = (mode: FormMode, item: PurchaseOrderInterface = defaultForm) => {
  formMode.value = mode;
  Object.assign(formData, { ...item });
  toggleForm.value = true;
};

const closeForm = () => {
  toggleForm.value = false;
  Object.assign(formData, { ...defaultForm });
};

const formSubmit = async () => {
  let data: Partial<PurchaseOrderInterface> = { ...formData };
  if (formMode.value === 'query') {
    delete data.supplierId;
  }
  submit(formMode.value, data)
    .then((res) => {
      success("提交成功");
      if (formMode.value === "query") {
        const { body } = res as ResponseInterface;
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

const remove = async (item: PurchaseOrderInterface) => {
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
const confirmChange = (item: PurchaseOrderInterface) => {
  if (item.signed) {
    item.confirmed = !item.confirmed;
    confirm({ title: "單據已簽核", showCancelButton: false })
  } else {
    item.confirmed = !item.confirmed;
    submit("edit", item)
      .then(() => {
        success(`${item.confirmed ? "已" : "未"}確認成功`);
        fetchData();
      })
      .catch((err) => {
        item.confirmed = !item.confirmed;
        console.error(err);
      });
  }

};
const signChange = (item: PurchaseOrderInterface) => {
  if (!item.confirmed) {
    item.signed = false;
    confirm({ title: "請先確認單據", showCancelButton: false })
  } else {
    item.signed = !item.signed;
    submit("edit", item)
      .then(() => {
        success(`${item.signed ? "已" : "未"}簽核成功`);
        fetchData();
      })
      .catch((err) => {
        item.signed = !item.signed;
        console.error(err);
      });
  }
};

const detailHeader = [
  { title: "商品SKU", key: "productSku.skuCode" },
  { title: "採購數量", key: "purchaseQty" },
  { title: "已收貨數量", key: "receivedQty" },
  { title: "尚欠數量", key: "undeliveredQty" },
  { title: "單位成本", key: "costPrc" },
  { title: "小計", key: "subTot" },
]
const { get: getPurchaseOrderDetail, submit: submitPurchaseOrderDetail, del: delPurchaseOrderDetail } = useApiClient("/purchase-order-detail");
const { get: getProductSku } = useApiClient("/product-sku");
const toggleDetail = ref<boolean>(false);
const toggleDetailForm = ref<boolean>(false);
const detailFormMode = ref<FormMode>("create");
const detailList = reactive<PurchaseOrderDetailInterface[]>([])
const productSkus = reactive<ProductSkuInterface[]>([]);
const currentPurchaseOrderId = ref<number>(0);

const detailFormData = reactive<PurchaseOrderDetailInterface>({
  id: 0,
  purchaseOrderId: 0,
  productSkuId: 0,
  purchaseQty: 1,
  receivedQty: 0,
  undeliveredQty: 0,
  costPrc: 0,
  subTot: 0,
});
const defaultDetailForm: PurchaseOrderDetailInterface = {
  id: 0,
  purchaseOrderId: 0,
  productSkuId: 0,
  purchaseQty: 1,
  receivedQty: 0,
  undeliveredQty: 0,
  costPrc: 0,
  subTot: 0,
};

const fetchDetailData = (purchaseOrderId: number) => {
  currentPurchaseOrderId.value = purchaseOrderId;
  getPurchaseOrderDetail<ResponseInterface>({ purchaseOrderId })
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

const openDetailForm = (mode: FormMode, item: PurchaseOrderDetailInterface = defaultDetailForm) => {
  detailFormMode.value = mode;
  Object.assign(detailFormData, { ...item });
  toggleDetailForm.value = true;
};

const closeDetailForm = () => {
  toggleDetailForm.value = false;
  Object.assign(detailFormData, { ...defaultDetailForm });
};

const editDetail = (item: PurchaseOrderDetailInterface) => {
  openDetailForm("edit", item);
};

const detailFormSubmit = async () => {
  detailFormData.purchaseOrderId = currentPurchaseOrderId.value;
  submitPurchaseOrderDetail(detailFormMode.value, detailFormData)
    .then(() => {
      success("提交成功");
      fetchDetailData(currentPurchaseOrderId.value)
      closeDetailForm();
    })
    .catch((err) => {
      console.error(err);
    });
};

const removeDetail = async (item: PurchaseOrderDetailInterface) => {
  confirm({ title: `確定刪除嗎?` }).then((res) => {
    if (res.isConfirmed) {
      delPurchaseOrderDetail(item.id)
        .then(() => {
          success("刪除成功");
          fetchDetailData(item.purchaseOrderId);
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
