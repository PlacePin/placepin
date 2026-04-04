import styles from './subscriptions.module.css';
import SubscriptionCheckoutForm from "../../../components/stripe/SubscriptionCheckoutForm";

const Subscriptions = () => {
  return (
    <div className={styles.container}>
<<<<<<< HEAD
    <h2>Landlord Subscription</h2>
      <p className={styles.description}>Unlock all features for your rental management. <strong>$150/month</strong></p>
        <SubscriptionCheckoutForm />
=======
      <h2>Landlord Subscription</h2>
      <p>Unlock all features for your rental management. <strong>$150/month</strong></p>
      <SubscriptionCheckoutForm />
>>>>>>> b4ee49a (added the legal links to the subscription page)
    </div>
  )
}

export default Subscriptions