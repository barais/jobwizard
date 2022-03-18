import { boot } from 'quasar/wrappers';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.YAWIK_STRAPI_URL || 'http://localhost:1337',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default boot(({ app }) =>
{
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { axios, api };
