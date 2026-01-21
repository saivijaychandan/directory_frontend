import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FolderView from './pages/FolderView';
import './App.css'
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login isRegister={true} />} />
          <Route path="/" element={ <ProtectedRoute><Dashboard /></ProtectedRoute> } />
          <Route path="/folder/:folderId" element={ <ProtectedRoute><FolderView /></ProtectedRoute> } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;