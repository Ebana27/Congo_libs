import { Platform } from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { File, Paths } from "expo-file-system";
import { logError, logStep, logWarn, logResponse } from "../../utils/logger";

const API_URL = (
  process.env.EXPO_PUBLIC_API_URL ||
  "https://ledevfreelance.pythonanywhere.com/api/v1"
).replace(/\/$/, "");

console.log("[API] URL utilisée :", API_URL);

const TOKEN_KEY = "congolibs_auth_token";
const USER_KEY = "congolibs_user_cache";
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
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (e) {}
};

export const cacheUser = async (user) => {
  if (!user) return null;
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {}
  return user;
};

export const getCachedUser = async () => {
  try {
    const raw = await AsyncStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
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
  if (String(config.url || '').includes("telecharger")) {
    logStep("intercepteur: en-tête Authorization", authToken ? "Token présent" : "AUCUN jeton");
  }
  return config;
});

client.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      logWarn(
        "API",
        `401 sur ${error.config?.url} — la session est invalidée. ` +
          "Si l'URL est /users/auth/login-mobile/ : cet endpoint n'existe pas côté backend, " +
          "donc aucun jeton n'est jamais obtenu et Authorization n'est jamais envoyé."
      );
      await clearSession();
    }
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

const logApiError = (tag, error) => {
  logError(
    tag,
    `status ${error.response?.status ?? "réseau"}`,
    JSON.stringify(error.response?.data)?.slice(0, 300)
  );
};

export const getCall = async (endpoint, params) => {
  try {
    const res = await client.get(endpoint, { params });
    return res.data;
  } catch (e) {
    logApiError(`GET ${endpoint}`, e);
    throw new Error(toErrorMessage(e));
  }
};

export const postCall = async (endpoint, data) => {
  try {
    const res = await client.post(endpoint, data);
    return res.data;
  } catch (e) {
    logApiError(`POST ${endpoint}`, e);
    throw new Error(toErrorMessage(e));
  }
};

export const putCall = async (endpoint, data) => {
  try {
    const res = await client.put(endpoint, data);
    return res.data;
  } catch (e) {
    logApiError(`PUT ${endpoint}`, e);
    throw new Error(toErrorMessage(e));
  }
};

export const patchCall = async (endpoint, data) => {
  try {
    const res = await client.patch(endpoint, data);
    return res.data;
  } catch (e) {
    logApiError(`PATCH ${endpoint}`, e);
    throw new Error(toErrorMessage(e));
  }
};

export const deleteCall = async (endpoint) => {
  try {
    const res = await client.delete(endpoint);
    return res.data;
  } catch (e) {
    logApiError(`DELETE ${endpoint}`, e);
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
    logApiError("LOGIN MOBILE", e);
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
    logApiError("REGISTER MOBILE", e);
    throw new Error(toErrorMessage(e));
  }
};

export const getCurrentUser = async () => {
  const data = await getCall("/users/auth/user/");
  const user = data?.user ?? data;
  return cacheUser(user);
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

export const getDocuments = async (params) => {
  const data = await getCall("/documents/", params);
  return Array.isArray(data) ? data : data?.results ?? [];
};

export const downloadDocument = async (id, nom) => {
  const token = await loadToken();
  const headers = {};
  if (token) headers.Authorization = `Token ${token}`;

  logStep('ouverture document', {
    id,
    nom,
    url: `${API_URL}/documents/${encodeURIComponent(id)}/telecharger/`,
    jeton: token ? `présent (${token.length} car.)` : 'ABSENT',
  });

  const controller =
    typeof AbortController !== "undefined" ? new AbortController() : null;
  const timeout = setTimeout(() => {
    logWarn('LECTURE', 'délai de 30 s dépassé, requête abandonnée');
    controller?.abort();
  }, 30000);
  const startedAt = Date.now();

  let res;
  try {
    res = await fetch(
      `${API_URL}/documents/${encodeURIComponent(id)}/telecharger/`,
      { method: "POST", headers, signal: controller?.signal }
    );
  } catch (e) {
    logError('LECTURE', `requête impossible (${e.name})`, e.message);
    throw new Error(
      "Impossible de télécharger ce document pour le moment. Vérifiez votre connexion Internet et réessayez."
    );
  } finally {
    clearTimeout(timeout);
  }

  logResponse('LECTURE', res);
  logStep('réponse reçue en', `${Date.now() - startedAt} ms`);

  const contentType = res.headers.get("content-type") || "";
  if (!res.ok || contentType.includes("application/json")) {
    const data = contentType.includes("application/json")
      ? await res.json()
      : await res.text();
    let detail =
      typeof data === "string"
        ? data
        : data?.detail || data?.[0] || `Erreur HTTP ${res.status}`;

    logStep('échec API', {
      http: res.status,
      cle: typeof data === "object" && data ? Object.keys(data).join(",") : "texte",
      detail: String(detail).slice(0, 400),
    });

    if (res.status === 401) {
      logWarn(
        'LECTURE',
        '401 — le backend refuse la requête. Cause probable : aucun header Token envoyé, ou TokenAuth absent côté API (SessionAuthentication seulement).'
      );
    } else if (res.status === 403) {
      logWarn('LECTURE', '403 — accès refusé, ou CSRF manquant sur une authentification par cookie.');
    } else if (res.status === 404) {
      logWarn('LECTURE', '404 — id inconnu ou ce n’est pas un UUID valide (l’URL attend un uuid).');
    } else if (res.status === 502) {
      logWarn(
        'LECTURE',
        '502 — le backend a reach Google Drive et a échoué : variable GOOGLE_SERVICE_ACCOUNT_JSON absente/incorrecte, ou lien_telechargement qui n’est pas un ID Drive, ou fichier non partagé avec le compte de service.'
      );
    }

    // On masque les détails techniques/backends (clés Google, stack…) à l'utilisateur.
    if (res.status === 401) {
      detail = "Vous devez être connecté pour télécharger ce document.";
    } else if (
      typeof detail === "string" &&
      (/service account|client_email|token_uri|googleapis|GOOGLE_/i.test(detail) ||
        /authentication|credentials/i.test(detail))
    ) {
      detail =
        res.status === 401
          ? "Vous devez être connecté pour télécharger ce document."
          : "Ce document n'est pas encore disponible au téléchargement. Réessayez plus tard.";
    }
    throw new Error(typeof detail === "string" ? detail : "Téléchargement impossible.");
  }

  const buffer = await res.arrayBuffer();
  logStep('PDF reçu', `${Math.round(buffer.byteLength / 1024)} Ko`);
  if (buffer.byteLength < 1000) {
    logWarn('LECTURE', 'fichier suspect : moins de 1 Ko, le PDF est probablement vide ou tronqué.');
  }

  const safeName =
    (nom ? String(nom).replace(/[\\/:*?"<>|]+/g, "-").slice(0, 60) : id) || id;
  const file = new File(Paths.document, `${safeName}.pdf`);
  if (!file.exists) file.create();
  file.write(new Uint8Array(buffer));
  logStep('fichier enregistré', file.uri);
  return file.uri;
};
