export interface SupplierInterface {
  id: number;
  code: string;
  name: string;
  contactName: string;
  contactPhone: string;
  address: string;
  isActive: boolean;
  createAt: string;
  updateAt: string;
  // query
  createAtS: string;
  createAtE: string;
  updateAtS: string;
  updateAtE: string;
}

export interface ReturnReasonInterface {
  id: number;
  reason: string;
}

export interface MemberInterface {
  id: number;
  code: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  joinDate: string;
  totQty: number;
  totAmt: number;
  totCnt: number;
  isActive: boolean;
  createAt: string;
  updateAt: string;
  // query
  joinDateS: string;
  joinDateE: string;
  createAtS: string;
  createAtE: string;
  updateAtS: string;
  updateAtE: string;
}
