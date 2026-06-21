import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth.store';
import LoginPage from './pages/LoginPage';
import WorkspacesPage from './pages/WorkspacesPage';
import BoardPage from './pages/BoardPage';
import ProtectedRoute from './components/ProtectedRoute';
import AppShell from './components/AppShell';

function App() {
  const initialize = useAuthStore(s => s.initialize);

  useEffect(() => {
    initialize();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route index element={<Navigate to="/workspaces" replace />} />
            <Route path="/workspaces" element={<WorkspacesPage />} />
            <Route path="/w/:workspaceId/b/:boardId" element={<BoardPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
