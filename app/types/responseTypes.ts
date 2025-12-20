export interface SupplierInterface {
  id: number;
  code: string | null;
  name: string | null;
  contactName: string | null;
  contactPhone: string | null;
  address: string | null;
  isActive: boolean | null;
  createAt: string | null;
  updateAt: string | null;
  // query
  createAtS: string | null;
  createAtE: string | null;
  updateAtS: string | null;
  updateAtE: string | null;
}

export interface ReturnReasonInterface {
  id: number;
  reason: string | null;
}

export interface MemberInterface {
  id: number;
  code: string | null;
  name: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  joinDate: string | null;
  totQty: number | null;
  totAmt: number | null;
  totCnt: number | null;
  isActive: boolean | null;
  createAt: string | null;
  updateAt: string | null;
  // query
  joinDateS: string | null;
  joinDateE: string | null;
  createAtS: string | null;
  createAtE: string | null;
  updateAtS: string | null;
  updateAtE: string | null;
}

export interface StoreTypeInterface {
  id: number;
  name: string | null;
}

export interface StoreInterface {
  id: number;
  code: string | null;
  name: string | null;
  storeType: StoreTypeInterface;
  storeTypeId: number | number[] | null;
  isActive: boolean | null;
  createAt: string | null;
  updateAt: string | null;
  // query
  createAtS: string | null;
  createAtE: string | null;
  updateAtS: string | null;
  updateAtE: string | null;
}

export interface ColorInterface {
  id: number;
  code: string | null;
  name: string | null;
}

export interface SizeInterface {
  id: number;
  code: string | null;
  name: string | null;
}

export interface TagInterface {
  id: number;
  name: string | null;
}

export interface ProductInterface {
  id: number;
  code: string | null;
  name: string | null;
  tags: TagInterface[] | null;
  unitPrc: number | null;
  isActive: boolean | null;
  remark: string | null;
  createAt: string | null;
  updateAt: string | null;
  // query
  tagIds: number[] | null;
  createAtS: string | null;
  createAtE: string | null;
  updateAtS: string | null;
  updateAtE: string | null;
}

export interface ProductSkuInterface {
  id: number;
  skuCode: string | null;
  costPrc: number | null;
  isActive: boolean | null;
  // create
  productId: number;
  supplierId: number | null;
  colorId: number | null;
  sizeId: number | null;
}

export interface PurchaseReceiptInterface {
  id: number;
  confirmed: boolean | null;
  signed: boolean | null;
  code: string;
  date: string;
  supplierId: number;
  originalCode: string;
  totQty: number;
  totAmt: number;
  remark: string;
  createAt: string;
  updateAt: string;
  // query
  dateS: string;
  dateE: string;
  createAtS: string;
  createAtE: string;
  updateAtS: string;
  updateAtE: string;
}

export interface PurchaseReceiptDetailInterface {
  id: number;
  purchaseReceiptId: number;
  productSkuId: number;
  qty: number;
  costPrc: number;
  subTot: number;
}

export interface PurchaseOrderInterface {
  id: number;
  confirmed: boolean;
  signed: boolean;
  code: string;
  date: string;
  supplierId: number;
  totQty: number;
  totAmt: number;
  remark: string | null;
  createAt: string;
  updateAt: string;
  // query
  supplierIds: number[] | null;
  dateS: string;
  dateE: string;
  createAtS: string;
  createAtE: string;
  updateAtS: string;
  updateAtE: string;
}

export interface PurchaseOrderDetailInterface {
  id: number;
  purchaseOrderId: number;
  productSkuId: number;
  purchaseQty: number;
  receivedQty: number;
  undeliveredQty: number;
  costPrc: number;
  subTot: number;
}
