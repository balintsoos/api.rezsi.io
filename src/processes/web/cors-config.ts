import { config } from '../../config';

export const corsConfig = {
  origin: config.client.origin,
  credentials: true,
  exposedHeaders: ['Content-Disposition'],
};
