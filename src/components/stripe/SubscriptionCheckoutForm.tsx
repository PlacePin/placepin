import { type FormEvent, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Navigate, NavLink } from "react-router-dom";
import styles from './subscriptionCheckoutForm.module.css';
import { useGetAxios } from "../../hooks/useGetAxios";
import SecondaryDangerButton from "../buttons/SecondaryDangerButton";
import PrimaryButton from "../buttons/PrimaryButton";
import axiosInstance from "../../utils/axiosInstance";

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
        const { data } = await axiosInstance.post(
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
        const { data } = await axiosInstance.post(
          `/api/settings/stripe/subscription-checkout-form`,
          null,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );
        // 2. Redirect to Stripe Checkout
        localStorage.setItem('stripeContext', 'settings');
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
      <p className={styles.legal}>
        {`Payments are securely processed. By continuing, you agree to our `}
        <NavLink to="/termsofservice">
          {`Terms`}
        </NavLink>
        {" and "}
        <NavLink to="/privacypolicy">
          {`Privacy Policy`}
        </NavLink>.
      </p>
      <p className={styles.message}>{subscription && 'You are already subscribed!'}</p>
    </form>
  );
};

export default SubscriptionCheckoutForm;