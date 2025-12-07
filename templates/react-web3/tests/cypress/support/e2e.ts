// 全局配置文件，类似jest的setupTests.ts，但更通用
// 在所有测试前执行的初始化代码
import "./commands";

// 全局配置
Cypress.on("uncaught:exception", (err) => {
  // 忽略 React 开发模式的一些错误
  if (err.message.includes("ResizeObserver")) {
    return false;
  }
});
