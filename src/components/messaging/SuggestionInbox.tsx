import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance';
import styles from '../../pages/dashboard/messaging/messaging.module.css';

type Suggestion = {
  id: string;
  message: string;
  sentAt: string;
  read: boolean;
};

const SuggestionInbox = () => {
  const { accessToken } = useAuth();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!accessToken) return;

    const fetchSuggestions = async () => {
      try {
        const res = await axiosInstance.get('/api/messages/suggestions', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setSuggestions(res.data.suggestions);
      } catch {
        setError('Failed to load suggestions.');
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [accessToken]);

  const markRead = async (id: string) => {
    try {
      await axiosInstance.patch(`/api/messages/suggestions/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setSuggestions((prev) =>
        prev.map((suggestion) => (suggestion.id === id ? { ...suggestion, read: true } : suggestion))
      );
    } catch {
      // non-critical — silently ignore
    }
  };

  if (!accessToken) return null;

  return (
    <div className={styles.suggestionInboxPanel}>
      <h3 className={styles.suggestionHeading}>Suggestion Box</h3>
      <p className={styles.suggestionSubtext}>
        Anonymous suggestions from your tenants.
      </p>

      {loading && <p className={styles.suggestionSubtext}>Loading…</p>}
      {error && <p className={styles.suggestionError}>{error}</p>}

      {!loading && !error && suggestions.length === 0 && (
        <p className={styles.suggestionSubtext}>No suggestions yet.</p>
      )}

      <div className={styles.suggestionCardList}>
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className={`${styles.suggestionCard} ${!suggestion.read ? styles.suggestionCardUnread : ''}`}
            onClick={() => { if (!suggestion.read) markRead(suggestion.id); }}
          >
            <div className={styles.suggestionCardHeader}>
              <span className={styles.suggestionAnonymousLabel}>Anonymous Tenant</span>
              <span className={styles.suggestionCardDate}>
                {new Date(suggestion.sentAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            <p className={styles.suggestionCardBody}>{suggestion.message}</p>
            {!suggestion.read && <span className={styles.suggestionUnreadDot} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestionInbox;
