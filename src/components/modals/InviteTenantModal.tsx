import { useState, type FormEvent } from 'react';
import styles from './inviteTenantModal.module.css';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const InviteTenantModal = () => {

  const [tenantName, setTenantName] = useState('');
  const [tenantEmail, setTenantEmail] = useState('');
  const [tenantAddress, setTenantAddress] = useState('');
  
  const { accessToken } = useAuth();

  const handleTenantInviteSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const tenantInfo = {
      tenantName,
      tenantAddress,
      tenantEmail,
      accessToken
    }

    console.log(tenantInfo)

    try{
      const res = await axios.post('/api/invite/tenant/', tenantInfo)
      console.log(res)
    } catch (err) {
      console.error(err, "Failed to send invite!")
    }
  }

  return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContainer}>
          <h2>Invite Tenant</h2>
          <form onSubmit={handleTenantInviteSubmit}>
            <label htmlFor='tenantName'>
              Tenant Name
            </label>
            <br />
            <input
              type="text"
              id='tenantName'
              placeholder='Dinah Augustin'
              onChange={(e) => setTenantName(e.target.value)}
              required
            />
            <br />
            <label htmlFor='tenantAddress'>
              Tenant Address
            </label>
            <br />
            <input
              type="text"
              id='tenantAddress'
              placeholder='123 Main St. Boston MA, 02136'
              onChange={(e) => setTenantAddress(e.target.value)}
              required
            />
            <br />
            <label htmlFor='tenantEmail'>
              Tenant Email
            </label>
            <br />
            <input
              type="email"
              id='tenantEmail'
              placeholder='dinahaugustin@placepin.com'
              onChange={(e) => setTenantEmail(e.target.value)}
              required
            />
            <br />
            <button>
              Send Invite!
            </button>
          </form>
        </div>
      </div>
  )
}

export default InviteTenantModal