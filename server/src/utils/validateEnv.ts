import { cleanEnv, port, str } from 'envalid'

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    APP_URL: str(),
    POSTGRES_HOST: str(),
    POSTGRES_PORT: port(),
    POSTGRES_USER: str(),
    POSTGRES_PASSWORD: str(),
    POSTGRES_DB: str(),
    JWT_ACCESS_TOKEN_KEY: str(),
    JWT_REFRESH_TOKEN_KEY: str(),
  });
};

export default validateEnv;