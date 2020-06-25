import cors from 'cors';
import { config } from '../../../../config';

export default cors({
  origin: config.client.origin,
  credentials: true,
  exposedHeaders: ['Content-Disposition'],
});
