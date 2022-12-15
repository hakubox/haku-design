import type { ServerConfig } from '@/@types';

export const serverConfig: ServerConfig = {
  subject: '生产环境',
  environment: 'production',
  apiSrc: 'https://saas-api.neutonhealth.com',
  whiteList: ['https://saas-admin.neutonhealth.com', 'https://doctor.neutonhealth.com']
};
