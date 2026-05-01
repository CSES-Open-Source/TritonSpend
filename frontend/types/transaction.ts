export type Category =
  | "Food"
  | "Shopping"
  | "Transportation"
  | "Subscriptions"
  | "Other";

export default interface Transaction {
  id: number;
  item_name: string;
  amount: string;
  category_name: Category;
  date: string;
}
