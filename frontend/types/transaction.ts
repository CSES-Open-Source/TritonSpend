export type Category =
  | "Food"
  | "Shopping"
  | "Transportation"
  | "Subscriptions"
  | "Other";

export type PaymentSource = "DINING_DOLLARS" | "TRITON_CASH" | "CARD";

export default interface Transaction {
  id: number;
  item_name: string;
  amount: string;
  category_name: Category;
  payment_source?: PaymentSource;
  date: string;
}
