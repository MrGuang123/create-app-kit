import { useState } from "react";
import { toast } from "sonner";
import {
  useUsers,
  useCreateUser,
  useDeleteUser,
  type User,
} from "@/services/graphql/useUsers";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Skeleton } from "@/shadcn/ui/skeleton";
import {
  GitBranch,
  Plus,
  Trash2,
  RefreshCw,
  User as UserIcon,
} from "lucide-react";

const GraphQLDemo = () => {
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");

  const {
    data: users,
    isLoading,
    refetch,
    isFetching,
  } = useUsers();
  const createUser = useCreateUser();
  const deleteUser = useDeleteUser();

  const handleCreateUser = async () => {
    if (!newUserName.trim() || !newUserEmail.trim()) {
      toast.error("请填写用户名和邮箱");
      return;
    }

    try {
      await createUser.mutateAsync({
        name: newUserName,
        email: newUserEmail,
      });
      toast.success("用户创建成功");
      setNewUserName("");
      setNewUserEmail("");
    } catch {
      toast.error("创建失败");
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser.mutateAsync(id);
      toast.success("用户删除成功");
    } catch {
      toast.error("删除失败");
    }
  };

  const getRoleBadgeColor = (role: User["role"]) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "moderator":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    }
  };

  return (
    <div className="space-y-8">
      {/* 标题区域 */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-pink-500 to-purple-600">
          <GitBranch className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">
            GraphQL 演示
          </h1>
          <p className="text-sm text-muted-foreground">
            使用 graphql-request + TanStack Query 的集成示例
          </p>
        </div>
      </div>

      {/* 技术说明 */}
      <div className="rounded-lg border bg-card p-4">
        <h3 className="mb-2 font-semibold">💡 技术栈</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>
            •{" "}
            <code className="text-primary">
              graphql-request
            </code>{" "}
            - 轻量级 GraphQL 客户端
          </li>
          <li>
            •{" "}
            <code className="text-primary">
              @tanstack/react-query
            </code>{" "}
            - 统一的数据缓存和状态管理
          </li>
          <li>
            • 与 REST API 使用相同的缓存策略和 DevTools
          </li>
          <li>• 内置 Mock 支持，开发时无需后端服务</li>
        </ul>
      </div>

      {/* 创建用户表单 */}
      <div className="rounded-lg border bg-card p-4">
        <h3 className="mb-4 font-semibold flex items-center gap-2">
          <Plus className="h-4 w-4" />
          创建新用户 (Mutation)
        </h3>
        <div className="flex gap-3">
          <Input
            placeholder="用户名"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="邮箱"
            type="email"
            value={newUserEmail}
            onChange={(e) =>
              setNewUserEmail(e.target.value)
            }
            className="flex-1"
          />
          <Button
            onClick={handleCreateUser}
            disabled={createUser.isPending}
          >
            {createUser.isPending ? "创建中..." : "创建"}
          </Button>
        </div>
      </div>

      {/* 用户列表 */}
      <div className="rounded-lg border bg-card p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            用户列表 (Query)
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={`mr-1 h-4 w-4 ${
                isFetching ? "animate-spin" : ""
              }`}
            />
            刷新
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-lg border p-4"
              >
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            ))}
          </div>
        ) : users && users.length > 0 ? (
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-12 w-12 rounded-full bg-muted"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {user.name}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${getRoleBadgeColor(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {user.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    创建于:{" "}
                    {new Date(
                      user.createdAt
                    ).toLocaleDateString("zh-CN")}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDeleteUser(user.id)}
                  disabled={deleteUser.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            暂无用户数据
          </div>
        )}
      </div>

      {/* 代码示例 */}
      <div className="rounded-lg border bg-card p-4">
        <h3 className="mb-4 font-semibold">📝 代码示例</h3>
        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
          <code>{`// 1. 定义 GraphQL 查询
const GET_USERS = gql\`
  query GetUsers {
    users { id name email role }
  }
\`;

// 2. 创建 Hook（与 TanStack Query 集成）
export function useUsers() {
  return useQuery({
    queryKey: ['graphql', 'users'],
    queryFn: () => graphqlRequest(GET_USERS),
    select: (data) => data.users,
  });
}

// 3. 在组件中使用
const { data: users, isLoading } = useUsers();`}</code>
        </pre>
      </div>
    </div>
  );
};

export default GraphQLDemo;
