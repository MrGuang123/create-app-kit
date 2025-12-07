const common = {
  nav: {
    studyList: "学习列表",
    newFeature: "新功能",
    home: "首页",
  },
  sidebar: {
    title: "学习中心",
    navMenu: "导航菜单",
    copyright: "© 2024 学习中心",
  },
  studyList: {
    loading: "加载中...",
    loadError: "加载失败",
    forceRerender: "强制重渲染",
    openDialog: "打开弹窗",
    dialogContent: "弹窗内容",
    progress: "进度",
    continueLearning: "继续学习 →",
    progressAdd: "进度 +5%",
  },
  theme: {
    light: "浅色模式",
    dark: "深色模式",
    system: "跟随系统",
  },
  language: {
    switch: "切换语言",
    zhCN: "简体中文",
    enUS: "English",
  },
} as const;

export default common;
