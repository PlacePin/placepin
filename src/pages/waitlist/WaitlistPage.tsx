import { useState } from 'react';
import styles from './waitlistPage.module.css';

const RESEND_API_KEY = 're_KTzDS8BS_HyNgaBT7nAmkBUxyCeU6KsUh';
const NOTIFY_EMAIL = 'kerlin@placepin.io';

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [inputError, setInputError] = useState(false);

  const handleSubmit = async () => {
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@')) {
      setInputError(true);
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'PlacePin <onboarding@resend.dev>',
          to: [NOTIFY_EMAIL],
          subject: `New waitlist signup: ${trimmed}`,
          html: `<p><strong>${trimmed}</strong> just joined the PlacePin waitlist.</p>`,
        }),
      });

      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.wordmark}>
        Place<span className={styles.accent}>Pin</span>
      </div>

      <span className={styles.badge}>Launching Monday</span>

      <h1 className={styles.heading}>
        Property management built for the long game
      </h1>

      <p className={styles.sub}>
        PlacePin helps landlords retain great tenants, reduce vacancy, and grow
        profit — without the chaos of traditional property management.
      </p>

      {status === 'success' ? (
        <div className={styles.success}>
          <div className={styles.successIcon}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path
                d="M4 11l5 5 9-9"
                stroke="#0F6E56"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className={styles.successTitle}>You're on the list</h2>
          <p className={styles.successSub}>
            We'll email you the moment PlacePin launches.
          </p>
        </div>
      ) : (
        <>
          <div className={styles.formRow}>
            <input
              type="email"
              className={`${styles.input} ${inputError ? styles.inputError : ''}`}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setInputError(false);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              autoComplete="email"
            />
            <button
              className={styles.btn}
              onClick={handleSubmit}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Joining...' : 'Get early access'}
            </button>
          </div>
          <p className={styles.hint}>No spam. Be the first to know when we go live.</p>
          {status === 'error' && (
            <p className={styles.errorNote}>
              Something went wrong. Check your API key and try again.
            </p>
          )}
        </>
      )}

      <div className={styles.divider} />

      <div className={styles.features}>
        {[
          'Tenant retention tools',
          'Real-time messaging',
          'Financial insights',
          'Work order tracking',
        ].map((f) => (
          <div className={styles.feature} key={f}>
            <div className={styles.featureDot} />
            <p className={styles.featureText}>{f}</p>
          </div>
        ))}
      </div>
    </div>
  );
}