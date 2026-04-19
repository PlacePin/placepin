import { useEffect, useState } from 'react';
import styles from './subscriptions.module.css';
import SubscriptionCheckoutForm from "../../../components/stripe/SubscriptionCheckoutForm";
import { useAuth } from '../../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import type { DecodedAccessToken } from '../../../interfaces/interfaces';
import axiosInstance from '../../../utils/axiosInstance';

const tenantPlans = [
  {
    id: 'essential',
    name: 'Essential',
    price: 50,
    description: 'Simple, everyday convenience for a smoother home life.',
    features: ['Laundry service', 'Light housekeeping', 'Exclusive resident discounts'],
    featured: false,
  },
  {
    id: 'balanced',
    name: 'Balanced',
    price: 120,
    description: 'More support, less hassle. Everything in Essential, plus extra.',
    features: ['Everything in Essential', 'More frequent service visits', 'Bigger savings & perks'],
    featured: true,
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: 200,
    description: 'Full-service living with concierge and priority access.',
    features: ['Everything in Balanced', 'Concierge support', 'Premium & priority access'],
    featured: false,
  },
];

const planRank: Record<string, number> = {
  Essential: 1,
  Balanced: 2,
  Platinum: 3,
};

interface Subscription {
  isSubscribed: boolean;
  tier: string | null;
  cancelAtPeriodEnd: boolean;
}

const Subscriptions = () => {
  const { accessToken } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  if (!accessToken) return null;

  const user = jwtDecode<DecodedAccessToken>(accessToken);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const { data } = await axiosInstance.get('/api/settings/stripe/subscription-status', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setSubscription(data);
      } catch (err) {
        console.error('Failed to fetch subscription', err);
      } finally {
        setIsFetching(false);
      }
    };

    fetchSubscription();
  }, [accessToken]);

  const handleCancel = async () => {
    try {
      setIsCancelling(true);
      await axiosInstance.post(
        '/api/settings/stripe/cancel-subscription',
        undefined,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setSubscription(prev => prev ? { ...prev, cancelAtPeriodEnd: true } : prev);
    } catch (err) {
      console.error('Failed to cancel subscription', err);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleUpdateSubscription = async (planId: string) => {
    try {
      await axiosInstance.post(
        '/api/settings/stripe/update-subscription',
        { subscriptionPlan: planId },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setSubscription(prev => prev ? {
        ...prev,
        tier: planId.charAt(0).toUpperCase() + planId.slice(1)
      } : prev);
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  if (user.accountType === 'landlord') {
    if (isFetching) return <p>Loading subscription...</p>;

    return (
      <div className={styles.container}>
        <h2 className={styles.heading}>Landlord Subscription</h2>
        <p className={styles.simpleDescription}>
          Unlock all features for your rental management.{' '}
          <strong className={styles.highlight}>$150/month</strong>
        </p>
        {subscription?.isSubscribed ? (
          <div className={styles.subscribedState}>
            <span className={styles.currentBadge}>Active subscription</span>
            {subscription.cancelAtPeriodEnd ? (
              <button className={styles.btnDisabled} disabled>
                Cancels at period end
              </button>
            ) : (
              <button
                className={styles.btnCancel}
                onClick={() => setShowCancelModal(true)}
                disabled={isCancelling}
              >
                {isCancelling ? 'Cancelling...' : 'Cancel membership'}
              </button>
            )}
          </div>
        ) : (
          <SubscriptionCheckoutForm />
        )}
        {showCancelModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h3>Cancel your subscription?</h3>
              <p>
                You'll keep access until the end of your billing period. After that your account will be downgraded.
              </p>
              <div className={styles.modalButtons}>
                <button
                  className={styles.btnDowngrade}
                  onClick={() => setShowCancelModal(false)}
                >
                  Keep subscription
                </button>
                <button
                  className={styles.btnCancel}
                  onClick={() => { handleCancel(); setShowCancelModal(false); }}
                >
                  Yes, cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (user.accountType === 'tradesmen') {
    if (isFetching) return <p>Loading subscription...</p>;

    return (
      <div className={styles.container}>
        <h2 className={styles.heading}>Tradesmen Subscription</h2>
        <p className={styles.simpleDescription}>
          Unlock all features for your trade business.{' '}
          <strong className={styles.highlight}>$25/month</strong>
        </p>
        {subscription?.isSubscribed ? (
          <div className={styles.subscribedState}>
            <span className={styles.currentBadge}>Active subscription</span>
            {subscription.cancelAtPeriodEnd ? (
              <button className={styles.btnDisabled} disabled>
                Cancels at period end
              </button>
            ) : (
              <button
                className={styles.btnCancel}
                onClick={() => setShowCancelModal(true)}
                disabled={isCancelling}
              >
                {isCancelling ? 'Cancelling...' : 'Cancel membership'}
              </button>
            )}
          </div>
        ) : (
          <SubscriptionCheckoutForm />
        )}
        {showCancelModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h3>Cancel your subscription?</h3>
              <p>
                You'll keep access until the end of your billing period. After that your account will be downgraded.
              </p>
              <div className={styles.modalButtons}>
                <button
                  className={styles.btnDowngrade}
                  onClick={() => setShowCancelModal(false)}
                >
                  Keep subscription
                </button>
                <button
                  className={styles.btnCancel}
                  onClick={() => { handleCancel(); setShowCancelModal(false); }}
                >
                  Yes, cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (user.accountType === 'tenant') {
    if (isFetching) {
      return <p>Loading subscription...</p>;
    }

    return (
      <div className={styles.container}>
        <h2 className={styles.heading}>Tenant Subscriptions</h2>
        <p className={styles.globalNote}>No contracts. Cancel anytime.</p>
        <div className={styles.grid}>
          {tenantPlans.map((plan) => {
            const isCurrent = subscription?.isSubscribed && plan.name === subscription?.tier;
            const isHigher = subscription?.isSubscribed && planRank[plan.name] > planRank[subscription?.tier ?? ''];
            const isLower = subscription?.isSubscribed && planRank[plan.name] < planRank[subscription?.tier ?? ''];

            return (
              <div
                key={plan.id}
                className={[
                  styles.card,
                  isCurrent ? styles.current : '',
                  selectedPlan === plan.id ? styles.selected : '',
                ].filter(Boolean).join(' ')}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {isCurrent && <div className={styles.cardAccent} />}
                <div className={styles.badges}>
                  {plan.featured && <span className={styles.badge}>Most popular</span>}
                  {isCurrent && <span className={styles.currentBadge}>Your plan</span>}
                </div>
                <p className={styles.planName}>{plan.name}</p>
                <div className={styles.priceRow}>
                  <span className={styles.amount}>${plan.price}</span>
                  <span className={styles.per}>/month</span>
                </div>
                <p className={styles.description}>{plan.description}</p>
                <div className={styles.divider} />
                <ul className={styles.features}>
                  {plan.features.map((feature) => (
                    <li key={feature} className={styles.featureItem}>
                      <span className={styles.check} aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {isCurrent ? (
                  <>
                    {subscription?.cancelAtPeriodEnd ? (
                      <button className={styles.btnDisabled} disabled>
                        Cancels at period end
                      </button>
                    ) : (
                      <button
                        className={styles.btnCancel}
                        onClick={(e) => { e.stopPropagation(); handleCancel(); }}
                        disabled={isCancelling}
                      >
                        {isCancelling ? 'Cancelling...' : 'Cancel membership'}
                      </button>
                    )}
                  </>
                ) : isHigher ? (
                  <button
                    className={styles.btnUpgrade}
                    onClick={(e) => { e.stopPropagation(); setPendingPlan(plan.id); }}
                  >
                    Upgrade
                  </button>
                ) : isLower ? (
                  <button
                    className={styles.btnDowngrade}
                    onClick={(e) => { e.stopPropagation(); setPendingPlan(plan.id); }}
                  >
                    Downgrade
                  </button>
                ) : (
                  <div className={styles.formWrapper}>
                    <SubscriptionCheckoutForm
                      subscriptionPlan={plan.id}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
        {pendingPlan && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h3>Change your plan?</h3>
              <p>
                You'll be switched to the <strong>{pendingPlan.charAt(0).toUpperCase() + pendingPlan.slice(1)}</strong> plan.
                Your billing will be prorated automatically.
              </p>
              <div
                className={styles.modalButtons}
              >
                <button
                  className={styles.btnCancel}
                  onClick={() => setPendingPlan(null)}
                >
                  Cancel
                </button>
                <button
                  className={styles.btnUpgrade}
                  onClick={() => { handleUpdateSubscription(pendingPlan); setPendingPlan(null); }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default Subscriptions;