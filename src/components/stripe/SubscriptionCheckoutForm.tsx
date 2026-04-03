import { type FormEvent, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import styles from './subscriptionCheckoutForm.module.css';
import { useGetAxios } from "../../hooks/useGetAxios";
import SecondaryDangerButton from "../buttons/SecondaryDangerButton";
import PrimaryButton from "../buttons/PrimaryButton";

const SubscriptionCheckoutForm = () => {

  const [isPending, setIsPending] = useState(false);
  const [subscription, setSubscription] = useState(false);

  const { accessToken } = useAuth();

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  const { data } = useGetAxios(`/api/subscription/status`);

  useEffect(() => {
    if (data?.subscription) {
      setSubscription(data.subscription.isSubscribed)
    }
  }, [data]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (subscription) {
      try {
        setIsPending(true);
        const { data } = await axios.post(
          '/api/settings/stripe/cancel-subscription',
          null,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );
        const cancelSubscription = data.updatedSubscription['subscription.isSubscribed'];
        setSubscription(cancelSubscription);
      } catch (error) {
        console.error(error);
      } finally {
        setIsPending(false);
      }
    } else {
      try {
        setIsPending(true);
        // 1. Create Checkout Session on the server
        const { data } = await axios.post(
          `/api/settings/stripe/subscription-checkout-form`,
          null,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
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
    <form
      onSubmit={handleSubmit}
      className={styles.form}
    >
      {subscription ?
        <SecondaryDangerButton
          title={isPending ? "Cancelling..." : "Cancel Membership"}
        /> :
        <PrimaryButton
          title={isPending ? 'Redirecting...' : 'Checkout'}
          className={styles.form}
        />
      }
      <p className={styles.message}>{subscription && 'You are already subscribed!'}</p>
    </form>
  );
};

export default SubscriptionCheckoutForm;