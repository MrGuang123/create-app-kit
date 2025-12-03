const fs = require("fs");
const fse = require("fs-extra");
const prompts = require("prompts");
const pc = require("picocolors");
const {
  detectPackageManagers,
  guessPreferredPM,
} = require("./pm");

/**
 * 取消操作的处理函数
 */
const onCancel = () => {
  console.log(pc.red("\n✖ 已取消创建"));
  process.exit(0);
};

/**
 * 确保目标目录可用
 * @param {string} targetDir - 目标目录
 * @param {boolean} force - 是否强制覆盖
 */
const ensureTargetDir = async (targetDir, force) => {
  if (!fs.existsSync(targetDir)) return;

  const items = await fse.readdir(targetDir);
  if (!items.length) return;

  if (force) {
    await fse.emptyDir(targetDir);
    return;
  }

  const response = await prompts(
    {
      type: "confirm",
      name: "overwrite",
      message: `目录 ${pc.yellow(
        targetDir
      )} 非空，是否清空后继续？`,
      initial: false,
    },
    { onCancel }
  );

  if (!response.overwrite) {
    throw new Error("用户取消创建。");
  }

  await fse.emptyDir(targetDir);
};

/**
 * 运行交互式提问
 * @param {Array} templates - 模板列表
 * @param {Object} options - 命令行选项
 * @param {string} defaultProjectName - 默认项目名称
 * @returns {Promise<Object>}
 */
const runPrompts = async (
  templates,
  options,
  defaultProjectName
) => {
  const availablePMs = detectPackageManagers();
  const preferredPM = guessPreferredPM(availablePMs);

  const questions = [];

  // 1. 项目名称（如果命令行没传或是默认值）
  if (!options.projectName) {
    questions.push({
      type: "text",
      name: "projectName",
      message: "项目名称：",
      initial: defaultProjectName,
      validate: (value) =>
        value.trim() ? true : "项目名称不能为空",
    });
  }

  // 2. 模板选择（如果命令行没指定且有多个模板）
  if (!options.template && templates.length > 1) {
    questions.push({
      type: "select",
      name: "template",
      message: "选择模板：",
      choices: templates.map((tpl) => ({
        title: `${tpl.title} ${pc.dim(`(${tpl.name})`)}`,
        description: tpl.description,
        value: tpl.name,
      })),
    });
  }

  // 3. 包管理器选择
  questions.push({
    type: "select",
    name: "packageManager",
    message: "选择包管理器：",
    choices: availablePMs.map((pm) => ({
      title:
        pm === preferredPM
          ? `${pm} ${pc.dim("(推荐)")}`
          : pm,
      value: pm,
    })),
    initial: availablePMs.indexOf(preferredPM),
  });

  return prompts(questions, { onCancel });
};

/**
 * 询问 Linter 选择
 * @param {Object} linterConfig - linter 配置
 * @returns {Promise<string>}
 */
const askLinter = async (linterConfig) => {
  const response = await prompts(
    {
      type: "select",
      name: "linter",
      message: linterConfig.prompt,
      choices: linterConfig.choices.map((choice) => ({
        title: choice.title,
        value: choice.value,
      })),
      initial: linterConfig.choices.findIndex(
        (c) => c.value === linterConfig.default
      ),
    },
    { onCancel }
  );

  return response.linter;
};

/**
 * 询问可选功能
 * @param {Object} optionalConfig - 可选功能配置
 * @returns {Promise<string[]>} 选中的功能列表
 */
const askOptionalFeatures = async (optionalConfig) => {
  const response = await prompts(
    {
      type: "multiselect",
      name: "features",
      message: optionalConfig.prompt,
      choices: optionalConfig.choices.map((choice) => ({
        title: choice.title,
        value: choice.value,
        description: choice.description,
        selected: choice.selected ?? false, // 支持从配置读取默认选中状态
      })),
      hint: "- 空格切换选择，回车确认",
      instructions: false,
    },
    { onCancel }
  );

  return response.features || [];
};

/**
 * 询问最终选项（Git 初始化和依赖安装）
 * @returns {Promise<{initGit: boolean, installDeps: boolean}>}
 */
const askFinalOptions = async () => {
  const response = await prompts(
    [
      {
        type: "confirm",
        name: "initGit",
        message: "是否初始化 Git 仓库？",
        initial: true,
      },
      {
        type: "confirm",
        name: "installDeps",
        message: "是否立即安装依赖？",
        initial: true,
      },
    ],
    { onCancel }
  );

  return response;
};

module.exports = {
  ensureTargetDir,
  runPrompts,
  askLinter,
  askOptionalFeatures,
  askFinalOptions,
  onCancel,
};
