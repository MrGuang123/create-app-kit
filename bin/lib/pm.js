const fs = require("fs");
const { execSync } = require("child_process");
const {
  PACKAGE_MANAGERS,
  PM_PRIORITY,
  INSTALL_COMMANDS,
} = require("./constants");

/**
 * 检测可用的包管理器
 * @returns {string[]} 可用的包管理器列表
 */
const detectPackageManagers = () => {
  return PACKAGE_MANAGERS.filter(({ name }) => {
    try {
      execSync(`${name} --version`, { stdio: "ignore" });
      return true;
    } catch {
      return false;
    }
  }).map(({ name }) => name);
};

/**
 * 猜测用户偏好的包管理器（基于当前目录的 lockfile）
 * @param {string[]} availablePMs - 可用的包管理器列表
 * @returns {string}
 */
const guessPreferredPM = (availablePMs) => {
  const lockfileMap = {
    "pnpm-lock.yaml": "pnpm",
    "yarn.lock": "yarn",
    "bun.lockb": "bun",
    "package-lock.json": "npm",
  };

  for (const [file, pm] of Object.entries(lockfileMap)) {
    if (fs.existsSync(file) && availablePMs.includes(pm)) {
      return pm;
    }
  }

  return (
    PM_PRIORITY.find((pm) => availablePMs.includes(pm)) ||
    "npm"
  );
};

/**
 * 安装依赖
 * @param {string} targetDir - 目标目录
 * @param {string} packageManager - 包管理器名称
 * @returns {Promise<boolean>}
 */
const installDependencies = async (
  targetDir,
  packageManager
) => {
  try {
    execSync(INSTALL_COMMANDS[packageManager], {
      cwd: targetDir,
      stdio: "inherit",
    });
    return true;
  } catch {
    return false;
  }
};

module.exports = {
  detectPackageManagers,
  guessPreferredPM,
  installDependencies,
};
