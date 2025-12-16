export type FormMode = "create" | "edit" | "query";

interface ResponseHeader {
  status: boolean;
  title: string;
  message: string;
}

export interface ResponseInterface {
  header: ResponseHeader;
  body: any;
}
