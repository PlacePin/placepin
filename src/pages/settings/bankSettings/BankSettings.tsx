import SubscriptionCheckoutForm from "../../../components/stripe/SubscriptionCheckoutForm";
import styles from './bankSettings.module.css';
// import { Elements } from '@stripe/react-stripe-js';

const BankSettings = () => {
  return (
    <div className={styles.container}>
      <h2>Landlord Subscription</h2>
      <p>Unlock all features for your rental management. <strong>$150/month</strong></p>
        <SubscriptionCheckoutForm />
    </div>
  );
};

export default BankSettings;
