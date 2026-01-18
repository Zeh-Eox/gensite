import Home from "../pages/Home";
import Projects from "../pages/Projects";
import NotFound from "../pages/NotFound";
import Community from "../pages/Community";
import Preview from "../pages/Preview";
import Pricing from "../pages/Pricing";
import MyProjects from "../pages/MyProjects";
import View from "../pages/View";

import type { RouteItem } from "../types/routes";

const ROUTES: RouteItem[] = [
  {
    title: "Home",
    route: "/",
    component: Home,
    isProtectedRoute: false
  },
  {
    title: "Projects",
    route: "/projects/:projectId",
    component: Projects,
    isProtectedRoute: false
  },
  {
    title: "My Projects",
    route: "/projects",
    component: MyProjects,
    isProtectedRoute: false
  },
  {
    title: "Community",
    route: "/community",
    component: Community,
    isProtectedRoute: false
  },
  {
    title: "Preview",
    route: "/preview/:projectId",
    component: Preview,
    isProtectedRoute: false
  },
  {
    title: "Preview",
    route: "/preview/:projectId/:versionId",
    component: Preview,
    isProtectedRoute: false
  },
  {
    title: "View",
    route: "/view/:projectId",
    component: View,
    isProtectedRoute: false
  },
  {
    title: "Pricing",
    route: "/pricing",
    component: Pricing,
    isProtectedRoute: false
  },
  {
    title: "Not Found",
    route: "*",
    component: NotFound,
    isProtectedRoute: false
  }
]

export default ROUTES;