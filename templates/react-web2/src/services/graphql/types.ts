/**
 * GraphQL 用户类型
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "moderator" | "user";
  avatar: string;
  createdAt: string;
}

/**
 * 创建用户输入
 */
export interface CreateUserInput {
  name: string;
  email: string;
  role?: string;
}

/**
 * 更新用户输入
 */
export interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: string;
}

// ============ 查询响应类型 ============

export interface GetUsersResponse {
  users: User[];
}

export interface GetUserResponse {
  user: User | null;
}

export interface CreateUserResponse {
  createUser: User;
}

export interface UpdateUserResponse {
  updateUser: User | null;
}

export interface DeleteUserResponse {
  deleteUser: boolean;
}
