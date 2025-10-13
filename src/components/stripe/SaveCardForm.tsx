import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";

interface SaveCardFormProps {
  userID: string;
  accountType: string;
  accessToken: string;
}

const SaveCardForm = ({ userID, accountType, accessToken }: SaveCardFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // Create SetupIntent on the server
      const { data } = await axios.post("/api/savecardform", { userID, accountType, accessToken });

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
      } else {
        console.log("Card saved successfully!", result.setupIntent);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button disabled={loading || !stripe}>
        {loading ? "Saving..." : "Save Card"}
      </button>
    </form>
  );
};

export default SaveCardForm;
