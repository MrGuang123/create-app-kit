import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { graphqlRequest } from "@/utils/graphql";
import {
  GET_USERS,
  GET_USER,
  CREATE_USER,
  UPDATE_USER,
  DELETE_USER,
} from "./queries";
import type {
  User,
  CreateUserInput,
  UpdateUserInput,
  GetUsersResponse,
  GetUserResponse,
  CreateUserResponse,
  UpdateUserResponse,
  DeleteUserResponse,
} from "./types";

/**
 * 获取所有用户
 */
export function useUsers() {
  return useQuery({
    queryKey: ["graphql", "users"],
    queryFn: () =>
      graphqlRequest<GetUsersResponse>(GET_USERS),
    select: (data) => data.users,
  });
}

/**
 * 获取单个用户
 */
export function useUser(id: string) {
  return useQuery({
    queryKey: ["graphql", "users", id],
    queryFn: () =>
      graphqlRequest<GetUserResponse>(GET_USER, { id }),
    select: (data) => data.user,
    enabled: !!id,
  });
}

/**
 * 创建用户
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateUserInput) =>
      graphqlRequest<CreateUserResponse>(CREATE_USER, {
        input,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["graphql", "users"],
      });
    },
  });
}

/**
 * 更新用户
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: UpdateUserInput;
    }) =>
      graphqlRequest<UpdateUserResponse>(UPDATE_USER, {
        id,
        input,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["graphql", "users"],
      });
      queryClient.invalidateQueries({
        queryKey: ["graphql", "users", variables.id],
      });
    },
  });
}

/**
 * 删除用户
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      graphqlRequest<DeleteUserResponse>(DELETE_USER, {
        id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["graphql", "users"],
      });
    },
  });
}

// 导出类型供外部使用
export type { User, CreateUserInput, UpdateUserInput };
