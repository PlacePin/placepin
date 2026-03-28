import { useState, type FormEvent } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './passwordPages.module.css';

const ResetPasswordPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await axios.post(`/api/auth/reset-password/${token}`, { password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.entireContainer}>
      <div className={styles.animatedBorderWrapper}>
        <div className={styles.animatedBorderContent}>
          <div className={styles.card}>
            <NavLink to='/' className={styles.logo}>PlacePin</NavLink>
            <h4>Reset Password</h4>

            {success ? (
              <div className={styles.successBox}>
                <p>Password reset successfully! Redirecting you to login...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <label className={styles.inputLabel} htmlFor='password'>New Password</label>
                <input
                  className={styles.inputFields}
                  type='password'
                  id='password'
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label className={styles.inputLabel} htmlFor='confirm'>Confirm Password</label>
                <input
                  className={styles.inputFields}
                  type='password'
                  id='confirm'
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
                {error && <p className={styles.errorMessage}>{error}</p>}
                <button disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</button>
                <NavLink to='/login' className={styles.backLink}>Back to Login</NavLink>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
