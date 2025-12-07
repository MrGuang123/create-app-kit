import { Navigate } from "react-router-dom";
import RootLayout from "@/layouts/rootLayout";
import StudyList from "@/pages/studyList";
import NewFeature from "@/pages/newFeature";
import SocketTest from "@/pages/socketTest";
import GraphQLDemo from "@/pages/graphqlDemo";
import WorkerDemo from "@/pages/workerDemo";
import WasmDemo from "@/pages/wasmDemo";
import PerfToolsDemo from "@/pages/perfToolsDemo";
import NotFound from "@/pages/notFound";

export const routeConfigs = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/list" replace />,
      },
      { path: "list", element: <StudyList /> },
      { path: "newFeature", element: <NewFeature /> },
      { path: "socketTest", element: <SocketTest /> },
      { path: "graphqlDemo", element: <GraphQLDemo /> },
      { path: "workerDemo", element: <WorkerDemo /> },
      { path: "wasmDemo", element: <WasmDemo /> },
      { path: "perfToolsDemo", element: <PerfToolsDemo /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
