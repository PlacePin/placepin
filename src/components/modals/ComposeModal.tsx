import { useEffect, useState, type FormEvent } from 'react';
import styles from './inviteTenantModal.module.css';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import FormModal from './FormModal';

interface InviteTenantModalProps {
  onClose?: () => void;
}

const ComposeModal = ({ onClose }: InviteTenantModalProps) => {

  const [recipientUsername, setrecipientUsername] = useState('');
  const [directMessage, setDirectMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { accessToken } = useAuth();

  const handleDirectMessageSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const textMessage = {
      recipientUsername,
      directMessage,
    }

    try {
      const res = await axios.post('/api/messages/send',
        textMessage,
        {
          headers: {
            Authorization: `bearer ${accessToken}`
          }
        },
      )

      if (res.status === 201) {
        // Add timer later to render for 3 secs
        setErrorMessage(res.data.message)
        onClose?.()
      }

    } catch (err: any) {
      setErrorMessage('Failed to send message!')
    }
  }

  return (
    <FormModal title='Start Message' onClose={onClose}>
      <form onSubmit={handleDirectMessageSubmit}>
        <div className={styles.formContainer}>
          <label
            htmlFor='recipientUsername'
            className={styles.labels}
          >
            Recipient:
          </label>
          <input
            type="text"
            id='recipientUsername'
            placeholder='@username'
            onChange={(e) => setrecipientUsername(e.target.value)}
            className={styles.inputFields}
            required
          />
          <label
            htmlFor='directMessage'
            className={styles.labels}
          >
            Message:
          </label>
          <textarea
            id='directMessage'
            placeholder='Your Message...'
            onChange={(e) => setDirectMessage(e.target.value)}
            className={styles.textArea}
            rows={10}
            required
          />
        </div>
        <button className={styles.button}>
          Send Message!
        </button>
        <p className={styles.errorMessage}>{errorMessage}</p>
      </form>
    </FormModal>
  )
}

export default ComposeModal