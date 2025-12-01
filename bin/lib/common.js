const path = require("path");
const fse = require("fs-extra");

// 公共配置目录 (configs/common/)
const COMMON_CONFIGS_DIR = path.join(
  __dirname,
  "../../configs/common"
);

/**
 * 应用公共配置
 * 复制 .github, .husky, .gitignore 等通用配置到目标目录
 * @param {string} targetDir - 目标目录
 */
const applyCommonConfigs = async (targetDir) => {
  // 复制整个 common 目录的内容
  if (await fse.pathExists(COMMON_CONFIGS_DIR)) {
    await fse.copy(COMMON_CONFIGS_DIR, targetDir, {
      overwrite: false, // 不覆盖已存在的文件（模板特定配置优先）
    });
  }
};

module.exports = {
  applyCommonConfigs,
  COMMON_CONFIGS_DIR,
};
