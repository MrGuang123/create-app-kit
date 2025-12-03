const fs = require("fs");
const path = require("path");
const fse = require("fs-extra");
const { TEMPLATES_DIR } = require("./constants");

// 公共配置目录
const COMMON_CONFIGS_DIR = path.join(
  __dirname,
  "../../configs/common"
);

// 由公共配置或 linter 配置提供的文件/目录
const SHARED_CONFIG_FILES = [
  ".github",
  ".husky",
  ".gitignore",
  ".vscode",
];

// 可选功能对应的文件/目录映射
const OPTIONAL_FEATURE_FILES = {
  graphql: [
    "src/utils/graphql.ts",
    "src/services/graphql",
    "src/mocks/graphql.ts",
    "src/pages/graphqlDemo",
  ],
  worker: [
    "src/workers",
    "src/hooks/useWorker.ts",
    "src/pages/workerDemo",
  ],
  wasm: [
    "src/wasm",
    "wasm",
    "src/pages/wasmDemo",
    "src/types/wasm.d.ts",
  ],
  perftools: [
    "src/utils/performanceTool.ts",
    "src/pages/perfToolsDemo",
    "src/types/stats.d.ts",
  ],
};

/**
 * 读取所有可用模板
 * @returns {Array} 模板列表
 */
const readTemplates = () => {
  if (!fs.existsSync(TEMPLATES_DIR)) return [];

  return fs
    .readdirSync(TEMPLATES_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => {
      const templatePath = path.join(
        TEMPLATES_DIR,
        dirent.name
      );
      const metaPath = path.join(
        templatePath,
        "template.json"
      );
      const meta = fs.existsSync(metaPath)
        ? JSON.parse(fs.readFileSync(metaPath, "utf8"))
        : {};

      return {
        name: dirent.name,
        title: meta.title || dirent.name,
        description: meta.description || "",
        features: meta.features || {},
        path: templatePath,
      };
    });
};

/**
 * 获取需要排除的文件列表（基于未选择的功能）
 * @param {string[]} selectedFeatures - 用户选择的功能
 * @returns {string[]} 需要排除的相对路径列表
 */
const getExcludedPaths = (selectedFeatures) => {
  const excluded = [];
  for (const [feature, paths] of Object.entries(
    OPTIONAL_FEATURE_FILES
  )) {
    if (!selectedFeatures.includes(feature)) {
      excluded.push(...paths);
    }
  }
  return excluded;
};

/**
 * 复制模板到目标目录
 * @param {Object} template - 模板对象
 * @param {string} targetDir - 目标目录
 * @param {string} projectName - 项目名称
 * @param {string[]} selectedFeatures - 用户选择的可选功能
 */
const copyTemplate = async (
  template,
  targetDir,
  projectName,
  selectedFeatures = []
) => {
  // 需要排除的文件/目录（基础排除）
  const excludeFiles = [
    "template.json",
    "linter-configs",
    "node_modules",
    "pnpm-lock.yaml",
    "yarn.lock",
    "package-lock.json",
    "bun.lockb",
    ...SHARED_CONFIG_FILES,
  ];

  // 根据未选择的功能，获取需要排除的路径
  const excludedPaths = getExcludedPaths(selectedFeatures);

  await fse.copy(template.path, targetDir, {
    dereference: true,
    filter: (src) => {
      const basename = path.basename(src);
      if (excludeFiles.includes(basename)) return false;

      // 检查是否在排除路径中
      const relativePath = path.relative(
        template.path,
        src
      );
      for (const excludedPath of excludedPaths) {
        if (
          relativePath === excludedPath ||
          relativePath.startsWith(excludedPath + path.sep)
        ) {
          return false;
        }
      }
      return true;
    },
  });

  await updatePackageJson(targetDir, projectName, {});
};

/**
 * 复制公共配置到目标目录
 * @param {string} targetDir - 目标目录
 */
const copyCommonConfigs = async (targetDir) => {
  if (!fs.existsSync(COMMON_CONFIGS_DIR)) {
    return;
  }

  await fse.copy(COMMON_CONFIGS_DIR, targetDir, {
    dereference: true,
  });
};

/**
 * 更新 package.json
 * @param {string} targetDir - 目标目录
 * @param {string} projectName - 项目名称
 * @param {Object} updates - 更新内容
 */
const updatePackageJson = async (
  targetDir,
  projectName,
  updates
) => {
  const pkgPath = path.join(targetDir, "package.json");
  if (!fs.existsSync(pkgPath)) return;

  const contents = await fse.readFile(pkgPath, "utf8");
  const json = JSON.parse(contents);
  json.name = projectName;
  json.version = json.version || "0.1.0";

  // 合并更新
  if (updates.scripts) {
    json.scripts = { ...json.scripts, ...updates.scripts };
  }
  if (updates.devDependencies) {
    json.devDependencies = {
      ...json.devDependencies,
      ...updates.devDependencies,
    };
  }
  if (updates.removeDeps) {
    for (const dep of updates.removeDeps) {
      delete json.devDependencies?.[dep];
      delete json.dependencies?.[dep];
    }
  }
  if (updates.lintStaged) {
    json["lint-staged"] = updates.lintStaged;
  }

  await fse.writeFile(
    pkgPath,
    JSON.stringify(json, null, 2)
  );
};

/**
 * 处理可选功能：更新路由、布局和 package.json
 * @param {string} targetDir - 目标目录
 * @param {string[]} selectedFeatures - 用户选择的可选功能
 */
const processOptionalFeatures = async (
  targetDir,
  selectedFeatures
) => {
  const hasGraphQL = selectedFeatures.includes("graphql");
  const hasWorker = selectedFeatures.includes("worker");
  const hasWasm = selectedFeatures.includes("wasm");
  const hasPerfTools =
    selectedFeatures.includes("perftools");

  // 如果全部选中，无需处理
  if (hasGraphQL && hasWorker && hasWasm && hasPerfTools)
    return;

  // 更新路由配置
  const routeConfigPath = path.join(
    targetDir,
    "src/routes/config.tsx"
  );
  if (fs.existsSync(routeConfigPath)) {
    let routeContent = await fse.readFile(
      routeConfigPath,
      "utf8"
    );

    if (!hasGraphQL) {
      // 移除 GraphQL 相关导入和路由
      routeContent = routeContent.replace(
        /import GraphQLDemo from "@\/pages\/graphqlDemo";\n/,
        ""
      );
      routeContent = routeContent.replace(
        /\s*\{ path: "graphqlDemo", element: <GraphQLDemo \/> \},?\n?/,
        "\n"
      );
    }

    if (!hasWorker) {
      // 移除 Worker 相关导入和路由
      routeContent = routeContent.replace(
        /import WorkerDemo from "@\/pages\/workerDemo";\n/,
        ""
      );
      routeContent = routeContent.replace(
        /\s*\{ path: "workerDemo", element: <WorkerDemo \/> \},?\n?/,
        "\n"
      );
    }

    if (!hasWasm) {
      // 移除 WASM 相关导入和路由
      routeContent = routeContent.replace(
        /import WasmDemo from "@\/pages\/wasmDemo";\n/,
        ""
      );
      routeContent = routeContent.replace(
        /\s*\{ path: "wasmDemo", element: <WasmDemo \/> \},?\n?/,
        "\n"
      );
    }

    if (!hasPerfTools) {
      // 移除 PerfTools 相关导入和路由
      routeContent = routeContent.replace(
        /import PerfToolsDemo from "@\/pages\/perfToolsDemo";\n/,
        ""
      );
      routeContent = routeContent.replace(
        /\s*\{ path: "perfToolsDemo", element: <PerfToolsDemo \/> \},?\n?/,
        "\n"
      );
    }

    await fse.writeFile(routeConfigPath, routeContent);
  }

  // 更新布局菜单
  const layoutPath = path.join(
    targetDir,
    "src/layouts/rootLayout/index.tsx"
  );
  if (fs.existsSync(layoutPath)) {
    let layoutContent = await fse.readFile(
      layoutPath,
      "utf8"
    );

    if (!hasGraphQL) {
      // 移除 GraphQL 菜单项和图标导入
      layoutContent = layoutContent.replace(
        /,\n\s*GitBranch/,
        ""
      );
      layoutContent = layoutContent.replace(
        /\s*\{\n\s*label: "GraphQL",\n\s*to: "\/graphqlDemo",\n\s*icon: GitBranch,\n\s*\},?\n?/,
        "\n"
      );
    }

    if (!hasWorker) {
      // 移除 Worker 菜单项和图标导入
      layoutContent = layoutContent.replace(
        /,\n\s*Cpu/,
        ""
      );
      layoutContent = layoutContent.replace(
        /\s*\{\n\s*label: "Web Worker",\n\s*to: "\/workerDemo",\n\s*icon: Cpu,\n\s*\},?\n?/,
        "\n"
      );
    }

    if (!hasWasm) {
      // 移除 WASM 菜单项和图标导入
      layoutContent = layoutContent.replace(
        /,\n\s*Zap/,
        ""
      );
      layoutContent = layoutContent.replace(
        /\s*\{\n\s*label: "WebAssembly",\n\s*to: "\/wasmDemo",\n\s*icon: Zap,\n\s*\},?\n?/,
        "\n"
      );
    }

    if (!hasPerfTools) {
      // 移除 PerfTools 菜单项和图标导入
      layoutContent = layoutContent.replace(
        /,\n\s*Activity/,
        ""
      );
      layoutContent = layoutContent.replace(
        /\s*\{\n\s*label: "Performance Tools",\n\s*to: "\/perfToolsDemo",\n\s*icon: Activity,\n\s*\},?\n?/,
        "\n"
      );
    }

    await fse.writeFile(layoutPath, layoutContent);
  }

  // 更新 package.json
  const pkgPath = path.join(targetDir, "package.json");
  if (fs.existsSync(pkgPath)) {
    const pkgContent = await fse.readFile(pkgPath, "utf8");
    const pkg = JSON.parse(pkgContent);

    // 移除 GraphQL 相关依赖
    if (!hasGraphQL) {
      delete pkg.dependencies?.["graphql"];
      delete pkg.dependencies?.["graphql-request"];
    }

    // 移除 WASM 相关脚本
    if (!hasWasm) {
      delete pkg.scripts["wasm:build"];
      delete pkg.scripts["wasm:build:dev"];
    }

    // 移除 PerfTools 相关依赖
    if (!hasPerfTools) {
      delete pkg.devDependencies?.["stats.js"];
      delete pkg.devDependencies?.["react-scan"];
    }

    await fse.writeFile(
      pkgPath,
      JSON.stringify(pkg, null, 2)
    );
  }

  // 更新 mocks/index.ts（移除 GraphQL mock 导入）
  if (!hasGraphQL) {
    const mocksIndexPath = path.join(
      targetDir,
      "src/mocks/index.ts"
    );
    if (fs.existsSync(mocksIndexPath)) {
      let mocksContent = await fse.readFile(
        mocksIndexPath,
        "utf8"
      );
      // 移除 graphql mock 导入
      mocksContent = mocksContent.replace(
        /import \{ graphqlMock \} from "\.\/graphql";\n/,
        ""
      );
      // 移除 graphqlMock 的使用
      mocksContent = mocksContent.replace(
        /,\s*\.\.\.graphqlMock/,
        ""
      );
      await fse.writeFile(mocksIndexPath, mocksContent);
    }
  }

  // 更新 index.tsx（移除 devtools 导入）
  if (!hasPerfTools) {
    const indexPath = path.join(targetDir, "src/index.tsx");
    if (fs.existsSync(indexPath)) {
      let indexContent = await fse.readFile(
        indexPath,
        "utf8"
      );
      // 移除 performanceTool 导入
      indexContent = indexContent.replace(
        /\/\/ 性能监控工具（必须在 React 之前导入）\nimport "@\/utils\/performanceTool";\n/,
        ""
      );
      await fse.writeFile(indexPath, indexContent);
    }

    // 更新 build/config.js（移除 enablePerfTools 配置）
    const configPath = path.join(
      targetDir,
      "build/config.js"
    );
    if (fs.existsSync(configPath)) {
      let configContent = await fse.readFile(
        configPath,
        "utf8"
      );
      // 移除开发环境的 enablePerfTools
      configContent = configContent.replace(
        /\s*\/\/ 是否开启性能监控工具（Stats\.js \+ React Scan \+ React Grab）\n\s*enablePerfTools: true,\n/,
        "\n"
      );
      // 移除生产环境的 enablePerfTools
      configContent = configContent.replace(
        /\s*\/\/ 是否开启性能监控工具（生产环境关闭）\n\s*enablePerfTools: false,\n/,
        "\n"
      );
      await fse.writeFile(configPath, configContent);
    }

    // 更新 env.d.ts（移除 enablePerfTools 类型）
    const envDtsPath = path.join(
      targetDir,
      "src/types/env.d.ts"
    );
    if (fs.existsSync(envDtsPath)) {
      let envDtsContent = await fse.readFile(
        envDtsPath,
        "utf8"
      );
      envDtsContent = envDtsContent.replace(
        /\s*\/\*\* 是否开启性能监控工具（Stats\.js \+ React Scan \+ React Grab） \*\/\n\s*enablePerfTools: boolean;\n/,
        "\n"
      );
      await fse.writeFile(envDtsPath, envDtsContent);
    }
  }
};

module.exports = {
  readTemplates,
  copyTemplate,
  copyCommonConfigs,
  updatePackageJson,
  processOptionalFeatures,
  OPTIONAL_FEATURE_FILES,
};
