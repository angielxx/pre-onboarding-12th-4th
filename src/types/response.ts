export interface DataItem {
  id: string;
  value_area: number;
  value_bar: number;
}

export interface ResponseType {
  [key: string]: DataItem;
}
