const Joi = require('joi');

require('dotenv').config();

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow(['development', 'production', 'test', 'provision'])
    .default('development'),
  PORT: Joi.number()
    .default(4040),
  MONGOOSE_DEBUG: Joi.boolean()
    .when('NODE_ENV', {
      is: Joi.string().equal('development'),
      then: Joi.boolean().default(true),
      otherwise: Joi.boolean().default(false),
    }),
  JWT_SECRET: Joi.string()
    .required(),
  MONGO_HOST: Joi.string()
    .required(),
  MONGO_PORT: Joi.number()
    .default(27017),
  GMAIL_USER: Joi.string()
    .required(),
  GMAIL_PASS: Joi.string()
    .required(),
  GMAIL_ADDRESS: Joi.string()
    .required(),
  CLIENT_ORIGIN: Joi.string()
    .when('NODE_ENV', {
      is: Joi.string().equal('development'),
      then: Joi.string().default('http://localhost:3000'),
      otherwise: Joi.string().default('https://app-rezsi.herokuapp.com'),
    }),
  SERVER_ORIGIN: Joi.string()
    .when('NODE_ENV', {
      is: Joi.string().equal('development'),
      then: Joi.string().default('http://localhost'),
      otherwise: Joi.string().default('https://api-rezsi.herokuapp.com'),
    }),
}).unknown().required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const serverUrl = envVars.NODE_ENV === 'development'
  ? `${envVars.SERVER_ORIGIN}:${envVars.PORT}`
  : envVars.SERVER_ORIGIN;

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongooseDebug: envVars.MONGOOSE_DEBUG,
  jwtSecret: envVars.JWT_SECRET,
  mongo: {
    host: envVars.MONGO_HOST,
    port: envVars.MONGO_PORT,
  },
  gmail: {
    user: envVars.GMAIL_USER,
    pass: envVars.GMAIL_PASS,
    address: envVars.GMAIL_ADDRESS,
  },
  client: {
    origin: envVars.CLIENT_ORIGIN,
  },
  server: {
    origin: serverUrl,
  },
};
