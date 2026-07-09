import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance';
import styles from '../../pages/dashboard/messaging/messaging.module.css';

const SuggestionBoxForm = () => {
  const { accessToken } = useAuth();
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  if (!accessToken) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || message.trim().length < 10) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      await axiosInstance.post(
        '/api/messages/suggestions',
        { message },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      setStatus('success');
      setMessage('');
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Something went wrong. Please try again.',
      );
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setErrorMsg('');
  };

  if (status === 'success') {
    return (
      <div className={styles.suggestionFormPanel}>
        <div className={styles.suggestionSuccessState}>
          <div className={styles.suggestionSuccessIcon}>✓</div>
          <h3 className={styles.suggestionHeading}>Suggestion Sent</h3>
          <p className={styles.suggestionSubtext}>
            Your anonymous suggestion has been delivered to your landlord.
          </p>
          <button className={styles.suggestionBtnPrimary} onClick={handleReset}>
            Send Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.suggestionFormPanel}>
      <h3 className={styles.suggestionHeading}>Suggestion Box</h3>
      <p className={styles.suggestionSubtext}>
        Send an anonymous suggestion to your landlord. Your identity will not be shared.
      </p>

      <form className={styles.suggestionForm} onSubmit={handleSubmit}>
        <textarea
          className={styles.suggestionTextarea}
          placeholder="Share your suggestion, feedback, or concern…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={8}
          maxLength={2000}
        />
        <span className={styles.suggestionCharCount}>{message.length} / 2000</span>

        {status === 'error' && (
          <p className={styles.suggestionError}>{errorMsg}</p>
        )}

        <button
          type="submit"
          className={styles.suggestionBtnPrimary}
          disabled={status === 'loading' || message.trim().length < 10}
        >
          {status === 'loading' ? 'Sending…' : 'Send Anonymously'}
        </button>
      </form>
    </div>
  );
};

export default SuggestionBoxForm;
