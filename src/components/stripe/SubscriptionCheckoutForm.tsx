import { type FormEvent, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Navigate, NavLink } from "react-router-dom";
import styles from './subscriptionCheckoutForm.module.css';
import PrimaryButton from "../buttons/PrimaryButton";
import axiosInstance from "../../utils/axiosInstance";

interface SubscriptionCheckoutFormProps {
  subscriptionPlan?: string | null;
}

const SubscriptionCheckoutForm = ({
  subscriptionPlan
}: SubscriptionCheckoutFormProps) => {
  const [isPending, setIsPending] = useState(false);
  const { accessToken } = useAuth();

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsPending(true);
      const { data } = await axiosInstance.post(
        '/api/settings/stripe/subscription-checkout-form',
        { subscriptionPlan },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      localStorage.setItem('stripeContext', 'settings');
      window.location.href = data.sessionUrl;
    } catch (error) {
      console.error("Error during checkout:", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <PrimaryButton
        title={isPending ? 'Redirecting...' : 'Checkout'}
        className={styles.form}
      />
      <p className={styles.legal}>
        Payments are securely processed. By continuing, you agree to our{' '}
        <NavLink to="/termsofservice">Terms</NavLink>
        {' and '}
        <NavLink to="/privacypolicy">Privacy Policy</NavLink>.
      </p>
    </form>
  );
};

export default SubscriptionCheckoutForm;