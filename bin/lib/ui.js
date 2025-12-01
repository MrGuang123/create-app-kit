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
 * 显示完成提示
 * @param {Object} options
 */
const showSuccess = ({
  template,
  relativePath,
  linterChoice,
  packageManager,
  installDeps,
}) => {
  console.log();
  console.log(pc.green("━".repeat(50)));
  console.log();
  console.log(pc.bold(pc.green(`🎉 项目创建成功！`)));
  console.log();
  console.log(pc.dim("  模板: ") + pc.cyan(template.title));
  console.log(pc.dim("  路径: ") + pc.cyan(relativePath));
  console.log(
    pc.dim("  规范: ") +
      pc.cyan(
        linterChoice === "biome"
          ? "Biome"
          : "ESLint + Prettier"
      )
  );
  console.log();
  console.log(pc.bold("📝 下一步："));
  console.log();

  if (relativePath !== ".") {
    console.log(pc.white(`  cd ${relativePath}`));
  }
  if (!installDeps) {
    console.log(pc.white(`  ${packageManager} install`));
  }
  console.log(
    pc.white(
      `  ${packageManager}${
        packageManager === "npm" ? " run" : ""
      } dev`
    )
  );
  console.log();
  console.log(pc.dim("  Happy coding! 🚀"));
  console.log();
};

module.exports = {
  showWelcome,
  formatTemplateList,
  showSuccess,
};
