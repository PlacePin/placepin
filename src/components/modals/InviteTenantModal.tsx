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
  const [tenantAddress, setTenantAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
  });
  const [message, setMessage] = useState('');

  const { accessToken } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTenantAddress(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleTenantInviteSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const tenantInfo = {
      tenantName,
      tenantAddress,
      tenantEmail,
    }

    try {
      const res = await axios.post('/api/users/invite/tenant/',
        tenantInfo,
        {
          headers: {
            Authorization: `bearer ${accessToken}`
          }
        },
      )
      setMessage(res.data.message)
      onClose?.()
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
            name='street'
            placeholder='123 Main Street'
            onChange={handleChange}
            className={styles.inputFields}
            required
          />
          <div className={styles.split}>
            <div className={styles.city}>
              <label
                htmlFor='city'
                className={styles.labels}
              >
                City
              </label>
              <input
                type="text"
                id='city'
                name="city"
                placeholder='Boston'
                onChange={handleChange}
                className={styles.inputFields}
                required
              />
            </div>
            <div className={styles.state}>
              <label
                htmlFor='state'
                className={styles.labels}
              >
                State
              </label>
              <input
                type="text"
                id='state'
                name="state"
                placeholder='Massachusetts'
                onChange={handleChange}
                className={styles.inputFields}
                required
              />
            </div>
          </div>
          <label
            htmlFor='zip'
            className={styles.labels}
          >
            Zip Code
          </label>
          <input
            type="number"
            id='zip'
            name="zip"
            placeholder='02136'
            onChange={handleChange}
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
          Send Invite
        </button>
        <p className={styles.message}>{message}</p>
      </form>
    </FormModal>
  )
}

export default InviteTenantModal