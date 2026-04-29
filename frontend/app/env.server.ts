// app/env.server.ts
export const ENV = {
  API_BASE_URL: process.env.api_base_url ?? process.env.API_BASE_URL ?? "/api",
  NODE_ENV: process.env.NODE_ENV ?? "development",
};

export const isProd = ENV.NODE_ENV === "production";
