import { Navigate, Route, Routes } from "react-router-dom";
import { AuthPage } from "./pages/AuthPage";
import { BoardPage } from "./pages/BoardPage";
import { useAuthStore } from "./store/authStore";

function ProtectedRoute() {
  const accessToken = useAuthStore((state) => state.session?.accessToken);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <BoardPage />;
}

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route path="/" element={<ProtectedRoute />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
