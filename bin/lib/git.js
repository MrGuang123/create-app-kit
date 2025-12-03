const { execSync } = require("child_process");

/**
 * 初始化 Git 仓库
 * @param {string} targetDir - 目标目录
 * @returns {Promise<boolean>}
 */
const initGit = async (targetDir) => {
  try {
    // 初始化 git 仓库，并设置默认分支为 master
    execSync("git init -b master", {
      cwd: targetDir,
      stdio: "ignore",
    });
    return true;
  } catch {
    // 如果 git 版本不支持 -b 参数，使用传统方式
    try {
      execSync("git init", {
        cwd: targetDir,
        stdio: "ignore",
      });
      // 重命名默认分支为 master
      execSync("git branch -m master", {
        cwd: targetDir,
        stdio: "ignore",
      });
      return true;
    } catch {
      return false;
    }
  }
};

module.exports = {
  initGit,
};
