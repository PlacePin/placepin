import { useState, type FormEvent } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './passwordPages.module.css';
import axiosInstance from '../../../utils/axiosInstance';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axiosInstance.post('/api/auth/forgot-password', { email: email.toLowerCase().trim() });
      setSubmitted(true);
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
            <h4>Forgot Password</h4>

            {submitted ? (
              <div className={styles.successBox}>
                <p>If an account with that email exists, a reset link will be sent. Check your inbox.</p>
                <NavLink to='/login' className={styles.backLink}>Back to Login</NavLink>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <label className={styles.inputLabel} htmlFor='email'>Email</label>
                <input
                  className={styles.inputFields}
                  type='email'
                  id='email'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {error && <p className={styles.errorMessage}>{error}</p>}
                <button disabled={loading}>{loading ? 'Sending...' : 'Send Reset Link'}</button>
                <NavLink to='/login' className={styles.backLink}>Back to Login</NavLink>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
