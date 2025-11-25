import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routeConfigs } from './config';

const router = createBrowserRouter(routeConfigs);

const AppRoutes = () => <RouterProvider router={router} />;

export default AppRoutes;
