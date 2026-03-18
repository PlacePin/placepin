import { type FormEvent, useEffect, useState } from "react";
import styles from './basicInfoForm.module.css';
import axios from 'axios';
import { useAuth } from "../../../context/AuthContext";
import { Navigate } from "react-router-dom";
import { LockKeyhole } from 'lucide-react';

const BasicInfoForm = () => {

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [DoB, setDoB] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { accessToken } = useAuth();

  console.log('dob', typeof DoB)

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const fetchUserID = async () => {
      try {
        const res = await axios.get(`/api/settings`, {
          headers: {
            Authorization: `bearer ${accessToken}`
          }
        })
        
        const { user } = res.data
        setFullName(user.fullName ?? '');
        setPhoneNumber(user.phoneNumber ?? '');
        setUsername(user.username ?? '');
        setEmail(user.email ?? '');

      } catch (err: any) {
        console.error(err.response.data.message)
      }
    }

    fetchUserID()
  }, [accessToken])


  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setSaveError('');
    setSaveSuccess(false);

    try {
      await axios.put('/api/settings', {
        fullName,
        phoneNumber,
        gender,
        dateOfBirth: DoB,
        username,
      }, {
        headers: {
          Authorization: `bearer ${accessToken}`
        }
      });
      setSaveSuccess(true);
    } catch (err: any) {
      setSaveError(err.response?.data?.message ?? 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <div className={styles.formContainer}>
          <div className={styles.formRow}>
            <label
              htmlFor="name"
            >
              Name
            </label>
            <input
              className={styles.inputFields}
              type='text'
              id='name'
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className={styles.formRow}>
            <label
              htmlFor="phone"
            >
              Phone
            </label>
            <input
              className={styles.inputFields}
              type='tel'
              id="phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className={styles.formRow}>
            <label
              htmlFor="gender"
            >
              Gender
            </label>
            <select
              className={styles.inputFields}
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="" disabled>Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="Non-Binary">Non-Binary</option>
            </select>
          </div>
          <div className={styles.formRow}>
            <label
              htmlFor="DoB"
            >
              Date of Birth
            </label>
            <input
              className={styles.inputFields}
              type='date'
              id="DoB"
              value={DoB}
              onChange={(e) =>
                setDoB(e.target.value)}
            />
          </div>
          <div className={styles.formRow}>
            <label
              htmlFor="username"
            >
              Username
            </label>
            <input
              className={styles.inputFields}
              type='text'
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className={styles.formRow}>
            <label
              htmlFor="email"
            >
              Email
            </label>
            <div className={styles.disabledField}>
              <input
                className={`${styles.inputFields} ${styles.disabled}`}
                type='email'
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={true}
              />
              <LockKeyhole />
            </div>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          {saveError && <p className={styles.errorMessage}>{saveError}</p>}
          {saveSuccess && <p className={styles.successMessage}>Changes saved successfully.</p>}
          <button className={styles.button} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default BasicInfoForm