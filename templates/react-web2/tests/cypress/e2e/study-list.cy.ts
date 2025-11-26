describe("StudyList 页面", () => {
  beforeEach(() => {
    cy.visit("/list"); // 访问首页
  });

  it("应该显示 fixture 中的所有课程", () => {
    // 直接验证应用中的真实数据
    const expectedCourses = [
      "Modern JS Patterns",
      "System Design Primer",
      "TypeScript Deep Dive",
      "UI/UX Essentials",
    ];

    expectedCourses.forEach((title) => {
      cy.contains(title).should("be.visible");
    });
  });

  it("应该显示课程列表", () => {
    // 检查课程卡片是否存在
    cy.contains("Modern JS Patterns").should("be.visible");
    cy.contains("System Design Primer").should(
      "be.visible"
    );
  });

  it("点击进度按钮应该增加进度", () => {
    // 找到第一个 +5% 按钮
    cy.getByTestId("progress-button").first().click();

    // 验证进度变化（假设原来是 72%）
    cy.contains("77%").should("be.visible");
  });

  it("应该能导航到其他页面", () => {
    // 点击导航链接
    cy.contains("新功能").click();

    // 验证 URL 变化
    cy.url().should("include", "/newFeature");
  });
});
