import { type FormEvent, useState } from "react";
import axios from "axios";

const SubscriptionCheckoutForm = () => {

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLoading(true);

    try {
      // 1. Create Checkout Session on the server
      const { data } = await axios.post("/api/stripeSubscriptionCheckout");

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
    <button disabled={loading}>
      {loading ? "Processing..." : "Checkout"}
    </button>
  </form>
);
};

export default SubscriptionCheckoutForm;