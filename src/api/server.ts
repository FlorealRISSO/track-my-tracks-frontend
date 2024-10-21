import Constants from 'expo-constants';

const BACKEND_URL = Constants.expoConfig?.extra?.backEndUrl;
const BACKEND_PORT = Constants.expoConfig?.extra?.backEndPort;

export const API_URL = `${BACKEND_URL}:${BACKEND_PORT}`;