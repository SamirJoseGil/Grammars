// app/env.server.ts

/**
 * Normaliza URLs de API para manejar:
 * - Rutas relativas: /api
 * - Dominios sin protocolo: grammarapi.sglabs.site -> https://grammarapi.sglabs.site
 * - URLs completas: https://grammarapi.sglabs.site
 * - Localhost: http://localhost:8000/api
 */
function normalizeApiUrl(url: string): string {
  if (!url) return "/api"; // Fallback seguro
  
  const trimmed = url.trim();
  
  // Si ya es una URL absoluta con protocolo
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  
  // Si es una ruta relativa (comienza con /)
  if (trimmed.startsWith('/')) {
    return trimmed;
  }
  
  // Si contiene un punto (dominio), agregar https://
  if (trimmed.includes('.')) {
    return `https://${trimmed}`;
  }
  
  // Fallback: tratar como ruta relativa
  return `/${trimmed}`;
}

const rawUrl = process.env.api_base_url ?? process.env.API_BASE_URL ?? "/api";
const normalizedUrl = normalizeApiUrl(rawUrl);

// Log en servidor para debugging
if (process.env.NODE_ENV !== "production") {
  console.log(`[ENV] Raw API URL: ${rawUrl}`);
  console.log(`[ENV] Normalized API URL: ${normalizedUrl}`);
}

export const ENV = {
  API_BASE_URL: normalizedUrl,
  NODE_ENV: process.env.NODE_ENV ?? "development",
};

export const isProd = ENV.NODE_ENV === "production";
