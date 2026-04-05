import { useGetAxios } from '../../../hooks/useGetAxios';
import { useAuth } from '../../../context/AuthContext';
import { useEffect, useRef, useState } from 'react';
import { MessageCircleMore, Plus } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';
import type { DecodedAccessToken } from '../../../interfaces/interfaces';
import styles from './messaging.module.css';
import ComposeModal from '../../../components/modals/ComposeModal';
import PrimaryButton from '../../../components/buttons/PrimaryButton';
import { NavLink } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInstance';

type Message = {
  sender: string;
  content: string;
  sentAt: string;
};

const Messaging = () => {
  const [people, setPeople] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [inputValue, setInputValue] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const { accessToken } = useAuth();

  if (!accessToken) {
    return
  }

  const decoded = jwtDecode<DecodedAccessToken>(accessToken);

  // Set your current user (in production, you'd use user ID or JWT)
  const currentUserId = decoded.userID;
  const convoWith = activeIndex !== null ? people[activeIndex] : '';

  useEffect(() => {
    if (!currentUserId) return;

    const socket = io('http://localhost:3000');
    socketRef.current = socket;

    socket.on('connect', () => {
      // Join your personal room (this is what allows 1-on-1 messaging)
      socket.emit('join_room', currentUserId);
    });

    // Listen for private messages from the server
    socket.on('private_message', (data: {
      senderId: string;
      receiverId: string;
      content: string;
      sentAt: string
    }) => {
      const isSelf = data.senderId === currentUserId;
      const chatPartnerId = isSelf ? data.receiverId : data.senderId;

      const chatPartnerUsername = people.find((person) => person === convoWith) || convoWith || chatPartnerId;

      setMessages((prev) => ({
        ...prev,
        [chatPartnerUsername]: [...(prev[chatPartnerUsername] || []),
        {
          sender: isSelf ? 'You' : chatPartnerUsername,
          content: data.content,
          sentAt: data.sentAt
        }],
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUserId, people, convoWith]);

  const { data, error } = useGetAxios('/api/messages/usernames');

  useEffect(() => {
    if (data?.usernames) {
      setPeople(data.usernames);
    }
  }, [data]);

  const isLoading = !data;
  const hasError = !!error;

  useEffect(() => {
    if (!convoWith) return;

    const conversation = async () => {
      try {
        const res = await axiosInstance.get(`/api/messages/conversations?username=${convoWith}`, {
          headers: { Authorization: `bearer ${accessToken}` },
        });
        setMessages((prev) => ({
          ...prev,
          [convoWith]: res.data.messages,
        }));
      } catch (err) {
        console.error('Error fetching conversation', err);
      }
    };

    conversation();
  }, [convoWith]);

  useEffect(() => {
    const position = scrollRef.current
    if (position) {
      position.scrollTop = position.scrollHeight
    }
  }, [messages])

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend()
    }
  }

  const handleSend = () => {
    if (!inputValue.trim() || !convoWith) return;

    const messageData = {
      senderId: currentUserId,
      recipientUsername: convoWith,
      content: inputValue,
    };

    socketRef.current?.emit('private_message', messageData);
    setInputValue('');
  };

  return (
    <div className={styles.container}>
      {isLoading &&
        <div>
        </div>
      }
      {hasError &&
        <div>
          Something went wrong, but don't panic, we'll fix it!
        </div>
      }
      <h2 className={styles.title}>Messages</h2>
      <div className={styles.wrapper}>
        {/* Left: Contacts */}
        <div className={styles.leftContainer}>
          <div className={styles.composeContainer}>
            <p
              className={styles.compose}
              onClick={() => setShowCompose(prev => !prev)}
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
        <>
          {convoWith ? (
            <div className={styles.convo}>
              <h3 className={`${activeIndex !== null && styles.header}`}>{convoWith}</h3>
              <div
                className={styles.dialog}
                ref={scrollRef}
              >
                {(messages[convoWith] || []).map((message, i) => (
                  <div
                    className={styles.messageWrapper}
                    key={i}
                  >
                    <p
                      className={message.sender === convoWith ? styles.outgoing : styles.incoming}
                    >
                      <strong>
                        {message.sender}
                      </strong>
                      <br />
                      <span>
                        {message.content}
                      </span>
                      <br />
                    </p>
                    <span
                      className={`${styles.time} ${message.sender === convoWith ? styles.out : styles.in}`}
                    >
                      {new Date(message.sentAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                ))}
              </div>
              <div className={styles.messageText}>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className={styles.inputMessage}
                  placeholder="Write a message..."
                  onKeyDown={handleEnter}
                />
                <PrimaryButton
                  title='Send'
                  onClick={handleSend}
                  className={styles.button}
                />
              </div>
            </div>
          ) : (
            <div className={styles.messageContainer}>
              <div className={styles.messageBubble}>
                <MessageCircleMore
                  size={48}
                  color='#00bfa5'
                />
              </div>
              <h4>Select a conversation</h4>
              <p
                className={styles.selectConvo}
              >
                Choose a contact from the sidebar to start chatting or continue a previous conversation.
              </p>
            </div>
          )}
        </>
        <div>
          {/* This div is for advertising later on */}
          {/* <div className={styles.promo}></div> */}
          <div className={styles.infoSection}>
            <NavLink
              className={styles.navLink}
              to="/privacypolicy">
              <p>Privacy Policy</p>
            </NavLink>
            <NavLink
              className={styles.navLink}
              to="/termsofservice">
              <p>Terms of Service</p>
            </NavLink>
            <h2 className={styles.logo}>PlacePin</h2>
          </div>
        </div>

      </div>
      {showCompose && (
        <ComposeModal
          onClose={() => setShowCompose(prev => !prev)}
        />
      )}
    </div>
  );
};

export default Messaging;
