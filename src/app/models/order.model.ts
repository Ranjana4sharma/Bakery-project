export interface Order {
  id: number;                 // Unique order ID
  username: string;           // Order kis user ne kiya
  items: OrderItem[];         // Order me shamil items ka array
  totalAmount: number;        // Total price of order
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';  // Order ka current status
   orderDate: string;          // Order kab place hua - ISO date string
  // Aap additional fields yahan add kar sakte hain jaise shippingAddress, paymentMethod etc.
}

export interface OrderItem {
  productId: number;          // Product ki unique ID
  name: string;               // Product ka naam
  quantity: number;           // Kitni quantity order ki gayi
  price: number;              // Per item price
}
