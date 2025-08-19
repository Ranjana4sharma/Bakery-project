export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
  signature?: boolean;
  popularity?: number;
  quantity?: number;       // from earlier cart change
  visible?: boolean;       // ✅ added for ProductManager visibility toggle
  todaysSpecial?: boolean; // ✅ added for marking Today’s Specials
}
