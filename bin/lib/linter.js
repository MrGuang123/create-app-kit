const fs = require("fs");
const path = require("path");
const fse = require("fs-extra");
const { updatePackageJson } = require("./template");

// 公共 linter 配置目录 (configs/linter/)
const LINTER_CONFIGS_DIR = path.join(
  __dirname,
  "../../configs/linter"
);

/**
 * 获取 linter 配置文件列表
 * @param {string} linterChoice - 'biome' | 'eslint'
 * @returns {string[]} 配置文件名列表
 */
const getLinterConfigFiles = (linterChoice) => {
  if (linterChoice === "biome") {
    return ["biome.json", ".vscode"];
  }
  return [
    ".eslintrc.cjs",
    ".prettierrc",
    ".prettierignore",
    ".vscode",
  ];
};

/**
 * 应用 Linter 配置
 * @param {string} targetDir - 目标目录
 * @param {string} linterChoice - 'biome' | 'eslint'
 */
const applyLinterConfig = async (
  targetDir,
  linterChoice
) => {
  const configPath = path.join(
    LINTER_CONFIGS_DIR,
    linterChoice
  );
  const depsPath = path.join(configPath, "deps.json");

  if (!fs.existsSync(configPath)) {
    return;
  }

  // 复制 Linter 配置文件到目标目录
  const configFiles = getLinterConfigFiles(linterChoice);
  for (const file of configFiles) {
    const src = path.join(configPath, file);
    if (fs.existsSync(src)) {
      await fse.copy(src, path.join(targetDir, file));
    }
  }

  // 读取依赖配置并更新 package.json
  if (fs.existsSync(depsPath)) {
    const deps = JSON.parse(
      await fse.readFile(depsPath, "utf8")
    );
    await updatePackageJson(
      targetDir,
      path.basename(targetDir),
      deps
    );
  }
};

module.exports = {
  applyLinterConfig,
  getLinterConfigFiles,
};
