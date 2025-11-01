import { useEffect, useRef, useState } from 'react';
import styles from './landlordMessaging.module.css';
import { Plus } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import ComposeModal from '../../../../components/modals/ComposeModal';
import { useGetAxios } from '../../../../hooks/useGetAxios';

type Message = {
  sender: string;
  content: string;
  time: string;
};

const LandlordMessaging = () => {
  const [people, setPeople] = useState<string[]>([
    'Isabella', 'Calvin', 'Kenji', 'Ralph', 'Aaron', 'Yves', 'Marcaine', 'Mirthaud', 'Caliyah'
  ]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [inputValue, setInputValue] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  // Set your current user (in production, you'd use user ID or JWT)
  const currentUserId = 'landlord_1';

  useEffect(() => {
    const socket = io('http://localhost:3000');
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected:', socket.id);

      // Join your personal room (this is what allows 1-on-1 messaging)
      socket.emit('join_room', currentUserId);
    });

    // Listen for private messages from the server
    socket.on('private_message', (data: { senderId: string; recipientId: string; content: string; time: string }) => {
      console.log('Private message received:', data);

      const sender = data.senderId === currentUserId ? 'You' : data.senderId;

      // Update the chat for the appropriate person
      const chatPartner = sender === 'You' ? data.recipientId : data.senderId;

      setMessages((prev) => ({
        ...prev,
        [chatPartner]: [...(prev[chatPartner] || []), { sender, content: data.content, time: new Date(data.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }],
      }));
    });

    socket.on('disconnect', () => console.log('Disconnected'));

    return () => {
      socket.disconnect();
    };
  }, []);

  const { data, error } = useGetAxios('/api/messages/conversations')

  if (!data) {
    return <div>{'Loading Data'}</div>
  }

  if (error) {
    return <div>{"Something went wrong, but don't panic, we'll fix it!"}</div>
  }

  console.log(data)

  const handleCompose = () => {
    setShowCompose(prev => !prev)
  }

  const convoWith = activeIndex !== null ? people[activeIndex] : '';

  const handleSend = () => {
    if (!inputValue.trim() || !convoWith) return;

    const messageData = {
      senderId: currentUserId,
      recipientId: convoWith, // recipient is whoever you’re chatting with
      content: inputValue,
    };

    socketRef.current?.emit('private_message', messageData);

    setMessages((prev) => ({
      ...prev,
      [convoWith]: [...(prev[convoWith] || []), { sender: 'You', content: inputValue, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }],
    }));

    setInputValue('');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Messages</h2>
      <div className={styles.wrapper}>
        {/* Left: Contacts */}
        <div className={styles.leftContainer}>
          <div className={styles.composeContainer}>
            <p
              className={styles.compose}
              onClick={handleCompose}
            >
              <Plus /> Compose
            </p>
          </div>
          <div className={styles.messagesList}>
            {people.map((person, i) => (
              <p
                key={i}
                className={`${styles.person} ${activeIndex === i ? styles.activeMessage : ''}`}
                onClick={() => setActiveIndex(i)}
              >
                {person}
              </p>
            ))}
          </div>
        </div>

        {/* Middle: Chat Window */}
        <div className={styles.convo}>
          {convoWith ? (
            <>
              <h3 className={`${activeIndex !== null && styles.header}`}>{convoWith}</h3>
              <div className={styles.dialog}>
                {(messages[convoWith] || []).map((message, i) => (
                  <p key={i} className={message.sender === 'You' ? styles.outgoing : styles.incoming}>
                    <strong>{message.sender}:</strong> {message.content}
                    <br />
                    <span className={styles.time}>{message.time}</span>
                  </p>
                ))}
              </div>
              <div className={styles.messageText}>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className={styles.inputMessage}
                  placeholder="Write a message..."
                />
                <button onClick={handleSend} className={styles.button}>
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className={styles.placeholder}>
              <p>Select a conversation to start chatting.</p>
            </div>
          )}
        </div>

        <div className={styles.promo}></div>
      </div>
      {showCompose && (
        <ComposeModal
          onClose={() => setShowCompose(prev => !prev)}
        />
      )}
    </div>
  );
};

export default LandlordMessaging;
