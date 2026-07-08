import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import axiosInstance from '../../../utils/axiosInstance';
import styles from './support.module.css';

type MessageType = 'support' | 'suggestion';

const Support = () => {
  const { accessToken } = useAuth();
  const [type, setType] = useState<MessageType>('support');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  if (!accessToken) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      await axiosInstance.post(
        '/api/settings/support',
        { type, subject, message },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      setStatus('success');
      setSubject('');
      setMessage('');
      setType('support');
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(
        err?.response?.data?.error ||
        'Something went wrong. Please try again.',
      );
    }
  };

  const handleNewMessage = () => {
    setStatus('idle');
    setErrorMsg('');
  };

  if (status === 'success') {
    return (
      <div className={styles.container}>
        <div className={styles.successState}>
          <div className={styles.successIcon}>✓</div>
          <h2 className={styles.heading}>Message Sent</h2>
          <p className={styles.subtext}>
            We've received your message and will get back to you as soon as possible.
          </p>
          <button className={styles.btnPrimary} onClick={handleNewMessage}>
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Support & Suggestions</h2>
      <p className={styles.subtext}>
        Have a question or a great idea? Send us a message and we'll get back to you.
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.typeToggle}>
          <button
            type="button"
            className={[styles.typeBtn, type === 'support' ? styles.typeBtnActive : ''].join(' ')}
            onClick={() => setType('support')}
          >
            Support Request
          </button>
          <button
            type="button"
            className={[styles.typeBtn, type === 'suggestion' ? styles.typeBtnActive : ''].join(' ')}
            onClick={() => setType('suggestion')}
          >
            Suggestion
          </button>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="support-subject">Subject</label>
          <input
            id="support-subject"
            className={styles.input}
            type="text"
            placeholder={type === 'support' ? 'What do you need help with?' : 'What would you like to suggest?'}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            maxLength={120}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="support-message">Message</label>
          <textarea
            id="support-message"
            className={styles.textarea}
            placeholder="Provide as much detail as possible…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={7}
            maxLength={2000}
          />
          <span className={styles.charCount}>{message.length} / 2000</span>
        </div>

        {status === 'error' && (
          <p className={styles.errorText}>{errorMsg}</p>
        )}

        <button
          type="submit"
          className={styles.btnPrimary}
          disabled={status === 'loading' || !subject.trim() || !message.trim()}
        >
          {status === 'loading' ? 'Sending…' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

export default Support;
