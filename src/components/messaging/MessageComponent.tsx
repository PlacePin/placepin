import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { loadStripe } from "@stripe/stripe-js";
import axiosInstance from "../../utils/axiosInstance";
import SecondaryButton from "../buttons/SecondaryButton";
import styles from './messageComponent.module.css';

type Message = {
  messageId?: string;
  sender: string;
  content: string;
  sentAt: string;
  action?: {
    type: string;
    payload: any;
    completed?: boolean;
  };
};

type MessageComponentProps = {
  message: Message;
  index: number;
  isOwn: boolean;
  onActionComplete: (index: number) => void;
};

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK_KEY);

const MessageComponent = ({ message, index, isOwn, onActionComplete }: MessageComponentProps) => {
  const { accessToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  console.log('message', message.messageId)
  const handleAction = async () => {
    if (message.action?.type === "ACKNOWLEDGE_RENT_PRICE" && !message.action.completed) {
      try {
        setIsLoading(true);

        // Step 1: Get Financial Connections session client secret
        const { data } = await axiosInstance.get('/api/financial-connections/session', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });

        // Step 2: Open Stripe Financial Connections modal
        const stripe = await stripePromise;
        if (!stripe) throw new Error('Stripe failed to load');

        const result = await stripe.collectBankAccountForSetup({
          clientSecret: data.client_secret,
          params: {
            payment_method_type: 'us_bank_account',
            payment_method_data: {
              billing_details: {
                name: 'Tenant',
              },
            },
          },
        });

        if (result.error) throw new Error(result.error.message);
        if (!result.setupIntent?.payment_method) {
          throw new Error('No account selected');
        }

        const paymentMethodId = result.setupIntent.payment_method as string;

        // Step 3: Save the bank account
        await axiosInstance.post('/api/financial-connections/save-account', {
          paymentMethodId,
        }, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });

        // Step 4: Acknowledge the rent price
        await axiosInstance.post('/api/rent/acknowledge', {
          ...message.action.payload,
          acknowledged: true,
          messageId: message.messageId
        },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );
        onActionComplete(index);
      } catch (error) {
        console.error('Failed to acknowledge rent:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className={styles.messageWrapper}>
      <p className={isOwn ? styles.incoming : styles.outgoing}>
        <strong>{message.sender}</strong>
        <br />
        <span>{message.content}</span>
        <br />
        {message.action?.type === "ACKNOWLEDGE_RENT_PRICE" && !message.action.completed && !isOwn && (
          <SecondaryButton
            title={isLoading ? "Loading..." : "Acknowledge"}
            onClick={handleAction}
          />
        )}
        {message.action?.completed && (
          <span>✅ Acknowledged</span>
        )}
      </p>
      <span className={`${styles.time} ${isOwn ? styles.in : styles.out}`}>
        {new Date(message.sentAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })}
      </span>
    </div>
  );
};

export default MessageComponent