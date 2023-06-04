/** 评价配置 */
export interface RatingConfig {
  /** 标题 */
  title: string;
  /** 起始分数 */
  startScore: number;
  /** 截止分数 */
  endScore?: number;
  /** 关联维度 */
  dimensionId?: string;
  /** 描述 */
  description?: string;
}
