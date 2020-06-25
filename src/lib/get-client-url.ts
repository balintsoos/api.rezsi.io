import { config } from '../config';

export const getClientUrl = (endpoint: string): string => `${config.client.origin}${endpoint}`;
