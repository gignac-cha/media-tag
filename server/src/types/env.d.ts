declare interface PostgresEnv {
  POSTGRES_HOST: string;
  POSTGRES_PORT: string;
  POSTGRES_USERNAME: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DATABASE: string;
}

declare module NodeJS {
  interface ProcessEnv extends PostgresEnv {
    NODE_ENV: 'production' | 'development' | 'test';
  }
}
