import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { FiEye, FiEyeOff, FiCheckCircle, FiAlertCircle, FiLock } from 'react-icons/fi';
import useAuthStore from '../store/authStore';

const Login = ({ isRegister = false }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('credentials');
  const [userId, setUserId] = useState(null);
  const [randomImage] = useState(`https://picsum.photos/800/1200?random=${Math.floor(Math.random() * 1000)}`);

  useEffect(() => {
    setError('');
    setSuccess('');
    setFormData({ username: '', password: '' });
    setStep('credentials');
    setOtp('');
    setUserId(null);
  }, [isRegister]);

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await api.post('/auth/verify-otp', {
        userId: userId,
        otp: otp
      });

      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid or expired code.");
    }
  };

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
      if (isRegister) {
        const res = await api.post('/auth/register', formData);

        if (res.data.mfaRequired) {
          setUserId(res.data.userId);
          setStep('otp');
          setSuccess("Account created! Please verify your email.");
        }
      } else {
        const res = await api.post('/auth/login', formData);
        login(res.data.token, res.data.user);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to connect");
    }
  };

  return (
    <div className="login-container">
      <div className='login-image-section'>
        <img src={randomImage} alt="Background" />
        <div className="login-overlay-text">
          <h1>My Drive</h1>
          <p>Secure cloud storage for your memories.</p>
        </div>
      </div>

      <div className="login-form-section">
        <div className="auth-box">
          <h2>{step === 'otp' ? 'Verify Email' : (isRegister ? 'Create Account' : 'Login Page')}</h2>

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

          {step === 'credentials' ? (
            <form className="auth-form" onSubmit={handleSubmit}>
              <input
                type="email" placeholder="Email" required
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
                style={{ width: '100%', boxSizing: 'border-box', padding: '10px' }}
              />

              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password" required
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  style={{ width: '100%', boxSizing: 'border-box', padding: '10px' }}
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
                style={{ marginTop: '15px' }}
              >
                {isRegister ? 'Sign Up' : 'Login'}
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleOtpSubmit}>
              <p style={{ textAlign: 'center', fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                Enter the 6-digit code sent to<br />
                <strong>{formData.username}</strong>
              </p>

              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="123456"
                  maxLength="6"
                  required
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  style={{
                    width: '100%', boxSizing: 'border-box', padding: '10px',
                    textAlign: 'center', letterSpacing: '5px', fontSize: '18px'
                  }}
                />
                <span style={{
                  position: 'absolute', right: '10px', top: '50%',
                  transform: 'translateY(-50%)', color: '#777', display: 'flex'
                }}>
                  <FiLock size={20} />
                </span>
              </div>

              <button
                className="primary" type="submit"
                style={{ marginTop: '15px' }}
              >
                Verify & Create Account
              </button>

              <button
                type="button"
                className="secondary"
                onClick={() => { setStep('credentials'); setOtp(''); setError(''); }}
                style={{ marginTop: '10px', background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Back
              </button>
            </form>
          )}

          {step === 'credentials' && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;