import styles from './subscriptions.module.css';
import SubscriptionCheckoutForm from "../../../components/stripe/SubscriptionCheckoutForm";
import { useAuth } from '../../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import type { DecodedAccessToken } from '../../../interfaces/interfaces';


const Subscriptions = () => {

  const { accessToken } = useAuth()

  if (!accessToken) {
    return
  }

  const user = jwtDecode<DecodedAccessToken>(accessToken);

  if (user.accountType === 'landlord') {
    return (
      <div className={styles.container}>
        <h2>Landlord Subscription</h2>
        <p className={styles.description}>Unlock all features for your rental management. <strong>$150/month</strong></p>
        <SubscriptionCheckoutForm />
      </div>
    )
  } else if (user.accountType === 'tenant') {
    return (
      <div className={styles.container}>
        <h2>Tenant Subscriptions</h2>
        <h3>Essential</h3>
        <p className={styles.description}>Unlock all features for your rental management. <strong>$50/month</strong></p>
        <SubscriptionCheckoutForm />
        <h3>Balanced</h3>
        <p className={styles.description}>Unlock all features for your rental management. <strong>$120/month</strong></p>
        <SubscriptionCheckoutForm />
        <h3>Platinum</h3>
        <p className={styles.description}>Unlock all features for your rental management. <strong>$200/month</strong></p>
        <SubscriptionCheckoutForm />
      </div>
    )
  } else if (user.accountType === 'tradesmen') {
    return (
      <div className={styles.container}>
        <h2>Tradesmen Subscriptions</h2>
        <p className={styles.description}>Unlock all features for your rental management. <strong>$50/month</strong></p>
        <SubscriptionCheckoutForm />
      </div>
    )
  }
}

export default Subscriptions