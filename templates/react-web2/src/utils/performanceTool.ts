/**
 * 性能监控工具初始化模块
 *
 * 包含三个工具：
 * - Stats.js: FPS/帧时间/内存监控
 * - React Scan: React 组件渲染可视化
 * - React Grab: Cmd+C 抓取组件上下文给 AI
 *
 * 通过环境变量 __APP_ENV__.enablePerfTools 控制开关
 * 在 build/config.js 中配置
 *
 * @example
 * ```ts
 * // 必须在 React 之前导入！
 * import "@/utils/performanceTool";
 * import React from "react";
 * ```
 */

// 1. 初始化 React Scan（必须在 React 之前）
import { scan } from "react-scan";

if (__APP_ENV__.enablePerfTools) {
  scan({
    enabled: true,
    log: false,
    _debug: "verbose",
  });
}

// 2. 初始化 Stats.js
if (__APP_ENV__.enablePerfTools) {
  import("stats.js").then((StatsModule) => {
    const Stats = StatsModule.default;
    const stats = new Stats();
    stats.showPanel(0); // 0: FPS, 1: MS, 2: MB
    stats.dom.style.cssText =
      "position:fixed;top:0;right:0;z-index:99999;cursor:pointer;";
    document.body.appendChild(stats.dom);

    const animate = () => {
      stats.begin();
      stats.end();
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  });
}

// 3. 加载 React Grab
if (__APP_ENV__.enablePerfTools) {
  const script = document.createElement("script");
  script.src = "https://www.react-grab.com/script.js";
  script.crossOrigin = "anonymous";
  document.body.appendChild(script);
}

export {};
