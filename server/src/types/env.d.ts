declare interface PostgresEnv {
  POSTGRES_HOST: string;
  POSTGRES_PORT: string;
  POSTGRES_USERNAME: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DATABASE: string;
}

declare interface ElasticsearchEnv {
  ELASTICSEARCH_NODE: string;
  ELASTICSEARCH_USERNAME: string;
  ELASTICSEARCH_PASSWORD: string;
  ELASTICSEARCH_TLS_CA: string;
}

declare module NodeJS {
  interface ProcessEnv extends PostgresEnv, ElasticsearchEnv {
    NODE_ENV: 'production' | 'development' | 'test';
  }
}
