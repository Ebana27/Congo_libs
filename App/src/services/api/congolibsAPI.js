import { Platform } from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = (
  process.env.EXPO_PUBLIC_API_URL ||
  "https://ledevfreelance.pythonanywhere.com/api/v1"
).replace(/\/$/, "");

console.log("[API] URL utilisée :", API_URL);

const TOKEN_KEY = "congolibs_auth_token";
let authToken = "";

const storage = {
  setItem: async (key, value) => {
    if (Platform.OS === "web") {
      await AsyncStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
  getItem: async (key) => {
    if (Platform.OS === "web") return AsyncStorage.getItem(key);
    return SecureStore.getItemAsync(key);
  },
  removeItem: async (key) => {
    if (Platform.OS === "web") {
      await AsyncStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};

export const clearSession = async () => {
  authToken = "";
  try {
    await storage.removeItem(TOKEN_KEY);
  } catch (e) {}
};

export const loadToken = async () => {
  if (authToken) return authToken;
  try {
    authToken = (await storage.getItem(TOKEN_KEY)) || "";
  } catch (e) {
    authToken = "";
  }
  return authToken;
};

const saveToken = async (token) => {
  try {
    if (token) {
      authToken = token;
      await storage.setItem(TOKEN_KEY, token);
    } else {
      await clearSession();
    }
  } catch (e) {}
};

const client = axios.create({
  baseURL: API_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

client.interceptors.request.use(async (config) => {
  if (!authToken) await loadToken();
  if (authToken) config.headers.Authorization = `Token ${authToken}`;
  return config;
});

client.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) await clearSession();
    return Promise.reject(error);
  }
);

const toErrorMessage = (error) => {
  const data = error.response?.data;
  if (data) {
    if (typeof data === "string") return data;
    if (typeof data.detail === "string") return data.detail;
    if (Array.isArray(data.detail)) return data.detail.join(" ");
    if (typeof data === "object") {
      const values = Object.values(data).filter(Boolean);
      if (values.length) return values.flat().map(String).join(" ");
    }
  }
  if (!error.response) {
    return "Impossible de se connecter au serveur. Vérifiez votre connexion Internet et réessayez.";
  }
  return "Une erreur est survenue. Veuillez réessayer.";
};

const logError = (tag, error) => {
  console.log(
    `[${tag}] status: ${error.response?.status} | data: ${JSON.stringify(error.response?.data)}`
  );
};

export const getCall = async (endpoint, params) => {
  try {
    const res = await client.get(endpoint, { params });
    return res.data;
  } catch (e) {
    logError(`GET ${endpoint}`, e);
    throw new Error(toErrorMessage(e));
  }
};

export const postCall = async (endpoint, data) => {
  try {
    const res = await client.post(endpoint, data);
    return res.data;
  } catch (e) {
    logError(`POST ${endpoint}`, e);
    throw new Error(toErrorMessage(e));
  }
};

export const putCall = async (endpoint, data) => {
  try {
    const res = await client.put(endpoint, data);
    return res.data;
  } catch (e) {
    logError(`PUT ${endpoint}`, e);
    throw new Error(toErrorMessage(e));
  }
};

export const patchCall = async (endpoint, data) => {
  try {
    const res = await client.patch(endpoint, data);
    return res.data;
  } catch (e) {
    logError(`PATCH ${endpoint}`, e);
    throw new Error(toErrorMessage(e));
  }
};

export const deleteCall = async (endpoint) => {
  try {
    const res = await client.delete(endpoint);
    return res.data;
  } catch (e) {
    logError(`DELETE ${endpoint}`, e);
    throw new Error(toErrorMessage(e));
  }
};

const persistTokenFrom = async (data) => {
  const token = data?.key ?? data?.token;
  if (token) {
    await saveToken(token);
  }
  return data;
};

export const login = async (username, password) => {
  try {
    const res = await client.post("/users/auth/login-mobile/", {
      username,
      password,
    });
    return await persistTokenFrom(res.data);
  } catch (e) {
    logError("LOGIN MOBILE", e);
    throw new Error(toErrorMessage(e));
  }
};

export const register = async ({ username, email, password1, password2 }) => {
  try {
    const res = await client.post("/users/auth/register-mobile/", {
      username,
      email,
      password1,
      password2,
    });
    return await persistTokenFrom(res.data);
  } catch (e) {
    logError("REGISTER MOBILE", e);
    throw new Error(toErrorMessage(e));
  }
};

export const getCurrentUser = async () => {
  const data = await getCall("/users/auth/user/");
  return data?.user ?? data;
};

export const isSessionValid = async () => {
  const token = await loadToken();
  if (!token) return false;
  try {
    await client.get("/users/auth/user/");
    return true;
  } catch (e) {
    await clearSession();
    return false;
  }
};

export const logout = async () => {
  try {
    await client.post("/users/auth/logout-mobile/");
  } catch (e) {}
  await clearSession();
};
