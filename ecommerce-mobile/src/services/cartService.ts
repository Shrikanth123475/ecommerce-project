import { api } from "./api";

export type CartItem = {
  cartItemId: number;
  productId: number;
  productName: string;
  description: string | null;
  price: number;
  quantity: number;
  imageUrl: string | null;
  stock: number;
  size: string | null;
};

export type Cart = {
  cartId: number;
  email: string;
  items: CartItem[];
};

export async function getCart() {
  const { data } = await api.get<Cart>("/cart");
  return data;
}

export async function addToCart(productId: number, quantity = 1, size?: string | null) {
  await api.post("/cart/add", { productId, quantity, size: size ?? null });
}

export async function incrementItem(cartItemId: number) {
  await api.put(`/cart-items/${cartItemId}/increment`);
}

export async function decrementItem(cartItemId: number) {
  await api.put(`/cart-items/${cartItemId}/decrement`);
}

export async function removeItem(cartItemId: number) {
  await api.delete(`/cart-items/${cartItemId}`);
}

export const cartTotal = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export const cartCount = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.quantity, 0);
