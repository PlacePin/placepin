import { useState, type FormEvent } from 'react';
import styles from './inviteTenantModal.module.css';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import FormModal from './FormModal';

interface InviteTenantModalProps {
  onClose?: () => void;
}

const InviteTenantModal = ({ onClose }: InviteTenantModalProps) => {

  const [tenantName, setTenantName] = useState('');
  const [tenantEmail, setTenantEmail] = useState('');
  const [tenantAddress, setTenantAddress] = useState('');
  const [message, setMessage] = useState('');

  const { accessToken } = useAuth();

  const handleTenantInviteSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const tenantInfo = {
      tenantName,
      tenantAddress,
      tenantEmail,
      accessToken
    }

    try {
      const res = await axios.post('/api/invite/tenant/', tenantInfo)
      console.log(res)
    } catch (err: any) {
      setMessage('Failed to send invite!')
    }
  }

  return (
    <FormModal title='Invite Tenant' onClose={onClose}>
      <form onSubmit={handleTenantInviteSubmit}>
        <div className={styles.formContainer}>
          <label 
          htmlFor='tenantName'
          className={styles.labels}
          >
            Tenant Name
          </label>
          <input
            type="text"
            id='tenantName'
            placeholder='Dinah Augustin'
            onChange={(e) => setTenantName(e.target.value)}
            className={styles.inputFields}
            required
          />
          <label 
          htmlFor='tenantAddress'
          className={styles.labels}
          >
            Tenant Address
          </label>
          <input
            type="text"
            id='tenantAddress'
            placeholder='123 Main St. Boston MA, 02136'
            onChange={(e) => setTenantAddress(e.target.value)}
            className={styles.inputFields}
            required
          />
          <label 
          htmlFor='tenantEmail'
          className={styles.labels}
          >
            Tenant Email
          </label>
          <input
            type="email"
            id='tenantEmail'
            placeholder='dinahaugustin@placepin.com'
            onChange={(e) => setTenantEmail(e.target.value)}
            className={styles.inputFields}
            required
          />
        </div>
        <button className={styles.button}>
          Send Invite!
        </button>
        <p className={styles.message}>{message}</p>
      </form>
    </FormModal>
  )
}

export default InviteTenantModal