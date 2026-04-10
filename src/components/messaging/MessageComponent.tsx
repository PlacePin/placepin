import axiosInstance from "../../utils/axiosInstance";
import styles from './messageComponent.module.css';

type Message = {
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

const MessageComponent = ({ message, index, isOwn, onActionComplete }: MessageComponentProps) => {
  const handleAction = async () => {
    if (message.action?.type === "ACKNOWLEDGE_RENT" && !message.action.completed) {
      await axiosInstance.post('/api/rent/acknowledge', {
        ...message.action.payload,
        acknowledged: true
      });
      onActionComplete(index);
    }
  };

  return (
    <div className={styles.messageWrapper}>
      <p className={isOwn ? styles.incoming : styles.outgoing}>
        <strong>{message.sender}</strong>
        <br />
        <span>{message.content}</span>
        <br />
        {message.action?.type === "ACKNOWLEDGE_RENT" && !message.action.completed && (
          <button onClick={handleAction}>Acknowledge</button>
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