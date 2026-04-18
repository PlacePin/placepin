import { useState } from 'react';
import styles from './subscriptions.module.css';
import SubscriptionCheckoutForm from "../../../components/stripe/SubscriptionCheckoutForm";
import { useAuth } from '../../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import type { DecodedAccessToken } from '../../../interfaces/interfaces';

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

const Subscriptions = () => {
  const { accessToken } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  if (!accessToken) return null;

  const user = jwtDecode<DecodedAccessToken>(accessToken);

  if (user.accountType === 'landlord') {
    return (
      <div className={styles.container}>
        <h2 className={styles.heading}>Landlord Subscription</h2>
        <p className={styles.simpleDescription}>
          Unlock all features for your rental management.{' '}
          <strong className={styles.highlight}>$150/month</strong>
        </p>
        <SubscriptionCheckoutForm />
      </div>
    );
  }

  if (user.accountType === 'tradesmen') {
    return (
      <div className={styles.container}>
        <h2 className={styles.heading}>Tradesmen Subscription</h2>
        <p className={styles.simpleDescription}>
          Unlock all features for your trade business.{' '}
          <strong className={styles.highlight}>$25/month</strong>
        </p>
        <SubscriptionCheckoutForm />
      </div>
    );
  }

  if (user.accountType === 'tenant') {
    return (
      <div className={styles.container}>
        <h2 className={styles.heading}>Tenant Subscriptions</h2>
        <p className={styles.globalNote}>No contracts. Cancel anytime.</p>
        <div className={styles.grid}>
          {tenantPlans.map((plan) => (
            <div
              key={plan.id}
              className={[
                styles.card,
                plan.featured ? styles.featured : '',
                selectedPlan === plan.id ? styles.selected : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <div className={styles.headerRow}>
                <h3 className={styles.planName}>{plan.name}</h3>
                <div className={styles.priceRow}>
                  <span className={styles.amount}>${plan.price}</span>
                  <span className={styles.per}>/month</span>
                </div>
              </div>
              <p className={styles.description}>{plan.description}</p>
              {plan.featured && <span className={styles.badge}>Most popular</span>}
              <ul className={styles.features}>
                {plan.features.map((feature) => (
                  <li key={feature} className={styles.featureItem}>
                    <span className={styles.check} aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className={styles.formWrapper}>
                <SubscriptionCheckoutForm
                  subscriptionPlan={selectedPlan}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default Subscriptions;