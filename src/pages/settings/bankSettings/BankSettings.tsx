import SaveCardForm from "../../../components/stripe/SaveCardForm";
import { stripePromise } from "../../../utils/stripePromise";
import styles from './bankSettings.module.css';
import { Elements } from "@stripe/react-stripe-js";

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
