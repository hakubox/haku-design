/** 表单变量 */
export interface FormScript {
  /** Vue变量 */
  data: Record<string, any>;

  /** Vue函数 */
  methods: Record<string, Function>;

  /** 变量监控 */
  watch: Record<string, Function>;

  /** Created钩子 */
  created(): void;

  /** Mounted钩子 */
  mounted(): void;
}
