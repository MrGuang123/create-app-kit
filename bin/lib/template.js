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
 * 复制模板到目标目录
 * @param {Object} template - 模板对象
 * @param {string} targetDir - 目标目录
 * @param {string} projectName - 项目名称
 */
const copyTemplate = async (
  template,
  targetDir,
  projectName
) => {
  // 需要排除的文件/目录
  const excludeFiles = [
    "template.json",
    "linter-configs",
    ...SHARED_CONFIG_FILES,
  ];

  await fse.copy(template.path, targetDir, {
    dereference: true,
    filter: (src) => {
      const basename = path.basename(src);
      return !excludeFiles.includes(basename);
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

module.exports = {
  readTemplates,
  copyTemplate,
  copyCommonConfigs,
  updatePackageJson,
};
