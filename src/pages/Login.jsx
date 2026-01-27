import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { FiEye, FiEyeOff, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import useAuthStore from '../store/authStore';
import ForgotPassword from '../components/ForgotPassword';

const Login = ({ isRegister = false }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState(null);

  const [step, setStep] = useState('credentials');
  
  const [randomImage] = useState(`https://picsum.photos/800/1200?random=${Math.floor(Math.random() * 1000)}`);

  useEffect(() => {
    setError('');
    setSuccess('');
    setFormData({ username: '', password: '' });
    setStep('credentials');
    setOtp('');
    setUserId(null);
  }, [isRegister]);

  const handleRegisterOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/verify-otp', { userId, otp });
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid code.");
    }
  };

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (isRegister) {
        const res = await api.post('/auth/register', formData);
        if (res.data.mfaRequired) {
          setUserId(res.data.userId);
          setStep('otp');
          setSuccess("Account created! Verify your email.");
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

          {step === 'forgot' ? (
             <ForgotPassword 
                onBack={() => setStep('credentials')}
                onComplete={(msg) => {
                    setStep('credentials');
                    setSuccess(msg);
                }}
             />
          ) : (
            <>
                <h2>{step === 'otp' ? 'Verify Email' : (isRegister ? 'Create Account' : 'Login Page')}</h2>

                {success && (
                    <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '10px', borderRadius: '5px', marginBottom: '15px', display: 'flex', gap: '8px'}}>
                        <FiCheckCircle size={18} /> {success}
                    </div>
                )}
                {error && (
                    <div style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '10px', borderRadius: '5px', marginBottom: '15px', display: 'flex', gap: '8px'}}>
                        <FiAlertCircle size={18} /> {error}
                    </div>
                )}

                {step === 'credentials' ? (
                    <form className="auth-form" onSubmit={handleCredentialsSubmit}>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="email" placeholder="Email" required
                                value={formData.username}
                                onChange={e => setFormData({ ...formData, username: e.target.value })}
                                style={{ width: '100%', padding: '10px' }}
                            />
                        </div>

                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password" required
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                style={{ width: '100%', padding: '10px' }}
                            />
                            <span onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#777', display: 'flex'}}>
                                {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
                            </span>
                        </div>

                        {!isRegister && (
                            <div style={{ textAlign: 'right', marginTop: '5px' }}>
                                <span onClick={() => setStep('forgot')} style={{ fontSize: '13px', color: '#007bff', cursor: 'pointer' }}>
                                    Forgot Password?
                                </span>
                            </div>
                        )}

                        <button className="primary" type="submit" style={{ marginTop: '15px' }}>
                            {isRegister ? 'Sign Up' : 'Login'}
                        </button>
                    </form>
                ) : (
                    <form className="auth-form" onSubmit={handleRegisterOtpSubmit}>
                        <p style={{ textAlign: 'center', color: '#666', fontSize: '14px' }}>
                            Enter the code sent to <strong>{formData.username}</strong>
                        </p>
                        <input
                            type="text" placeholder="123456" maxLength="6" required
                            value={otp}
                            onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                            style={{ width: '100%', textAlign: 'center', letterSpacing: '5px', padding: '10px' }}
                        />
                        <button className="primary" type="submit" style={{ marginTop: '15px' }}>Verify Account</button>
                        <button type="button" className="secondary" onClick={() => setStep('credentials')} style={{ marginTop: '10px' }}>Back</button>
                    </form>
                )}

                {step === 'credentials' && (
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <span style={{ fontSize: '14px', color: '#666' }}>
                            {isRegister ? 'Already have an account?' : 'No account?'}
                        </span>{' '}
                        <Link to={isRegister ? "/login" : "/register"} style={{ fontSize: '14px', color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>
                            {isRegister ? "Login" : "Register here"}
                        </Link>
                    </div>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;