import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import styles from './deleteAccount.module.css';
import { useAuth } from '../../../context/AuthContext';
import type { DecodedAccessToken } from '../../../interfaces/interfaces';
import axiosInstance from '../../../utils/axiosInstance';

const CONFIRM_PHRASE = 'DELETE';

const DeleteAccount = () => {
  const { accessToken, logout } = useAuth();
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  if (!accessToken) return null;

  const user = jwtDecode<DecodedAccessToken>(accessToken);
  const isLandlord = user.accountType === 'landlord';

  const closeModal = () => {
    if (isDeleting) return;
    setShowConfirm(false);
    setConfirmText('');
    setError('');
  };

  const handleDelete = async () => {
    setError('');
    setIsDeleting(true);
    try {
      await axiosInstance.delete('/api/settings/delete-account', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      logout();
      navigate('/login', { replace: true });
    } catch (err: any) {
      console.error('Failed to delete account', err);
      setError(err?.response?.data?.message ?? 'Failed to delete account.');
      setIsDeleting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Delete Account</h2>
      <p className={styles.subheading}>
        Permanently remove your account from PlacePin. This action cannot be undone.
      </p>

      <div className={styles.warningBox}>
        <h3 className={styles.warningTitle}>What happens when you delete your account</h3>
        <ul className={styles.warningList}>
          <li>Your active subscription will be cancelled immediately.</li>
          <li>Your account and all personal information will be permanently deleted.</li>
          <li>You will be signed out and unable to recover this account.</li>
          {isLandlord && (
            <li>
              All tenants linked to your properties will have their subscription ended
              and will no longer be referred to your account.
            </li>
          )}
        </ul>
      </div>

      <button
        type="button"
        className={styles.dangerButton}
        onClick={() => setShowConfirm(true)}
        disabled={isDeleting}
      >
        Delete my account
      </button>

      {showConfirm && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Are you absolutely sure?</h3>
            <p>
              This will permanently delete your account and cancel your subscription
              {isLandlord && ', and remove subscriptions from all referenced tenants'}.
              This action is irreversible.
            </p>
            <p className={styles.confirmInstruction}>
              Type <strong>{CONFIRM_PHRASE}</strong> below to confirm.
            </p>
            <input
              className={styles.confirmInput}
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={CONFIRM_PHRASE}
              autoFocus
            />
            {error && <p className={styles.errorMessage}>{error}</p>}
            <div className={styles.modalButtons}>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={closeModal}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.btnDanger}
                onClick={handleDelete}
                disabled={confirmText !== CONFIRM_PHRASE || isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteAccount;
