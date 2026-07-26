import axios from "axios";
import type { Product, User } from "../types";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true,
});

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const DEFAULT_TTL = 60_000;

const getCached = <T>(key: string): T | null => {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
};

const setCache = <T>(key: string, data: T, ttl = DEFAULT_TTL) => {
  cache.set(key, { data, expiresAt: Date.now() + ttl });
};

export const invalidateCache = (prefix?: string) => {
  if (!prefix) {
    cache.clear();
    return;
  }
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) cache.delete(key);
  }
};

export const authApi = {
  login: (email: string, password: string) =>
    api.post<User>("/api/users/login", { email, password }),

  register: (name: string, email: string, password: string) =>
    api.post<User>("/api/users/register", { name, email, password }),

  logout: () => {
    invalidateCache();
    return api.get("/api/users/logout");
  },

  loggedIn: () => api.get<boolean>("/api/users/loggedin"),

  forgotPassword: (email: string) =>
    api.post("/api/users/forgotpassword", { email }),

  resetPassword: (resetToken: string, password: string) =>
    api.put(`/api/users/resetpassword/${resetToken}`, { password }),
};

export const userApi = {
  getUser: async (): Promise<User> => {
    const key = "user:profile";
    const cached = getCached<User>(key);
    if (cached) return cached;
    const res = await api.get<User>("/api/users/getUser");
    setCache(key, res.data, 120_000);
    return res.data;
  },

  updateUser: (data: FormData | { name?: string; phone?: string; bio?: string }) => {
    invalidateCache("user:");
    return api.patch<User>("/api/users/updateuser", data);
  },

  changePassword: (oldPassword: string, password: string) =>
    api.patch("/api/users/changepassword", { oldPassword, password }),
};

export const productApi = {
  getAll: async (): Promise<Product[]> => {
    const key = "products:all";
    const cached = getCached<Product[]>(key);
    if (cached) return cached;
    const res = await api.get<Product[]>("/api/products");
    setCache(key, res.data, 60_000);
    return res.data;
  },

  create: (formData: FormData) => {
    invalidateCache("products:");
    return api.post<Product>("/api/products", formData);
  },

  update: (id: string, formData: FormData) => {
    invalidateCache("products:");
    return api.patch<Product>(`/api/products/${id}`, formData);
  },

  delete: (id: string) => {
    invalidateCache("products:");
    return api.delete(`/api/products/${id}`);
  },
};

export default api;
