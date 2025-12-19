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
