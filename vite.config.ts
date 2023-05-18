/// <reference types="vitest" />

import { type UserConfigExport } from 'vite';
// import basicSsl from '@vitejs/plugin-basic-ssl';
import * as dotenv from 'dotenv';

import { config as designConfig } from './vite-design.config';
import { config as userConfig } from './vite-user.config';
import { config as userlibConfig } from './vite-userlib.config';

// https://vitejs.dev/config/

if (!process.env.buildMode) process.env.buildMode = 'development';

dotenv.config({ path: '.env' });
dotenv.config({ path: `.env.${process.env.buildMode}` });

const buildProj = process.env.buildProj;

let config: UserConfigExport;

switch (buildProj) {
  // 设计端
  case 'design':
    console.log('——设计端编译——');
    config = designConfig();
    break;
  // 用户端
  case 'user':
    console.log('——用户端编译——');
    config = userConfig();
    break;
  // 用户组件
  case 'userlib':
    console.log('——用户组件编译——');
    config = userlibConfig();
    break;
  default:
    break;
}

export default config;