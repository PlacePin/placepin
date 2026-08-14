import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance';
import styles from './contactPage.module.css';

const ContactPage = () => {

  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatus(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill out every field.');
      return;
    }

    if (!email.includes('@')) {
      setError('Enter a valid email.');
      return;
    }

    setIsPending(true);

    try {
      const { data } = await axiosInstance.post('/api/contact', {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });

      setStatus(data.message);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Could not send your message. Try again later.');
      } else {
        setError('something went wrong.');
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <button onClick={handleBack} className={styles.back}>
            ← Back
          </button>
          <p className={styles.eyebrow}>PlacePin · Contact</p>
          <h1 className={styles.title}>Get in Touch</h1>
          <p className={styles.subtitle}>
            Have a general question? Send us a message and our team will respond as soon as possible.
          </p>
        </div>
      </div>

      <div className={styles.content}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              placeholder="How can we help?"
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className={`${styles.submitButton} ${isPending ? styles.pending : ''}`}
            disabled={isPending}
            aria-busy={isPending}
          >
            {isPending ? 'Sending...' : 'Send Message'}
          </button>

          <div role="alert" aria-label="Status message" className={styles.statusMessage}>
            {status && <p className={styles.success}>{status}</p>}
            {error && <p className={styles.error}>{error}</p>}
          </div>x
        </form>

        <div className={styles.contactBlock}>
          <p className={styles.contactLine}>
            <strong>Email:</strong> support@placepin.io
          </p>
          <p className={styles.contactLine}>
            <strong>Address:</strong> 1452 Dorchester Ave 4th fl, Dorchester, MA 02122
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
