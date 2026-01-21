import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import ROUTES from "@/routes";
import Navigation from "@/components/Navigation";
import { Toaster } from "sonner";

const App: React.FC = () => {
  const { pathname } = useLocation();

  const HIDE_NAVBAR_PATHS = ["/projects/", "/view/", "/preview/"];

  const hideNavbar = HIDE_NAVBAR_PATHS.some(
    (path) => pathname.startsWith(path) && pathname !== "/projects",
  );

  return (
    <>
      <Toaster />

      {!hideNavbar && <Navigation />}

      <Routes>
        {ROUTES.filter((route) => !route.isProtectedRoute).map(
          (route, index) => (
            <Route
              key={index}
              path={route.route}
              element={<route.component />}
            />
          ),
        )}
      </Routes>
    </>
  );
};

export default App;
