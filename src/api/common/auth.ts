import { deletes, get, post } from '@/lib/api';

/** 用户登录 */
export function login(account, password, code) {
  return post('/auth/authApi/login', {
    password,
    account,
    code,
    productId: 0,
    projectId: 0,
    loginMode: '00',
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
