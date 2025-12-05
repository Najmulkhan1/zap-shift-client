import React from "react";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";

function RidersRoute({ children }) {
  const { loading } = useAuth();
  const { role, roleLoading } = useRole();

  if (loading || roleLoading) {
    return <h2>Loading......</h2>;
  }

  if (role !== "rider") {
    return <h2>You are forbidden to access this page</h2>;
  }

  return children;
}

export default RidersRoute;
