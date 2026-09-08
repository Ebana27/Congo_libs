import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = (process.env.EXPO_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1").replace(/\/$/, "");

const API_ORIGIN = API_URL.includes("/api/") ? API_URL.slice(0, API_URL.indexOf("/api/")) : API_URL;

const COOKIE_KEY = "congolibs_cookies";
const CSRF_KEY = "congolibs_csrf";

let cookieStore = "";
let csrfToken = "";

const loadSession = async () => {
  try {
    const [c, t] = await Promise.all([
      AsyncStorage.getItem(COOKIE_KEY),
      AsyncStorage.getItem(CSRF_KEY),
    ]);
    if (c) cookieStore = c;
    if (t) csrfToken = t;
  } catch (e) {}
};

const persistSession = async () => {
  try {
    await Promise.all([
      AsyncStorage.setItem(COOKIE_KEY, cookieStore),
      AsyncStorage.setItem(CSRF_KEY, csrfToken),
    ]);
  } catch (e) {}
};

export const clearSession = async () => {
  cookieStore = "";
  csrfToken = "";
  try {
    await AsyncStorage.multiRemove([COOKIE_KEY, CSRF_KEY]);
  } catch (e) {}
};

const persistCookies = (headers) => {
  const setCookie = headers?.["set-cookie"];
  if (setCookie) {
    const lines = Array.isArray(setCookie) ? setCookie : setCookie.split("\n");
    const pairs = lines
      .map((line) => (line || "").split(";")[0].trim())
      .filter((pair) => pair.includes("="));
    if (pairs.length) cookieStore = pairs.join("; ");
  }
  const csrfMatch = cookieStore.match(/csrftoken=([^;]+)/);
  if (csrfMatch) csrfToken = csrfMatch[1];
  if (cookieStore || csrfToken) persistSession();
};

export const setCsrfToken = (token) => {
  if (token) csrfToken = token;
  persistSession();
};

export const primeCsrfToken = async () => {
  if (csrfToken) return true;
  try {
    await client.get("/users/session/");
  } catch (e) {}
  return !!csrfToken;
};

const client = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use((config) => {
  if (cookieStore) config.headers.Cookie = cookieStore;
  if (csrfToken) config.headers["X-CSRFToken"] = csrfToken;
  config.headers.Referer = `${API_ORIGIN}/`;
  config.headers.Origin = API_ORIGIN;
  return config;
});

client.interceptors.response.use(
  (response) => {
    persistCookies(response.headers);
    if (response.data?.csrfToken) setCsrfToken(response.data.csrfToken);
    return response;
  },
  (error) => {
    persistCookies(error.response?.headers);
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
      const values = Object.values(data).filter((v) => v);
      if (values.length) return values.flat().map(String).join(" ");
    }
  }
  if (!error.response) {
    return "Impossible de se connecter au serveur. Vérifiez votre connexion Internet et réessayez.";
  }
  return "Une erreur est survenue. Veuillez réessayer.";
};

export const getCall = async (endpoint, params) => {
  try {
    const res = await client.get(endpoint, { params });
    return res.data;
  } catch (e) {
    throw new Error(toErrorMessage(e));
  }
};

export const postCall = async (endpoint, data) => {
  try {
    const res = await client.post(endpoint, data);
    return res.data;
  } catch (e) {
    throw new Error(toErrorMessage(e));
  }
};

export const isSessionValid = async () => {
  await loadSession();
  try {
    await client.get("/users/session/");
    return true;
  } catch (e) {
    return false;
  }
};

export const logout = async () => {
  try {
    await client.post("/users/logout/");
  } catch (e) {}
  await clearSession();
};
