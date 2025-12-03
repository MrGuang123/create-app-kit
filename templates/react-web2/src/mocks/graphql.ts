import { MockType } from "@/types/request";

// GraphQL Mock 用户数据
const mockUsers = [
  {
    id: "1",
    name: "张三",
    email: "zhangsan@example.com",
    role: "admin",
    avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    createdAt: "2024-01-15T08:00:00Z",
  },
  {
    id: "2",
    name: "李四",
    email: "lisi@example.com",
    role: "user",
    avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    createdAt: "2024-02-20T10:30:00Z",
  },
  {
    id: "3",
    name: "王五",
    email: "wangwu@example.com",
    role: "user",
    avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
    createdAt: "2024-03-10T14:45:00Z",
  },
  {
    id: "4",
    name: "赵六",
    email: "zhaoliu@example.com",
    role: "moderator",
    avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
    createdAt: "2024-04-05T09:15:00Z",
  },
];

// GraphQL 操作名称到处理函数的映射
type GraphQLHandler = (
  variables?: Record<string, unknown>
) => unknown;

const graphqlHandlers: Record<string, GraphQLHandler> = {
  // 查询所有用户
  GetUsers: () => ({
    users: mockUsers,
  }),

  // 查询单个用户
  GetUser: (variables) => {
    const user = mockUsers.find(
      (u) => u.id === variables?.id
    );
    return { user: user || null };
  },

  // 创建用户
  CreateUser: (variables) => {
    const input = variables?.input as {
      name: string;
      email: string;
      role?: string;
    };
    const newUser = {
      id: String(mockUsers.length + 1),
      name: input.name,
      email: input.email,
      role: input.role || "user",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${
        mockUsers.length + 1
      }`,
      createdAt: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    return { createUser: newUser };
  },

  // 更新用户
  UpdateUser: (variables) => {
    const { id, input } = variables as {
      id: string;
      input: Partial<(typeof mockUsers)[0]>;
    };
    const index = mockUsers.findIndex((u) => u.id === id);
    if (index !== -1) {
      mockUsers[index] = { ...mockUsers[index], ...input };
      return { updateUser: mockUsers[index] };
    }
    return { updateUser: null };
  },

  // 删除用户
  DeleteUser: (variables) => {
    const { id } = variables as { id: string };
    const index = mockUsers.findIndex((u) => u.id === id);
    if (index !== -1) {
      mockUsers.splice(index, 1);
      return { deleteUser: true };
    }
    return { deleteUser: false };
  },
};

/**
 * 从 GraphQL 文档中提取操作名称
 */
function extractOperationName(
  document: string
): string | null {
  // 匹配 query/mutation OperationName 或 query/mutation OperationName(
  const match = document.match(
    /(?:query|mutation)\s+(\w+)/
  );
  return match ? match[1] : null;
}

/**
 * 匹配 GraphQL Mock
 */
export async function matchGraphQLMock(
  document: string,
  variables?: Record<string, unknown>
): Promise<{ matched: boolean; data?: unknown }> {
  const operationName = extractOperationName(document);

  if (operationName && graphqlHandlers[operationName]) {
    // 模拟网络延迟
    await new Promise((r) => setTimeout(r, 200));

    const data = graphqlHandlers[operationName](variables);
    return { matched: true, data };
  }

  return { matched: false };
}

// 为了与 REST mock 系统兼容，导出一个空的 mock 数组
// 实际的 GraphQL mock 通过 matchGraphQLMock 函数处理
export const graphqlMock: MockType[] = [];
