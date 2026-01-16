import React from "react";
import { Route, Routes } from "react-router-dom";
import ROUTES from "./routes";

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route>
          {ROUTES.filter((route) => !route.isProtectedRoute).map(
            (route, index) => (
              <Route
                key={index}
                path={route.route}
                element={<route.component />}
              />
            )
          )}
        </Route>
      </Routes>
    </>
  );
};

export default App;
