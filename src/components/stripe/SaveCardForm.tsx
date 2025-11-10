import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import styles from './saveCardForm.module.css';
import { useAuth } from "../../context/AuthContext";

const SaveCardForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('')

  const { accessToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // Create SetupIntent on the server
      const { data } = await axios.post(
        "/api/settings/savecardform",
        {},
        {
          headers: {
            Authorization: `bearer ${accessToken}`
          }
        });

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) return;

      // Confirm card setup with Stripe
      const result = await stripe.confirmCardSetup(data.clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (result.error) {
        console.error(result.error.message);
        return
      } else {

        const paymentMethodId = result.setupIntent.payment_method;

        // Send the paymentMethodId back to the same route to store it
        const res = await axios.post(
          "/api/settings/savecardform",
          {
            paymentMethodId
          },
          {
            headers: {
              Authorization: `bearer ${accessToken}`
            }
          }
        );
        setMessage(res.data.message)
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <p>Save your debit/credit card</p>
      <form
        onSubmit={handleSubmit}
        className={styles.form}
      >
        <div className={styles.divContainer}>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#111827",
                  fontFamily: "'Inter', sans-serif",
                  fontSmoothing: "antialiased",
                  "::placeholder": {
                    color: "#9ca3af",
                  },
                  padding: "12px 14px",
                },
                invalid: {
                  color: "#ef4444",
                  iconColor: "#ef4444",
                },
              },
            }}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !stripe}
          className={styles.button}
        >
          {loading ? "Saving..." : "Save Card"}
        </button>

        {message && (
          <p className={styles.message}>{message}</p>
        )}
      </form>
      <p className={styles.disclaimer}>This card is usually used to collect rent.</p>
    </>
  );
};

export default SaveCardForm;
