import { Navigate } from "react-router-dom";
import RootLayout from "@/layouts/rootLayout";
import StudyList from "@/pages/studyList";
import NewFeature from "@/pages/newFeature";
import SocketTest from "@/pages/socketTest";

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
    ],
  },
];
