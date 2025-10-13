import SaveCardForm from "../../../components/stripe/SaveCardForm";
// import SubscriptionCheckoutForm from "../../../components/stripe/SubscriptionCheckoutForm";
import styles from './bankSettings.module.css';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../../context/AuthContext";
import type { DecodedAccessToken } from "../../../interfaces/interfaces";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK_KEY);

const BankSettings = () => {

  const { accessToken } = useAuth();

  if(!accessToken) return;
  
  const decoded = jwtDecode<DecodedAccessToken>(accessToken);
  
  return (
    <div className={styles.container}>
      {/* <h2>Landlord Subscription</h2>
      <p>Unlock all features for your rental management. <strong>$150/month</strong></p>
        <SubscriptionCheckoutForm /> */}
      <Elements stripe={stripePromise}>
        <SaveCardForm userID={decoded.userID} accountType={decoded.accountType}accessToken={accessToken} />
      </Elements>
    </div>
  );
};

export default BankSettings;
