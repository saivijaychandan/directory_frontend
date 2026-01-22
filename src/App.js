import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css'
import FolderView from './pages/FolderView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Login isRegister={true} />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/folder/:idOrName" 
          element={
            <ProtectedRoute>
              <FolderView />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;