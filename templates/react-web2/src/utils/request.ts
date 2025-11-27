import ky, { type Options } from "ky";
import { matchMock } from "@/mocks";
import { HttpMethod } from "@/types/request";

// 手动控制是否开启mock
let isMockEnabled = true;
const baseUrl = "/api";

// 创建 ky 实例
const kyInstance = ky.create({
  prefixUrl: baseUrl,
  timeout: 15000,
  retry: 0,
  hooks: {
    // 请求前后拦截器可以自定义
    beforeRequest: [
      (request) => {
        const token = localStorage.getItem("token");
        if (token) {
          request.headers.set(
            "Authorization",
            `Bearer ${token}`
          );
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
      },
    ],
  },
});

function executeRequest<T>(
  method: HttpMethod,
  url: string,
  options?: Options
): Promise<T> {
  switch (method) {
    case "get":
      return kyInstance.get(url, options).json<T>();
    case "post":
      return kyInstance.post(url, options).json<T>();
    case "put":
      return kyInstance.put(url, options).json<T>();
    case "delete":
      return kyInstance.delete(url, options).json<T>();
    case "patch":
      return kyInstance.patch(url, options).json<T>();
    case "head":
      return kyInstance.head(url, options).json<T>();
    default:
      throw new Error(`Unsupported method: ${method}`);
  }
}
// 封装请求方法，支持 mock
async function requestWithMock<T>(
  method: HttpMethod,
  url: string,
  options?: Options
): Promise<T> {
  if (isMockEnabled) {
    const pathname = `/${baseUrl}/${url}`.replace(
      /\/+/g,
      "/"
    );
    const body = options?.json;

    const result = await matchMock(
      method.toUpperCase(),
      pathname,
      body
    );

    if (result.matched) {
      console.log(
        `[Mock] ${method.toUpperCase()} ${pathname}`,
        result.data
      );
      return result.data as T;
    }
  }

  return executeRequest<T>(method, url, options);
}

// 导出 API
export const request = {
  get: <T>(url: string, options?: Options) =>
    requestWithMock<T>("get", url, options),

  post: <T>(
    url: string,
    data?: unknown,
    options?: Options
  ) =>
    requestWithMock<T>("post", url, {
      ...options,
      json: data,
    }),

  put: <T>(
    url: string,
    data?: unknown,
    options?: Options
  ) =>
    requestWithMock<T>("put", url, {
      ...options,
      json: data,
    }),

  delete: <T>(url: string, options?: Options) =>
    requestWithMock<T>("delete", url, options),

  patch: <T>(
    url: string,
    data?: unknown,
    options?: Options
  ) =>
    requestWithMock<T>("patch", url, {
      ...options,
      json: data,
    }),

  options: <T>(url: string, options?: Options) =>
    requestWithMock<T>("options", url, options),

  head: <T>(url: string, options?: Options) =>
    requestWithMock<T>("head", url, options),
};

// 暴露控制方法（可在控制台调用）
export const mockControl = {
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
  (window as any).__MOCK__ = mockControl;
}
