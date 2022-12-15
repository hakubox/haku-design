import type { ServerConfig } from '@/@types';

export const serverConfig: ServerConfig = {
  subject: '开发环境',
  environment: 'development',
  apiSrc: 'https://saas-api.vansunscience.com',
  whiteList: ['https://saas-admin.vansunscience.com', 'https://doctor.vansunscience.com']
};
