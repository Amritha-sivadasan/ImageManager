import { Navigate, Outlet } from "react-router-dom";
const ProtectedRoute = () => {

  const userAuth= localStorage.getItem("userAuth");
  
  return userAuth ? <Outlet/> : <Navigate to="/" replace />;

}

export default ProtectedRoute
