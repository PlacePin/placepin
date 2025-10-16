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

  const { accessToken } = useAuth();

  const disabled = true
  const disableStyle = disabled && styles.disabled

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    const fetchUserID = async () => {
      try {
        const res = await axios.get(`/api/landlordsetting/${accessToken}`)
        const { landlord } = res.data
        setFullName(landlord.fullName ?? '');
        setPhoneNumber(landlord.phoneNumber ?? '');
        setUsername(landlord.username ?? '');
        setEmail(landlord.email ?? '');

      } catch (err: any) {
        console.error(err.response.data.message)
      }
    }

    fetchUserID()
  }, [accessToken])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

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
              onChange={(e) => setDoB(e.target.value)}
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
                className={`${styles.inputFields} ${disableStyle}`}
                type='email'
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={disabled}
              />
              <LockKeyhole />
            </div>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.button}>Save</button>
        </div>
      </form>
    </div>
  )
}

export default BasicInfoForm