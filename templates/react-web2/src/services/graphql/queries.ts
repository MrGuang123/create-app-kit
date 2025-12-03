import { gql } from "@/utils/graphql";

// ============ 用户相关查询 ============

/**
 * 查询所有用户
 */
export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      role
      avatar
      createdAt
    }
  }
`;

/**
 * 查询单个用户
 */
export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      name
      email
      role
      avatar
      createdAt
    }
  }
`;

// ============ 用户相关变更 ============

/**
 * 创建用户
 */
export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
      role
      avatar
      createdAt
    }
  }
`;

/**
 * 更新用户
 */
export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      name
      email
      role
      avatar
      createdAt
    }
  }
`;

/**
 * 删除用户
 */
export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;
