import dotenv from 'dotenv';

dotenv.config();

export { default as placesData } from './getPlacesData';
export { default as errorHandler } from './defaultErrorHandler';

export const healthCheckMessage = 'Health check complete, server is active';
export const baseUrl = 'https://api.harvardartmuseums.org/';
export const defaultEncoding = 'utf8';

export const DATABASE_URL = process.env.DATABASE_URL;
export const HARVARD_API_KEY = process.env.API_KEY;
