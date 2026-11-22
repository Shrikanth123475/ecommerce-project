import { api } from "./api";

export type User = {
  id: number;
  name: string;
  email: string;
  address: string | null;
  phone: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  city: string | null;
  pincode: string | null;
};

export type ProfileInput = {
  name: string;
  address: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  city: string;
  pincode: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  address?: string;
};

export async function login(email: string, password: string) {
  const { data } = await api.post<{ token: string }>("/users/login", { email, password });
  return data.token;
}

export async function register(input: RegisterInput) {
  const { data } = await api.post<User>("/users/register", input);
  return data;
}

export async function getProfile() {
  const { data } = await api.get<User>("/users/profile");
  return data;
}

// Email is the login identity and can't be changed.
export async function updateProfile(input: ProfileInput) {
  const { data } = await api.put<User>("/users/profile", input);
  return data;
}
