import { useState, useRef, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../../context/AuthContext';
import type { DecodedAccessToken } from '../../interfaces/interfaces';
import { LANDLORD_ROUTES } from '../../routes/landlordRoutes';
import { TENANT_ROUTES } from '../../routes/tenantRoutes';
import axiosInstance from '../../utils/axiosInstance';
import styles from './failedSubscriptionPage.module.css';

const FailedSubscription = () => {
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Read once on mount before anything clears it
  const stripeContextRef = useRef(localStorage.getItem('stripeContext'));
  const isNewSignup = stripeContextRef.current === 'signup';

  // Clear it after reading so it doesn't persist incorrectly
  useEffect(() => {
    localStorage.removeItem('stripeContext');
  }, []);

  // Early return after all hooks
  if (!accessToken) return null;

  const decoded = jwtDecode<DecodedAccessToken>(accessToken);

  console.log(decoded)

  const handleReturnToStripe = async () => {
    if (!isNewSignup) {
      window.location.href = `/${decoded.accountType}dashboard/generalsettings`;
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await axiosInstance.post(
        '/api/settings/stripe/subscription-checkout-form',
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (res.data.sessionUrl) {
        // Re-set context before redirecting so it survives the next round trip
        localStorage.setItem('stripeContext', stripeContextRef.current || 'settings');
        window.location.href = res.data.sessionUrl;
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleSkip = () => {
    if (decoded.accountType === 'landlord') {
      window.location.href = LANDLORD_ROUTES.DASHBOARD;
    } else if (decoded.accountType === 'tenant') {
      window.location.href = TENANT_ROUTES.DASHBOARD;
    } else {
      window.location.href = '/login';
    }
  };

  // New signup — no escape, must complete trial setup
  if (isNewSignup) {
    return (
      <div className={styles.container}>
        <h1>Your account is ready</h1>
        <p>
          To access PlacePin you'll need to set up your 90-day free trial.
          No charges today — cancel anytime after.
        </p>
        {error && <p className={styles.error}>{error}</p>}
        <button
          className={styles.button}
          onClick={handleReturnToStripe}
          disabled={loading}
        >
          {loading ? 'Redirecting...' : 'Set up my free trial'}
        </button>
      </div>
    );
  }

  // Existing user voluntarily went to checkout — let them leave
  return (
    <div className={styles.container}>
      <h1>No problem</h1>
      <p>
        You haven't been charged. You can set up your subscription anytime
        from your settings.
      </p>
      {error && <p className={styles.error}>{error}</p>}
      <button
        className={styles.button}
        onClick={handleReturnToStripe}
        disabled={loading}
      >
        {loading ? 'Redirecting...' : 'Try again'}
      </button>
      <button
        className={styles.skipButton}
        onClick={handleSkip}
      >
        Go to dashboard
      </button>
    </div>
  );
};

export default FailedSubscription;