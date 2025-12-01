const { execSync } = require("child_process");

/**
 * 初始化 Git 仓库
 * @param {string} targetDir - 目标目录
 * @returns {Promise<boolean>}
 */
const initGit = async (targetDir) => {
  try {
    execSync("git init", {
      cwd: targetDir,
      stdio: "ignore",
    });
    execSync("git add -A", {
      cwd: targetDir,
      stdio: "ignore",
    });
    execSync(
      'git commit -m "Initial commit from create-app-kit"',
      {
        cwd: targetDir,
        stdio: "ignore",
      }
    );
    return true;
  } catch {
    return false;
  }
};

module.exports = {
  initGit,
};
