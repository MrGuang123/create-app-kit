import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { routeConfigs } from "./config";

// 使用环境配置中的 baseName
const router = createBrowserRouter(routeConfigs, {
  basename: __APP_ENV__.baseName,
});

const AppRoutes = () => <RouterProvider router={router} />;

export default AppRoutes;
