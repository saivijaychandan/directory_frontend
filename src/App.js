import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FolderView from './pages/FolderView';
import './App.css'
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login isRegister={true} />} />
          <Route path="/" element={ <Dashboard /> } />
          <Route path="/folder/:folderId" element={ <FolderView /> } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;