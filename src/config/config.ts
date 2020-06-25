import Joi from '@hapi/joi';

const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow('development', 'test', 'staging', 'production')
    .required(),
  PORT: Joi.number().required(),
  SESSION_SECRET: Joi.string().required(),
  MONGO_URL: Joi.string().required(),
  GMAIL_USER: Joi.string().required(),
  GMAIL_PASS: Joi.string().required(),
  GMAIL_ADDRESS: Joi.string().required(),
  CLIENT_ORIGIN: Joi.string().required(),
}).unknown();

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export type Config = {
  env: string;
  port: number;
  session: {
    secret: string;
  },
  mongo: {
    url: string;
  },
  gmail: {
    user: string;
    pass: string;
    address: string;
  },
  client: {
    origin: string;
  },
};

export const config: Config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  session: {
    secret: envVars.JWT_SECRET,
  },
  mongo: {
    url: envVars.MONGO_URL,
  },
  gmail: {
    user: envVars.GMAIL_USER,
    pass: envVars.GMAIL_PASS,
    address: envVars.GMAIL_ADDRESS,
  },
  client: {
    origin: envVars.CLIENT_ORIGIN,
  },
};
