import "react";

declare module "react" {
  interface FunctionComponent<P = {}> {
    whyDidYouRender?: boolean;
  }
  interface MemoExoticComponent<
    T extends ComponentType<any>
  > {
    whyDidYouRender?: boolean;
  }
  interface ExoticComponent<P = object> {
    whyDidYouRender?: boolean;
  }
  interface ComponentClass<P = object, s = object> {
    whyDidYouRender?: boolean;
  }
}
