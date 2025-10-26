import styles from './loginPage.module.css'
import axios from 'axios'
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { LANDLORD_ROUTES } from '../../../routes/landlordRoutes';
import { TENANT_ROUTES } from '../../../routes/tenantRoutes';

const LoginPage = () => {

  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleLoginUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const loginCredentials = {
      email,
      password
    }

    try {
      const res = await axios.post(
        '/api/auth/login',
        loginCredentials,
      )

      if (res.status === 200) {
        const { accessToken, accountType, email, username } = res.data
        login(accessToken, email, username)
        if(accountType === 'landlord'){
          navigate(LANDLORD_ROUTES.DASHBOARD)
        }
        if(accountType === 'tenant'){
          navigate(TENANT_ROUTES.DASHBOARD)
        }
      }
    } catch (err: any) {
      console.error(err)
      setErrorMessage(err.response.data.message)
    }
  }

  return (
    <div className={styles.entireContainer}>
      <form onSubmit={handleLoginUser} className={styles.loginHeroForm}>
        <h4>
          Login
        </h4>
        <label
          className={styles.inputLabel}
          htmlFor='email'
        >
          Email
        </label>
        <input
          type="text"
          className={styles.inputFields}
          onChange={(e) => setEmail(e.target.value.toLowerCase().trim())}
          id='email'
          required
        />
        <label
          className={styles.inputLabel}
          htmlFor='password'
        >
          Password
        </label>
        <input
          type="password"
          className={styles.inputFields}
          onChange={(e) => setPassword(e.target.value)}
          id='password'
          required
        />
        <NavLink className={styles.navLink} to='/'><p className={styles.forgotPassword}>Forgot Password?</p></NavLink>
        <button>Submit</button>
        <p className={`${styles.errorMessage} ${styles.inputLabel}`}>{errorMessage}</p>
        <p>Don't have an account? <NavLink to='/signup'>Sign up</NavLink></p>
      </form>
    </div>
  )
}

export default LoginPage