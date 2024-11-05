import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useRouteError } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function Customroutes() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Login />} errorElement={<ErrorBoundary />} />
        <Route
          path="/dashboard"
          element={
            <Privateroute>
              <Dashboard />
            </Privateroute>
          }
          errorElement={<ErrorBoundary />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default Customroutes;

function ErrorBoundary() {
  let error = useRouteError();
  console.error(error);
  // Uncaught ReferenceError: path is not defined
  return <div>Dang!</div>;
}

function Privateroute({ children }) {
  const username = localStorage.getItem("username") || "";

  if (username) {
    return children;
  }

  return <Navigate to="/" replace={true} />;
}
