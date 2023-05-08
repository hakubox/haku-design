import { post } from "@/lib/api";

/** 获取文件列表 */
export function getFileList(username: string, password: string) {
  return post(`/Authorization/GetToken`, {
    name: username,
    password: password,
  });
}