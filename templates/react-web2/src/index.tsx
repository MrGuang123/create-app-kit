// 性能监控工具（必须在 React 之前导入）
import "@/utils/performanceTool";
import "./wdyr";

import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import "./locales";
import App from "./App";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element #root not found");
}

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
