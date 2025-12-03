const pc = require("picocolors");
const figlet = require("figlet");
const gradient = require("gradient-string");
const pkg = require("../../package.json");

/**
 * 显示漂亮的欢迎界面
 */
const showWelcome = () => {
  console.clear();
  const title = figlet.textSync("Create App Kit", {
    font: "Standard",
    horizontalLayout: "default",
  });
  console.log(gradient.pastel.multiline(title));
  console.log();
  console.log(
    pc.dim(
      `  v${pkg.version} - 快速创建 React + TypeScript 前端项目\n`
    )
  );
};

/**
 * 格式化模板列表输出
 * @param {Array} templates - 模板数组
 * @returns {string}
 */
const formatTemplateList = (templates) =>
  templates
    .map(
      (item) =>
        `  ${pc.cyan(item.name.padEnd(14))} ${pc.dim(
          item.description
        )}`
    )
    .join("\n");

/**
 * 显示完成提示（带庆祝动画）
 * @param {Object} options
 */
const showSuccess = async ({
  template,
  relativePath,
  linterChoice,
  packageManager,
  installDeps,
}) => {
  // 渐变色分隔线
  const divider = "━".repeat(50);
  console.log(gradient.rainbow(divider));
  console.log();

  // 彩虹动画标题
  console.log(gradient.rainbow("  ✨ 项目创建成功！ ✨"));
  console.log();

  // 项目信息（带样式）
  const infoBox = `
  ┌─────────────────────────────────────────────┐
  │  ${pc.dim("模板:")} ${pc.cyan(
    template.title.padEnd(33)
  )}│
  │  ${pc.dim("路径:")} ${pc.cyan(relativePath.padEnd(33))}│
  │  ${pc.dim("规范:")} ${pc.cyan(
    (linterChoice === "biome"
      ? "Biome"
      : "ESLint + Prettier"
    ).padEnd(33)
  )}│
  └─────────────────────────────────────────────┘`;
  console.log(pc.white(infoBox));
  console.log();

  // 下一步指引
  console.log(gradient.cristal("  📝 下一步："));
  console.log();

  const commands = [];
  if (relativePath !== ".") {
    commands.push(`cd ${relativePath}`);
  }
  if (!installDeps) {
    commands.push(`${packageManager} install`);
  }
  commands.push(
    `${packageManager}${
      packageManager === "npm" ? " run" : ""
    } dev`
  );

  commands.forEach((cmd, i) => {
    const prefix =
      i === commands.length - 1 ? "  └─▶" : "  ├─▶";
    console.log(
      pc.dim(prefix) + " " + pc.bold(pc.cyan(cmd))
    );
  });

  console.log();
  console.log(
    gradient.pastel("  ✨ Happy coding! 祝你编码愉快！ 🚀")
  );
  console.log();
};

module.exports = {
  showWelcome,
  formatTemplateList,
  showSuccess,
};
