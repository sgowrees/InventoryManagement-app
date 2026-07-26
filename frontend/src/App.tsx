import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/login";
import Register from "./pages/register";
import Forgot from "./pages/forgot";
import ResetPassword from "./pages/resetPassword";
import Dashboard from "./pages/dashboard";
import Setting from "./pages/Settings/setting";
import Report from "./pages/report";
import "./css/app.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot" element={<Forgot />} />
      <Route path="/resetpassword/:resetToken" element={<ResetPassword />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/report" element={<Report />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
