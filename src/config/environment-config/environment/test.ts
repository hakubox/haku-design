import type { ServerConfig } from '@/@types';

export const serverConfig: ServerConfig = {
  subject: '测试环境',
  environment: 'test',
  apiSrc: 'https://saas-api.vansunscience.com',
  whiteList: ['https://saas-admin.vansunscience.com', 'https://doctor.vansunscience.com']
};
