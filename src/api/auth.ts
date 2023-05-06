import { deletes, get, post } from '@/lib/api';
import { serverConfig } from '@/config';

const _baseUrl = () => {
  return serverConfig.serverConfig.environment === 'development' ? '/userapi/api' : 'https://bpmtest-userapi.gejinet.com/api';
};

/** 获取Token */
export function getToken(username: string, password: string) {
  return post(`${_baseUrl()}/Authorization/GetToken`, {
    name: username,
    password: password,
  });
}

/** 用户登出 */
export function logout() {
  return deletes('/auth/logout');
}

/** 获取当前用户信息 */
export function getCurrentUserInfo() {
  return get('/system/user/getInfo', {}, { returnResponse: true });
}

/** 获取用户信息 */
export function getInfo(userId?: string) {
  return get(`/system/user/${userId}`);
}
