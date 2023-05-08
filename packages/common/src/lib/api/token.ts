const TokenKey = 'Authorization';

/**
 * 获取Token
 * @param hasBearer 是否添加Bearer认证头
 */
export function getToken(hasBearer: boolean = false): string {
  const _authorization = localStorage.getItem(TokenKey); // localStorage.getItem('Authorization');
  if (_authorization) {
    return hasBearer ? `Bearer ${_authorization}` : _authorization;
  }
  return '';
}
/** 设置Token */
export function setToken(authorization: string): void {
  localStorage.setItem(TokenKey, authorization);
}

/** 移除Token */
export function removeToken() {
  return localStorage.removeItem(TokenKey);
}
