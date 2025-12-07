// 封装重复操作为可复用命令

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * 根据 data-testid 选择元素
       */
      getByTestId(
        testId: string
      ): Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.add("getByTestId", (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`);
});

export {};
