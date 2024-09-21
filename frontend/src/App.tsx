import { Routes, Route, Outlet } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SingUpPage";
import OtpPage from "./components/OtpPage";
import Dashboard from "./components/DashBoard";
import HomePage from "./components/HomePage";
import ProtectedRoute from "./routes/ProtectedRoute";
import Layout from "./components/common/Layout";
import { Toaster } from "react-hot-toast";
import { UserContextProvider } from "./context/context";

function App() {
  return (
    <>
    <Toaster/>
    <UserContextProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/otp-page" element={<OtpPage />} />

        <Route
          element={
            <Layout>
              <Outlet />
            </Layout>
          }
        >
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route path="/" element={<HomePage />} />
        </Route>
      </Routes>
      </UserContextProvider>
    </>
  );
}

export default App;
