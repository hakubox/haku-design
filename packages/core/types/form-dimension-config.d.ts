/**
 * 维度配置
 */
export interface FormDimensionConfig {
  /** 是否开启维度 */
  isOpen: false;
  /** 是否开启维度 */
  dimensionList: FormDimensionItem[];
}

/**
 * 单维度配置
 */
export interface FormDimensionItem {
  /** 维度Id */
  dimensionId: string;
  /** 维度名称 */
  dimensionTitle: string;
  /** 维度因子/权重（默认1.0） */
  dimensionFactor: number;
  /** 维度关联的题目id列表 */
  dimensionQuestions: string[];
  /** 维度描述 */
  dimensionDescription: string;
  /** 维度分数 */
  dimensionScore: number | undefined;
}
