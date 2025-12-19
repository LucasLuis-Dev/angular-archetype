declare interface Env {
  readonly NODE_ENV: string;
  // Add your environment variables here
  readonly NG_APP_API_URL: string;
  readonly NG_APP_API_TIMEOUT: string;
  readonly NG_APP_ENABLE_ANALYTICS: string;
  readonly NG_APP_ENABLE_DEBUG: string;
  readonly NG_APP_AUTH_DOMAIN: string;
  readonly NG_APP_AUTH_CLIENT_ID: string;
}

declare interface ImportMeta {
  readonly env: Env;
}
