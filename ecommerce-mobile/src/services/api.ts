import axios, { isAxiosError } from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";

import { getToken } from "@/storage/authStorage";

// In dev the Expo server runs on the laptop that also runs the backend, so reuse its current IP.
function resolveBaseUrl() {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  const devHost =
    Constants.expoConfig?.hostUri?.split(":")[0] ??
    (Platform.OS === "web" && typeof window !== "undefined" ? window.location.hostname : undefined);
  return devHost ? `http://${devHost}:8080/api` : undefined;
}

const baseURL = resolveBaseUrl();

if (!baseURL && typeof window !== "undefined") {
  console.warn("Backend URL unknown. Set EXPO_PUBLIC_API_URL (see .env.example).");
}

export const api = axios.create({ baseURL, timeout: 10000 });

let onSessionExpired: (() => void) | null = null;

export const setSessionExpiredHandler = (handler: (() => void) | null) => {
  onSessionExpired = handler;
};

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Spring Security answers 403 (not 401) for a missing/expired token.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const hadToken = Boolean(error.config?.headers?.Authorization);
    if ((status === 401 || status === 403) && hadToken) {
      onSessionExpired?.();
    }
    return Promise.reject(error);
  },
);

export function getErrorMessage(error: unknown, fallback = "Something went wrong. Please try again.") {
  if (isAxiosError(error)) {
    if (!error.response) {
      return "Can't reach the server. Check your internet and that the backend is running.";
    }
    const message = error.response.data?.message;
    if (typeof message === "string" && message) {
      return message;
    }
  }
  return fallback;
}
