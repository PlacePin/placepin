import { type FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import styles from './subscriptionCheckoutForm.module.css';
import { useGetAxios } from "../../hooks/useGetAxios";
import SecondaryDangerButton from "../buttons/SecondaryDangerButton";

const SubscriptionCheckoutForm = () => {

  const [isPending, setIsPending] = useState(false);
  const [subscription, setSubscription] = useState(false)

  const { accessToken } = useAuth();

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  const { data } = useGetAxios(`/api/subscription/status`)

  useEffect(() => {
    if (data?.subscription) {
      setSubscription(data.subscription.isSubscribed)
    }
  }, [data]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (subscription) {
      try {
        await axios.post(
          '/api/settings/stripe/cancel-subscription',
          null,
          {
            headers: {
              Authorization: `bearer ${accessToken}`
            }
          }
        );
      } catch (err) {
        console.error(err)
      }
    } else {

      setIsPending(true);

      try {
        // 1. Create Checkout Session on the server
        const { data } = await axios.post(
          `/api/settings/stripe/subscription-checkout-form`,
          null,
          {
            headers: {
              Authorization: `bearer ${accessToken}`
            }
          }
        );
        // 2. Redirect to Stripe Checkout
        window.location.href = data.sessionUrl;
      } catch (error) {
        console.error("Error during checkout:", error);
      } finally {
        setIsPending(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <SecondaryDangerButton
        title={"Cancel Membership"}
      />
      <button
        disabled={subscription || isPending}
        className={`${styles.button} ${subscription && styles.notAllowed}`}
      >
        {isPending ? "Redirecting..." : "Checkout"}
      </button>
      <p className={styles.message}>{subscription && 'You are already subscribed!'}</p>
    </form>
  );
};

export default SubscriptionCheckoutForm;