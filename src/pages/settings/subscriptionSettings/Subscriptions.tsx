import styles from './subscriptions.module.css';
import SubscriptionCheckoutForm from "../../../components/stripe/SubscriptionCheckoutForm";

const Subscriptions = () => {
  return (
    <div className={styles.container}>
      <h2>Landlord Subscription</h2>
      <p className={styles.description}>Unlock all features for your rental management. <strong>$150/month</strong></p>
      <SubscriptionCheckoutForm />
    </div>
  )
}

export default Subscriptions