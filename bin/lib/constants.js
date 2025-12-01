const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..", "..");
const TEMPLATES_DIR = path.join(ROOT_DIR, "templates");
const LINTER_CONFIGS_DIR = path.join(
  ROOT_DIR,
  "configs",
  "linter"
);

const PACKAGE_MANAGERS = [
  { name: "npm", lockfile: "package-lock.json" },
  { name: "yarn", lockfile: "yarn.lock" },
  { name: "pnpm", lockfile: "pnpm-lock.yaml" },
  { name: "bun", lockfile: "bun.lockb" },
];

const PM_PRIORITY = ["pnpm", "yarn", "bun", "npm"];

const INSTALL_COMMANDS = {
  npm: "npm install",
  yarn: "yarn",
  pnpm: "pnpm install",
  bun: "bun install",
};

module.exports = {
  ROOT_DIR,
  TEMPLATES_DIR,
  LINTER_CONFIGS_DIR,
  PACKAGE_MANAGERS,
  PM_PRIORITY,
  INSTALL_COMMANDS,
};
