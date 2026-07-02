interface EnvConfig {
  VITE_API_BASE_URL: string;
  VITE_DEFAULT_PAGE_SIZE: number;
  VITE_ENABLE_DEVTOOLS: boolean;
}

const REQUIRED_VARS = ["VITE_API_BASE_URL"] as const;

function assertRequiredVars(): void {
  const missing = REQUIRED_VARS.filter(
    (key) => !import.meta.env[key]
  );

  if (missing.length > 0) {
    throw new Error(
      `[env] Missing required environment variable(s): ${missing.join(", ")}. ` +
        `Copy .env.example to .env and fill in the values.`
    );
  }
}

function readEnv(): EnvConfig {
  assertRequiredVars();

  const pageSizeRaw = import.meta.env.VITE_DEFAULT_PAGE_SIZE;
  const devtoolsRaw = import.meta.env.VITE_ENABLE_DEVTOOLS;

  const pageSize = pageSizeRaw ? Number(pageSizeRaw) : 24;
  const enableDevtools = devtoolsRaw === "true";

  return {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL as string,
    VITE_DEFAULT_PAGE_SIZE: pageSize,
    VITE_ENABLE_DEVTOOLS: enableDevtools,
  };
}

export const env: EnvConfig = readEnv();
