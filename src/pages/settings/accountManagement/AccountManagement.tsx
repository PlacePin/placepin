import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../subscriptionSettings/subscriptions.module.css';
import { useAuth } from '../../../context/AuthContext';
import axiosInstance from '../../../utils/axiosInstance';

const AccountManagement = () => {
  const { accessToken, logout } = useAuth();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!accessToken) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await axiosInstance.delete(
        '/api/settings/delete-account',
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      logout();
      navigate('/');
    } catch (err) {
      console.error('Failed to delete account', err);
      setIsDeleting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Account Management</h2>
      <p className={styles.simpleDescription}>
        Permanently delete your account. This will end your current subscription.
      </p>
      <div className={styles.subscribedState}>
        <button
          className={styles.btnCancel}
          onClick={() => setShowDeleteModal(true)}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete your account'}
        </button>
      </div>
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Delete your account?</h3>
            <p>
              Are you sure you'd like to delete your account? This will end your current
              subscription and cannot be undone.
            </p>
            <div className={styles.modalButtons}>
              <button
                className={styles.btnDowngrade}
                onClick={() => setShowDeleteModal(false)}
              >
                Keep account
              </button>
              <button
                className={styles.btnCancel}
                onClick={() => { setShowDeleteModal(false); handleDelete(); }}
              >
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountManagement;
