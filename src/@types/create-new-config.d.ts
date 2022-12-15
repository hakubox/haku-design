import { AppType } from '@/@types/enum';

/** 创建参数 */
export interface CreateNewConfig {
  /** Id */
  id?: string;
  /** 标题 */
  title: string;
  /** 类型 */
  type: AppType | 'questionary';
  /** 描述 */
  description: string;
  /** 其他参数 */
  params: Record<string, any>;
}
