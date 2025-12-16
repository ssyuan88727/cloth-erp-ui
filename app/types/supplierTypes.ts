export interface SupplierResponse {
  id: number;
  code: string;
  name: string;
  contactName: string;
  contactPhone: string;
  address: string;
  isActive: boolean;
  createAt: string;
  updateAt: string;
}
export type SupplierForm = Omit<SupplierResponse, "createAt" | "updateAt">;
