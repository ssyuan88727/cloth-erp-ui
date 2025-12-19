export type FormMode = "create" | "edit" | "query";

export interface ResponseHeaderInterface {
  status: boolean;
  title: string;
  message: string;
}
export interface ResponseInterface {
  header: ResponseHeaderInterface;
  body: any;
}

export interface RadioOption {
  label: string;
  value: string | number | boolean | null;
}
