#!/usr/bin/env node

const path = require("path");
const pc = require("picocolors");
const ora = require("ora");
const { Command } = require("commander");
const pkg = require("../package.json");

// 导入拆分的模块
const {
  showWelcome,
  formatTemplateList,
  showSuccess,
} = require("./lib/ui");
const { installDependencies } = require("./lib/pm");
const {
  readTemplates,
  copyTemplate,
} = require("./lib/template");
const { applyLinterConfig } = require("./lib/linter");
const { applyCommonConfigs } = require("./lib/common");
const { initGit } = require("./lib/git");
const {
  ensureTargetDir,
  runPrompts,
  askLinter,
} = require("./lib/prompts");

/**
 * 主函数
 */
const main = async () => {
  const templates = readTemplates();
  const program = new Command();

  program
    .name("create-app-kit")
    .description("快速创建 React + TypeScript 前端模板项目")
    .version(pkg.version)
    .argument("[project-name]", "项目目录名", "my-app")
    .option("-t, --template <template>", "指定模板名称")
    .option("--list", "列出可用模板")
    .option("-f, --force", "清空已存在的目录后继续")
    .option("-y, --yes", "跳过交互，使用默认选项")
    .allowUnknownOption(false);

  program.parse(process.argv);
  const options = program.opts();
  const argProjectName = program.args[0];

  // 显示欢迎界面
  showWelcome();

  // 列出模板
  if (options.list) {
    if (!templates.length) {
      console.log(
        pc.yellow(
          "当前还没有可用模板，请先添加到 templates 目录。"
        )
      );
      return;
    }

    console.log(pc.bold("📦 可用模板列表：\n"));
    console.log(formatTemplateList(templates));
    console.log();
    return;
  }

  // 检查模板
  if (!templates.length) {
    console.error(
      pc.red(
        "❌ 未找到模板，请在 templates 目录下添加模板后再试。"
      )
    );
    process.exit(1);
  }

  // 运行交互式提问
  const answers = await runPrompts(
    templates,
    {
      template: options.template,
      projectName: argProjectName,
    },
    argProjectName || "my-app"
  );

  const projectName =
    answers.projectName || argProjectName || "my-app";
  const templateName =
    options.template ||
    answers.template ||
    templates[0].name;
  const template = templates.find(
    (item) => item.name === templateName
  );

  if (!template) {
    console.error(
      pc.red(`❌ 模板 ${templateName} 不存在。可用模板：\n`)
    );
    console.log(formatTemplateList(templates));
    process.exit(1);
  }

  // 如果模板有 linter 选项，询问用户
  let linterChoice = "biome"; // 默认
  if (template.features?.linter) {
    linterChoice = await askLinter(
      template.features.linter
    );
  }

  const targetDir = path.resolve(
    process.cwd(),
    projectName
  );
  const relativePath =
    path.relative(process.cwd(), targetDir) || ".";

  console.log();

  // 步骤 1: 确保目标目录
  try {
    await ensureTargetDir(targetDir, options.force);
  } catch (err) {
    console.error(pc.red(err.message));
    process.exit(1);
  }

  // 步骤 2: 复制模板
  const copySpinner = ora("正在复制模板文件...").start();
  try {
    await copyTemplate(template, targetDir, projectName);
    copySpinner.succeed("模板文件复制完成");
  } catch (err) {
    copySpinner.fail("模板文件复制失败");
    console.error(pc.red(err.message));
    process.exit(1);
  }

  // 步骤 3: 应用公共配置 (.github, .husky, .gitignore 等)
  const commonSpinner = ora("正在应用公共配置...").start();
  try {
    await applyCommonConfigs(targetDir);
    commonSpinner.succeed("公共配置应用完成");
  } catch (err) {
    commonSpinner.fail("公共配置应用失败");
    console.error(pc.red(err.message));
  }

  // 步骤 4: 应用 Linter 配置
  const linterSpinner = ora(
    `正在配置 ${linterChoice}...`
  ).start();
  try {
    await applyLinterConfig(targetDir, linterChoice);
    linterSpinner.succeed(
      `${
        linterChoice === "biome"
          ? "Biome"
          : "ESLint + Prettier"
      } 配置完成`
    );
  } catch (err) {
    linterSpinner.fail("Linter 配置失败");
    console.error(pc.red(err.message));
  }

  // 步骤 5: 初始化 Git
  if (answers.initGit) {
    const gitSpinner = ora(
      "正在初始化 Git 仓库..."
    ).start();
    const success = await initGit(targetDir);
    if (success) {
      gitSpinner.succeed("Git 仓库初始化完成");
    } else {
      gitSpinner.warn("Git 初始化跳过（可能未安装 git）");
    }
  }

  // 步骤 6: 安装依赖
  if (answers.installDeps) {
    console.log();
    console.log(
      pc.cyan(
        `📦 正在使用 ${answers.packageManager} 安装依赖...\n`
      )
    );
    const success = await installDependencies(
      targetDir,
      answers.packageManager
    );
    if (success) {
      console.log(pc.green("\n✅ 依赖安装完成"));
    } else {
      console.log(
        pc.yellow("\n⚠️ 依赖安装失败，请手动运行安装命令")
      );
    }
  }

  // 显示完成提示
  showSuccess({
    template,
    relativePath,
    linterChoice,
    packageManager: answers.packageManager,
    installDeps: answers.installDeps,
  });
};

main().catch((err) => {
  console.error(pc.red(err.message || err));
  process.exit(1);
});
