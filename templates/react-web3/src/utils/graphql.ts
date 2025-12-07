import { GraphQLClient, gql } from "graphql-request";
import { matchGraphQLMock } from "@/mocks/graphql";

// 从环境配置获取 mock 开关和 GraphQL 端点
let isMockEnabled = __APP_ENV__.enableMock;
const graphqlEndpoint =
  __APP_ENV__.graphqlPath || "/graphql";

// 创建 GraphQL 客户端实例
const graphqlClient = new GraphQLClient(graphqlEndpoint, {
  headers: (): Record<string, string> => {
    const headers: Record<string, string> = {};
    const token = localStorage.getItem("token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  },
});

/**
 * 执行 GraphQL 请求（支持 Mock）
 * @param document GraphQL 查询文档
 * @param variables 查询变量
 * @returns 查询结果
 */
export async function graphqlRequest<T>(
  document: string,
  variables?: Record<string, unknown>
): Promise<T> {
  if (isMockEnabled) {
    const result = await matchGraphQLMock(
      document,
      variables
    );
    if (result.matched) {
      console.log("[GraphQL Mock]", {
        document,
        variables,
      });
      console.log("[GraphQL Mock Result]", result.data);
      return result.data as T;
    }
  }

  return graphqlClient.request<T>(document, variables);
}

// 导出 gql 标签供外部使用
export { gql };

// 导出原始客户端（用于特殊场景）
export { graphqlClient };

// Mock 控制（与 REST 共享状态）
export const graphqlMockControl = {
  enable: () => {
    isMockEnabled = true;
  },
  disable: () => {
    isMockEnabled = false;
  },
  toggle: () => {
    isMockEnabled = !isMockEnabled;
  },
  isEnabled: () => isMockEnabled,
};

// 挂载到 window 方便调试
if (typeof window !== "undefined") {
  (window as any).__GRAPHQL_MOCK__ = graphqlMockControl;
}
