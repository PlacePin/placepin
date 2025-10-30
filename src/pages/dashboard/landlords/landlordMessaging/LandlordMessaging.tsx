import { useEffect, useRef, useState } from 'react';
import styles from './landlordMessaging.module.css';
import { Plus } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

type Message = {
  sender: string;
  text: string;
  time: string;
};

const LandlordMessaging = () => {
  const [people] = useState<string[]>([
    'Isabella', 'Calvin', 'Kenji', 'Ralph', 'Aaron', 'Yves', 'Marcaine', 'Mirthaud', 'Caliyah'
  ]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [inputValue, setInputValue] = useState('');
  const socketRef = useRef<Socket | null>(null);

  // Persistent socket connection
  useEffect(() => {
    const socket = io('http://localhost:3000');
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected:', socket.id);
    });

    socket.on('chat message', (data: { sender: string; recipient: string; text: string; time: string }) => {
      setMessages((prev) => ({
        ...prev,
        [data.sender]: [...(prev[data.sender] || []), { sender: data.sender, text: data.text, time: data.time }],
      }));
    });

    socket.on('disconnect', () => console.log('Disconnected'));

    return () => {
      socket.disconnect();
    };
  }, []);

  const convoWith = activeIndex !== null ? people[activeIndex] : '';

  const handleSend = () => {
    if (!inputValue.trim() || !convoWith) return;

    const messageData = {
      sender: 'Landlord',
      recipient: convoWith,
      text: inputValue,
      time: new Date().toLocaleTimeString(),
    };

    // Emit message to backend
    socketRef.current?.emit('chat message', messageData);

    // Add message locally
    setMessages((prev) => ({
      ...prev,
      [convoWith]: [...(prev[convoWith] || []), messageData],
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
            <p className={styles.compose}>
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
                {(messages[convoWith] || []).map((msg, i) => (
                  <p key={i} className={msg.sender === 'Landlord' ? styles.outgoing : styles.incoming}>
                    <strong>{msg.sender}:</strong> {msg.text}
                    <br />
                    <span className={styles.time}>{msg.time}</span>
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

        {/* Right: Promo or additional info */}
        <div className={styles.promo}></div>
      </div>
    </div>
  );
};

export default LandlordMessaging;
