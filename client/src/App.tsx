import React from "react";
import { Route, Routes } from "react-router-dom";
import ROUTES from "./routes";
import { Toaster } from "react-hot-toast";
import Navigation from "./components/Navigation";

const App: React.FC = () => {
  return (
    <>
      <Toaster position="bottom-right" />

      <Navigation />

      <Routes>
        {ROUTES.filter((route) => !route.isProtectedRoute).map(
          (route, index) => (
            <Route
              key={index}
              path={route.route}
              element={<route.component />}
            />
          )
        )}
      </Routes>
    </>
  );
};

export default App;
