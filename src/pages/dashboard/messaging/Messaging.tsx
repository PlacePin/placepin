import { useGetAxios } from '../../../hooks/useGetAxios';
import { useAuth } from '../../../context/AuthContext';
import { useEffect, useRef, useState } from 'react';
import { Gift, MessageCircleMore, Plus } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';
import type { DecodedAccessToken } from '../../../interfaces/interfaces';
import styles from './messaging.module.css';
import ComposeModal from '../../../components/modals/ComposeModal';
import SendGiftModal from '../../../components/modals/SendGiftModal';
import PrimaryButton from '../../../components/buttons/PrimaryButton';
import { NavLink } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInstance';
import MessageComponent from '../../../components/messaging/MessageComponent';

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

type SocketMessage = {
  senderId: string;
  receiverId: string;
  senderUsername?: string;
  recipientUsername?: string;
} & Message;

type LandlordTenantRow = {
  _id: string;
  username: string;
  fullName?: string;
};

const Messaging = () => {
  const [people, setPeople] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [inputValue, setInputValue] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [giftTenant, setGiftTenant] = useState<{ id: string; name: string } | null>(null);
  const [giftHint, setGiftHint] = useState<string | null>(null);
  const [landlordTenants, setLandlordTenants] = useState<LandlordTenantRow[] | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const { accessToken } = useAuth();

  if (!accessToken) {
    return
  }

  const decoded = jwtDecode<DecodedAccessToken>(accessToken);
  const isLandlord = decoded.accountType === 'landlord';

  // Set your current user (in production, you'd use user ID or JWT)
  const currentUserId = decoded.userID;
  const convoWith = activeIndex !== null ? people[activeIndex] : '';

  useEffect(() => {
    if (!currentUserId) return;

    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000');
    socketRef.current = socket;

    socket.on('connect', () => {
      // Join your personal room (this is what allows 1-on-1 messaging)
      socket.emit('join_room', currentUserId);
    });

    // Listen for private messages from the server
    socket.on('private_message', (
      data: SocketMessage
    ) => {
      const isSelf = data.senderId === currentUserId;
      const chatPartnerId = isSelf ? data.receiverId : data.senderId;
      // Always bucket by the other person’s username so messages land in the right thread
      // (do not use the currently selected convo — that mis-routes gifts and other server pushes).
      const threadKey =
        (isSelf ? data.recipientUsername : data.senderUsername) ||
        (people.includes(convoWith) ? convoWith : '') ||
        String(chatPartnerId);

      setMessages((prev) => ({
        ...prev,
        [threadKey]: [...(prev[threadKey] || []),
        {
          sender: isSelf ? 'You' : threadKey,
          content: data.content,
          sentAt: data.sentAt,
          action: data.action ?? undefined
        }],
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUserId, people, convoWith]);

  const { data, error } = useGetAxios('/api/messages/usernames');

  useEffect(() => {
    if (!isLandlord || !accessToken) return;
    const ac = new AbortController();
    axiosInstance
      .get<{ tenants: LandlordTenantRow[] }>('/api/landlords/tenants', {
        headers: { Authorization: `Bearer ${accessToken}` },
        signal: ac.signal,
      })
      .then((res) => setLandlordTenants(res.data.tenants ?? []))
      .catch(() => setLandlordTenants([]));
    return () => ac.abort();
  }, [isLandlord, accessToken]);

  useEffect(() => {
    if (data?.usernames) {
      setPeople(data.usernames);
    }
  }, [data]);

  useEffect(() => {
    setGiftHint(null);
  }, [convoWith]);

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

  const handleActionComplete = (convo: string, index: number) => {
    setMessages(prev => ({
      ...prev,
      [convo]: prev[convo].map((msg, i) =>
        i === index
          ? { ...msg, action: { ...msg.action!, completed: true } }
          : msg
      )
    }));
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend()
    }
  }

  const handleGiftClick = () => {
    if (!convoWith) {
      setGiftHint('Select a conversation first, then send a gift to that tenant.');
      return;
    }
    if (!landlordTenants) {
      setGiftHint('Loading your tenant list…');
      return;
    }
    const match = landlordTenants.find((t) => t.username === convoWith);
    if (!match) {
      setGiftHint('Gifts can only be sent to tenants on your properties. Invite them from Tenants if they are missing here.');
      return;
    }
    setGiftHint(null);
    setGiftTenant({
      id: match._id,
      name: match.fullName || match.username,
    });
    setShowGiftModal(true);
  };

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
            {isLandlord && (
              <p
                className={styles.composeGift}
                onClick={handleGiftClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleGiftClick();
                  }
                }}
              >
                <Gift size={18} strokeWidth={1.75} aria-hidden />
                Send gift
              </p>
            )}
            {isLandlord && giftHint && (
              <p className={styles.giftHint}>{giftHint}</p>
            )}
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
                  <div className={styles.messageWrapper} key={i}>
                    <MessageComponent
                      key={i}
                      message={message}
                      index={i}
                      isOwn={message.sender !== convoWith}
                      onActionComplete={(idx) => handleActionComplete(convoWith, idx)}
                    />
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
      {showGiftModal && giftTenant && (
        <SendGiftModal
          tenantId={giftTenant.id}
          tenantName={giftTenant.name}
          onClose={() => {
            setShowGiftModal(false);
            setGiftTenant(null);
          }}
        />
      )}
    </div>
  );
};

export default Messaging;
