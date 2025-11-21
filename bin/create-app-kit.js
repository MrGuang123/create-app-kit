#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');
const prompts = require('prompts');
const { Command } = require('commander');
const pkg = require('../package.json');

const templatesDir = path.resolve(__dirname, '..', 'templates');

const readTemplates = () => {
  if (!fs.existsSync(templatesDir)) return [];
  return fs
    .readdirSync(templatesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => {
      const templatePath = path.join(templatesDir, dirent.name);
      const metaPath = path.join(templatePath, 'template.json');
      const meta = fs.existsSync(metaPath)
        ? JSON.parse(fs.readFileSync(metaPath, 'utf8'))
        : {};
      return {
        name: dirent.name,
        title: meta.title || dirent.name,
        description: meta.description || '',
        path: templatePath,
      };
    });
};

const ensureTargetDir = async (targetDir, force) => {
  if (!fs.existsSync(targetDir)) return;

  const items = await fse.readdir(targetDir);
  if (!items.length) return;

  if (force) {
    await fse.emptyDir(targetDir);
    return;
  }

  const response = await prompts({
    type: 'confirm',
    name: 'overwrite',
    message: `目录 ${targetDir} 非空，是否清空后继续？`,
    initial: false,
  });

  if (!response.overwrite) {
    throw new Error('用户取消创建。');
  }

  await fse.emptyDir(targetDir);
};

const updatePackageJson = async (targetDir, projectName) => {
  const pkgPath = path.join(targetDir, 'package.json');
  if (!fs.existsSync(pkgPath)) return;

  const contents = await fse.readFile(pkgPath, 'utf8');
  const json = JSON.parse(contents);
  json.name = projectName;
  json.version = json.version || '0.1.0';
  await fse.writeFile(pkgPath, JSON.stringify(json, null, 2));
};

const copyTemplate = async (template, targetDir, projectName) => {
  await fse.copy(template.path, targetDir, {
    dereference: true,
    filter: (src) => !src.endsWith('template.json'),
  });
  await updatePackageJson(targetDir, projectName);
};

const formatTemplateList = (templates) =>
  templates
    .map((item) => `- ${item.name.padEnd(12)} ${item.description}`)
    .join('\n');

const main = async () => {
  const templates = readTemplates();
  const program = new Command();

  program
    .name('create-app-kit')
    .description('快速创建 React + TypeScript 前端模板项目')
    .version(pkg.version)
    .argument('[project-name]', '项目目录名', 'my-app')
    .option('-t, --template <template>', '指定模板名称')
    .option('--list', '列出可用模板')
    .option('-f, --force', '清空已存在的目录后继续')
    .allowUnknownOption(false);

  program.parse(process.argv);
  const options = program.opts();
  const projectName = program.args[0] || 'my-app';

  if (options.list) {
    if (!templates.length) {
      console.log('当前还没有可用模板，请先添加到 templates 目录。');
      return;
    }

    console.log('可用模板列表：');
    console.log(formatTemplateList(templates));
    return;
  }

  if (!templates.length) {
    console.error('未找到模板，请在 templates 目录下添加模板后再试。');
    process.exit(1);
  }

  let chosenTemplate = options.template;
  if (!chosenTemplate) {
    if (templates.length === 1) {
      chosenTemplate = templates[0].name;
    } else {
      const response = await prompts({
        type: 'select',
        name: 'template',
        message: '选择要使用的模板',
        choices: templates.map((tpl) => ({
          title: `${tpl.title} (${tpl.name})`,
          description: tpl.description,
          value: tpl.name,
        })),
      });

      if (!response.template) {
        throw new Error('未选择模板，已取消。');
      }

      chosenTemplate = response.template;
    }
  }

  const template = templates.find((item) => item.name === chosenTemplate);
  if (!template) {
    console.error(`模板 ${chosenTemplate} 不存在。可用模板：\n${formatTemplateList(templates)}`);
    process.exit(1);
  }

  const targetDir = path.resolve(process.cwd(), projectName);

  try {
    await ensureTargetDir(targetDir, options.force);
    await copyTemplate(template, targetDir, projectName);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error(err);
    }
    process.exit(1);
  }

  const relativePath = path.relative(process.cwd(), targetDir) || '.';

  console.log(`\n✅ 已生成模板: ${template.title} -> ${relativePath}`);
  console.log('\n下一步：');
  console.log(`  cd ${relativePath}`);
  console.log('  npm install');
  console.log('  npm run dev');
};

main().catch((err) => {
  if (err instanceof Error) {
    console.error(err.message);
  } else {
    console.error(err);
  }
  process.exit(1);
});
