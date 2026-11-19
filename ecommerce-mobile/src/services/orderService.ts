import { api } from "./api";

export type OrderItem = {
  productId: number;
  productName: string;
  description: string | null;
  price: number;
  quantity: number;
  imageUrl: string | null;
};

export type Order = {
  orderId: number;
  email: string;
  totalAmount: number;
  status: string;
  items: OrderItem[];
  orderDate: string | null;
};

export async function placeOrder() {
  const { data } = await api.post<Order>("/orders/place");
  return data;
}

export async function getOrders() {
  const { data } = await api.get<Order[]>("/orders");
  return data;
}

export async function getOrder(orderId: number | string) {
  const { data } = await api.get<Order>(`/orders/${orderId}`);
  return data;
}

export async function cancelOrder(orderId: number) {
  const { data } = await api.put<Order>(`/orders/${orderId}/cancel`);
  return data;
}
