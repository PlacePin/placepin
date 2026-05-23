import { useState } from "react";
import SaveCardForm from "../../../components/stripe/SaveCardForm";
import styles from './bankSettings.module.css';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../../../context/AuthContext";
import axiosInstance from "../../../utils/axiosInstance";
import type { DecodedAccessToken } from "../../../interfaces/interfaces";
import PrimaryButton from "../../../components/buttons/PrimaryButton";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK_KEY);

const BankSettings = () => {
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!accessToken) return null;

  // Decode the user to identify if they are a landlord
  const user = jwtDecode<DecodedAccessToken>(accessToken);

  const handleStripeConnectOnboarding = async () => {
    setLoading(true);
    try {
      // Request the temporary secure link from your backend
      const { data } = await axiosInstance.post(
        "/api/settings/landlord-onboard",
        {},
        {
          headers: {
            Authorization: `bearer ${accessToken}`
          }
        }
      );

      // Redirect the landlord directly to Stripe's legal setup page
      window.location.href = data.onboardingUrl;
    } catch (err) {
      console.error("Failed to fetch onboarding link:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Elements stripe={stripePromise}>
        <SaveCardForm />
      </Elements>

      <hr className={styles.divider} />
      {/* Stripe Connect Setup section exclusively for Landlords */}
      {user.accountType === 'landlord' && (
        <div className={styles.connectSection}>
          <h3>Rent Direct Deposits</h3>
          <p className={styles.description}>
            Connect your bank account securely to begin accepting monthly rent deposits from your tenants.
          </p>
          <PrimaryButton
            onClick={handleStripeConnectOnboarding}
            disabled={loading}
            className={styles.connectButton}
            title={loading ? "Connecting to Stripe..." : "Set up Payout Bank Account"}
          />
        </div>
      )}
    </div>
  );
};

export default BankSettings;
