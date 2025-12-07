import { MockType } from "@/types/request";
import { coursesMock } from "./courses";
import { graphqlMock } from "./graphql";

// 汇总所有 mock
const mockHandlers: MockType[] = [
  ...coursesMock,
  ...graphqlMock,
];

// 匹配并执行 mock
export async function matchMock(
  method: string,
  pathname: string,
  body?: unknown
): Promise<{ matched: boolean; data?: unknown }> {
  for (const mock of mockHandlers) {
    if (mock.method !== method) continue;

    const matches = pathname.match(mock.path);
    if (matches) {
      // 模拟网络延迟
      await new Promise((r) =>
        setTimeout(r, mock.delay ?? 200)
      );

      try {
        const data = mock.handler(matches, body);
        return { matched: true, data };
      } catch (error) {
        throw error;
      }
    }
  }

  return { matched: false };
}
