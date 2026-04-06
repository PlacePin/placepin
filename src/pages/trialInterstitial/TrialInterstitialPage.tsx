import styles from './trialInterstitialPage.module.css';

interface TrialInterstitialPageProps {
  sessionUrl: string;
}

const TrialInterstitialPage = ({ sessionUrl }: TrialInterstitialPageProps) => {

  const handleContinue = () => {
    window.location.href = sessionUrl;
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.wordmark}>
          Place<span className={styles.accent}>Pin</span>
        </div>

        <span className={styles.badge}>
          <span className={styles.dot} />
          Account created
        </span>

        <h1 className={styles.heading}>Start your 90-day free trial</h1>
        <p className={styles.sub}>
          You're one step away from full access. No charges today — we just need your card on file.
        </p>

        <div className={styles.divider} />

        <p className={styles.sectionLabel}>What's included</p>

        <div className={styles.features}>
          {[
            {
              title: 'Tenant management',
              desc: 'Add, invite, and manage all your tenants in one place',
            },
            {
              title: 'Real-time messaging',
              desc: 'Communicate directly with tenants instantly',
            },
            {
              title: 'Work order tracking',
              desc: 'Log and track maintenance requests with ease',
            },
            {
              title: 'Financial insights',
              desc: 'Track income, receipts, and property performance',
            },
            {
              title: 'Tenant retention tools',
              desc: 'Keep great tenants longer and reduce vacancy',
            },
          ].map((f) => (
            <div className={styles.feature} key={f.title}>
              <div className={styles.check}>
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path
                    d="M2 5.5l2.5 2.5 4.5-4.5"
                    stroke="#0F6E56"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className={styles.featureText}>
                <strong>{f.title}</strong>
                <span>{f.desc}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.notice}>
          <div className={styles.noticeRow}>
            <span className={styles.noticeLabel}>Due today</span>
            <span className={`${styles.noticeValue} ${styles.green}`}>$0.00</span>
          </div>
          <div className={styles.noticeRow}>
            <span className={styles.noticeLabel}>After 90-day trial</span>
            <span className={styles.noticeValue}>$150 / month per property</span>
          </div>
          <div className={styles.noticeRow}>
            <span className={styles.noticeLabel}>Cancel anytime</span>
            <span className={styles.noticeValue}>No commitment</span>
          </div>
        </div>

        <button className={styles.btn} onClick={handleContinue}>
          Set up free trial via Stripe
        </button>

        <p className={styles.legal}>
          Payments are securely processed by Stripe. Your card will not be charged until your trial ends.
        </p>
      </div>
    </div>
  );
};

export default TrialInterstitialPage;