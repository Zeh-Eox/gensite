import React from "react";

export interface RouteItem {
  title: string,
  route: string,
  component: React.ComponentType,
  isProtectedRoute: boolean
}