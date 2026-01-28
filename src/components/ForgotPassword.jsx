import { useState } from 'react';
import api from '../api';
import { FiMail, FiLock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = ({ onBack, onComplete }) => {
  // Setting what step it is in (Step 1 is Request for email and Step 2 is Reset view for otp)
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const login = useAuthStore((state) => state.login); 
  const navigate = useNavigate();

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { username: email });
      setStep(2);
      setSuccess("Code sent! Check your email.");
    } catch (err) {
      setError(err.response?.data?.msg || "User not found.");
    } finally {
      setLoading(false);
    }
  };
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/reset-password', {
        username: email,
        otp,
        newPassword
      });

      const loginRes = await api.post('/auth/login', { username: email, password: newPassword });
      
      login(loginRes.data.token, loginRes.data.user);
      navigate('/');
      
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid code or reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-box-content">
      <h2>{step === 1 ? 'Reset Password' : 'New Password'}</h2>

      {success && <div className="success-msg"><FiCheckCircle /> {success}</div>}
      {error && <div className="error-msg"><FiAlertCircle /> {error}</div>}

      {step === 1 ? (
        <form className="auth-form" onSubmit={handleRequestCode}>
          <p style={{ textAlign: 'center', color: '#666', fontSize: '14px' }}>
            Enter your email to receive a reset code.
          </p>
          <div style={{ position: 'relative', display: 'flex' }}>
            <span className="icon-input" style={{ margin: '10px' }}><FiMail /></span>
            <input
              type="email" placeholder="Enter your email" required
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: '10px' }}
            />
            
          </div>
          <button className="primary" type="submit" disabled={loading} style={{ marginTop: '15px' }}>
            {loading ? 'Sending...' : 'Send Code'}
          </button>
        </form>
      ) : (
        <form className="auth-form" onSubmit={handleResetSubmit}>
           <p style={{ textAlign: 'center', color: '#666', fontSize: '14px' }}>
            Code sent to <strong>{email}</strong>
          </p>
          
          <input
            type="text" placeholder="6-Digit Code" maxLength="6" required
            value={otp}
            onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
            style={{ width: '100%', textAlign: 'center', letterSpacing: '5px', marginBottom: '10px', padding: '10px' }}
          />

          <div style={{ position: 'relative', display: 'flex' }}>
            <span className="icon-input" style={{ margin: '10px' }}><FiLock /></span>
            <input
              type="password" placeholder="New Password" required
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              style={{ width: '100%', padding: '10px' }}
            />
            
          </div>

          <button className="primary" type="submit" disabled={loading} style={{ marginTop: '15px' }}>
            {loading ? 'Updating...' : 'Reset & Login'}
          </button>
          
          <button
            type="button" className="secondary"
            onClick={() => { setStep(1); setOtp(''); }}
            style={{ marginTop: '10px' }}
          >
            Resend Code
          </button>
        </form>
      )}

      <button
        type="button" className="secondary"
        onClick={onBack}
        style={{ marginTop: '10px', width: '100%' }}
      >
        Back to Login
      </button>
    </div>
  );
};

export default ForgotPassword;