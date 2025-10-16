import { useState, type FormEvent } from 'react';
import styles from './inviteTenantModal.module.css';
import axios from 'axios';

const InviteTenantModal = () => {

  const handleTenantInviteSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await axios.post('/api/invite/tenant/:id', {

    }

    )
  }

  return (
    <>
      <div className={styles.modalOverlay}>
        <div className={styles.modalContainer}>
          <h2>Invite Tenant</h2>
          <form onSubmit={handleTenantInviteSubmit}>
            <label htmlFor='tenantAddress'>
              Tenant Address
            </label>
            <br />
            <input
              type="text"
              id='tenantAddress'
              required
            />
            <button>
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default InviteTenantModal