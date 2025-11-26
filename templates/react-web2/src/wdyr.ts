import React from "react";

if (process.env.NODE_ENV === "development") {
  const whyDidYouRender = require("@welldone-software/why-did-you-render");
  whyDidYouRender(React, {
    trackAllPureComponents: true, // 追踪所有 PureComponent 和 React.memo 组件
    trackHooks: true, // 追踪 hooks 导致的重渲染
    logOnDifferentValues: false, // 即使值不同也记录（帮助发现不必要的新对象/数组）
    logOnChildrenChange: true, // 追踪子组件的渲染
    collapseGroups: true, // 折叠控制台输出
    // include: [/^App/], // 只追踪名称匹配的组件
    // exclude: [/^Connect/], // 排除某些组件
  });

  console.log("✅ why-did-you-render is enabled");
}
