const ENABLED =
  typeof __DEV__ !== 'undefined' ? __DEV__ !== false : true;

const stamp = () => {
  const now = new Date();
  const pad = (value, size = 2) => String(value).padStart(size, '0');
  return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
};

const emit = (level, args) => {
  if (!ENABLED) return;
  console.log(`[${stamp()}] [${level}]`, ...args);
};

export const logStep = (step, data) => emit('LECTURE', ['>', step, data ?? '']);

export const logInfo = (scope, message, data) =>
  emit(scope, [message, data ?? '']);

export const logWarn = (scope, message, data) =>
  emit('WARN', [`[${scope}] ${message}`, data ?? '']);

export const logError = (scope, message, data) =>
  console.error(`[${stamp()}] [ERREUR] [${scope}] ${message}`, data ?? '');

export const logResponse = (scope, response) => {
  if (!response) {
    emit(scope, ['réponse absente']);
    return;
  }
  const headers = response.headers;
  const contentType =
    headers?.get?.('content-type') ?? headers?.['content-type'] ?? '?';
  const length =
    headers?.get?.('content-length') ?? headers?.['content-length'] ?? '?';
  emit(scope, [
    `HTTP ${response.status} · ${String(response.statusText || '')} · type: ${contentType} · taille: ${length}`
  ]);
};
