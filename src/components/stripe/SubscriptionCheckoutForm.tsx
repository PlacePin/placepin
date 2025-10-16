import { type FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import styles from './subscriptionCheckoutForm.module.css';

const SubscriptionCheckoutForm = () => {

  const [loading, setLoading] = useState(false);
  const [subscripton, setSubscription] = useState(false)

  const { accessToken } = useAuth();

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    axios.get(`/api/subscription/status/${accessToken}`)
      .then(data => {
        const isSubscribed = data.data.subscription.isSubscribed
        setSubscription(isSubscribed)
      })
  }, [accessToken]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLoading(true);

    try {
      // 1. Create Checkout Session on the server
      const { data } = await axios.post(
        `/api/stripeSubscriptionCheckout/${accessToken}`
      );

      // 2. Redirect to Stripe Checkout
      window.location.href = data.sessionUrl;
    } catch (error) {
      console.error("Error during checkout:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button
        disabled={subscripton || loading}
        className={`${styles.button} ${subscripton && styles.notAllowed}`}
      >
        {loading ? "Redirecting..." : "Checkout"}
      </button>
      <p className={styles.message}>{subscripton && 'You are already subscribed!'}</p>
    </form>
  );
};

export default SubscriptionCheckoutForm;