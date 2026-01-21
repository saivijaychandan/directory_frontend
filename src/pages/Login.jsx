import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { FiEye, FiEyeOff, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const Login = ({ isRegister = false }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setError('');
    setSuccess('');
    setFormData({ username: '', password: '' });
  }, [isRegister]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.username)) {
        setError("Please enter a valid email address.");
        return;
    }

    if (isRegister) {
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }
        if (!/[A-Z]/.test(formData.password)) {
            setError("Password must contain at least one uppercase letter (A-Z).");
            return;
        }
        if (!/[a-z]/.test(formData.password)) {
            setError("Password must contain at least one lowercase letter (a-z).");
            return;
        }
        if (!/\d/.test(formData.password)) {
             setError("Password must contain at least one number.");
             return;
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
            setError("Password must contain at least one special character.");
            return;
        }
    }

    try {
      const endpoint = isRegister ? '/register' : '/login';
      const res = await api.post(endpoint, formData);
      
      if (isRegister) {
        setSuccess("Success! Account created. Loggin in...");
        setFormData({ username: '', password: '' });
        setTimeout(() => {
            navigate('/');
        }, 2000);
      } else {
        login(res.data.token, formData.username);
        navigate('/');
      }
    } catch (err) { 
      setError(err.response?.data?.msg || "Failed to connect");
    }
  };

  return (
    <div className="auth-box">
      <h2>{isRegister ? 'Create Account' : 'Login Page'}</h2>
      
      {success && (
        <div style={{
            backgroundColor: '#d4edda', color: '#155724', padding: '10px', 
            borderRadius: '5px', marginBottom: '15px', fontSize: '14px',
            display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #c3e6cb'
        }}>
            <FiCheckCircle size={18} />
            {success}
        </div>
      )}

      {error && (
        <div style={{
            backgroundColor: '#f8d7da', color: '#721c24', padding: '10px', 
            borderRadius: '5px', marginBottom: '15px', fontSize: '14px',
            display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #f5c6cb'
        }}>
            <FiAlertCircle size={18} />
            {error}
        </div>
      )}

      <form className="auth-form" onSubmit={handleSubmit}>
        <input 
          type="email" placeholder="Email" required
          value={formData.username}
          onChange={e => setFormData({...formData, username: e.target.value})}
          style={{width: "94.5%"}}
          disabled={!!success} 
        />
        
        <div style={{ position: 'relative' }}> 
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Password" required
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
            style={{ width: '100%', boxSizing: 'border-box' }}
            disabled={!!success}
          />
          <span 
            onClick={() => setShowPassword(!showPassword)}
            style={{ 
              position: 'absolute', right: '10px', top: '50%', 
              transform: 'translateY(-50%)', cursor: 'pointer',
              color: '#777', display: 'flex'
            }}
          >
            {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
          </span>
        </div>

        <button 
            className="primary" type="submit" 
            style={{marginTop: '15px', opacity: success ? 0.5 : 1}}
            disabled={!!success}
        >
          {isRegister ? 'Sign Up' : 'Login'}
        </button>
      </form>
      
      <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
        <span style={{ fontSize: '14px', color: '#666' }}>
            {isRegister ? 'Already have an account?' : 'No account?'}
        </span>
        <Link 
            to={isRegister ? "/login" : "/register"} 
            style={{ fontSize: '14px', color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}
        >
          {isRegister ? "Login" : "Register here"}
        </Link>
      </div>
    </div>
  );
};

export default Login;