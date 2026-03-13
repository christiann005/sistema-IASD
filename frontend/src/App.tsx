import { Navigate, Route, Routes } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { GroupsPage } from './pages/GroupsPage';
import { Login } from './pages/Login';
import { StudiesPage } from './pages/StudiesPage';
import { VisitsPage } from './pages/VisitsPage';
import { getToken } from './lib/auth';

function App() {
  const token = getToken();

  return (
    <Routes>
      <Route
        path="/login"
        element={token ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/"
        element={token ? <Dashboard /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/groups"
        element={token ? <GroupsPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/studies"
        element={token ? <StudiesPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/visits"
        element={token ? <VisitsPage /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default App;
