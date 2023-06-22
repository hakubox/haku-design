import { deletes, get, post } from '@/lib/api';

/** 获取Token */
export function getToken(username: string, password: string) {
  return post(`${process.env.userApi}/Authorization/GetToken`, {
    name: username,
    password: password,
  });
}

/** 用户登出 */
export function logout() {
  return deletes(`${process.env.userApi}/auth/logout`);
}

/** 获取当前用户信息 */
export function getCurrentUserInfo() {
  return get('/system/user/getInfo', {}, { returnResponse: true });
}

/** 获取用户信息 */
export function getInfo(userId?: string) {
  return get(`/system/user/${userId}`);
}
