export const WABLAS_SERVERS = {
  'eu': 'https://eu.wablas.com',
  'deu': 'https://deu.wablas.com',
  'as': 'https://as.wablas.com',
  'das': 'https://das.wablas.com',
  'us': 'https://us.wablas.com',
  'dus': 'https://dus.wablas.com',
} as const;

export type WablasServer = keyof typeof WABLAS_SERVERS;

export interface WablasConfig {
  server: WablasServer;
  apiKey: string;
}

const config: WablasConfig = {
  server: 'eu',
  apiKey: '',
};

export const setWablasConfig = (newConfig: Partial<WablasConfig>) => {
  Object.assign(config, newConfig);
};

export const getWablasConfig = (): WablasConfig => {
  return { ...config };
};

export const getBaseUrl = () => {
  return `${WABLAS_SERVERS[config.server]}/api`;
};