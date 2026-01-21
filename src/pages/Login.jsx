import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

import Icon from 'react-icons-kit'; 

import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye';
import { useAuth } from '../context/AuthContext';

const Login = ({ isRegister = false }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [type, setType] = useState('password');
  const [icon, setIcon] = useState(eyeOff);

  const handleToggle = () => {
    if (type === 'password') {
      setIcon(eye);
      setType('text');
    } else {
      setIcon(eyeOff);
      setType('password');
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isRegister ? '/register' : '/login';
      const res = await api.post(endpoint, formData);
      
      if (isRegister) {
        alert("Success! Now login.");
        navigate('/login');
      } else {
        login(res.data.token, formData.username);
        navigate('/');
      }
    } catch (err) { alert("Error: " + (err.response?.data?.msg || "Failed")); }
  };

  return (
    <div className="auth-box">
      <h2>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input 
          type="text" placeholder="Username" required
          value={formData.username}
          onChange={e => setFormData({...formData, username: e.target.value})}
        />
        <div style={{ position: 'relative' }}>
          <input 
            type={type} 
            placeholder="Password" required
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
            style={{ width: '100%', boxSizing: 'border-box' }}
          />
          <span 
            onClick={handleToggle}
            style={{ 
              position: 'absolute', 
              right: '10px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              cursor: 'pointer',
              color: '#777'
            }}
          >
            <Icon className="absolute mr-10" icon={icon} size={20}/>
          </span>
        </div>
        <button className="primary" type="submit">
          {isRegister ? 'Sign Up' : 'Login'}
        </button>
      </form>
      <p style={{ marginTop: '20px' }}>
        <a href={isRegister ? "/login" : "/register"}>
          {isRegister ? "Already have an account? Login" : "No account? Register here"}
        </a>
      </p>
    </div>
  );
};

export default Login;