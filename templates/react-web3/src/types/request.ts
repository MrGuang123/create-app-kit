export type HttpMethod =
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "options"
  | "head";

export type HttpMethodUppercase = Uppercase<HttpMethod>;

export interface MockType {
  method: HttpMethodUppercase;
  path: RegExp;
  handler: (
    matches: RegExpMatchArray,
    body?: unknown
  ) => unknown;
  delay?: number;
}
