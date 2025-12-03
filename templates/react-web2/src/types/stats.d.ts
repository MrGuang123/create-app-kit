/**
 * stats.js 类型声明
 * @see https://github.com/mrdoob/stats.js
 */

declare module "stats.js" {
  /**
   * Stats.js 性能监控面板类
   */
  class Stats {
    /**
     * Stats.js DOM 元素
     */
    dom: HTMLDivElement;

    /**
     * 显示指定面板
     * @param id - 面板索引: 0 = FPS, 1 = MS, 2 = MB
     */
    showPanel(id: number): void;

    /**
     * 开始测量
     */
    begin(): void;

    /**
     * 结束测量
     * @returns 返回测量结果
     */
    end(): number;

    /**
     * 更新统计数据
     */
    update(): void;

    /**
     * 添加自定义面板
     * @param panel - 自定义面板实例
     */
    addPanel(panel: Stats.Panel): Stats.Panel;

    /**
     * 设置模式（显示哪个面板）
     * @deprecated 使用 showPanel 代替
     */
    setMode(id: number): void;
  }

  namespace Stats {
    /**
     * 自定义面板类
     */
    class Panel {
      /**
       * 面板 DOM 元素
       */
      dom: HTMLCanvasElement;

      /**
       * 更新面板数据
       * @param value - 当前值
       * @param maxValue - 最大值
       */
      update(value: number, maxValue: number): void;
    }
  }

  // stats.js 使用 CommonJS 导出，动态 import 时会包装为 { default: Stats }
  export default Stats;
}
