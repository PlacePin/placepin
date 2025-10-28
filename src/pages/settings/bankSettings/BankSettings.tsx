import SaveCardForm from "../../../components/stripe/SaveCardForm";
import styles from './bankSettings.module.css';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK_KEY);

const BankSettings = () => {
  
  return (
    <div className={styles.container}>
      <Elements stripe={stripePromise}>
        <SaveCardForm />
      </Elements>
    </div>
  );
};

export default BankSettings;
