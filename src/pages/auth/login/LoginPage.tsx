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
        if (accountType === 'landlord') {
          navigate(LANDLORD_ROUTES.DASHBOARD)
        }
        if (accountType === 'tenant') {
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
      <div className={styles.animatedBorderWrapper}>
        <div className={styles.animatedBorderContent}>
          <div className={styles.wrapperContainer}>
            <form onSubmit={handleLoginUser} className={styles.loginHeroForm}>
              <h4>Welcome Back</h4>
              <label className={styles.inputLabel} htmlFor="email">Email</label>
              <input
                type="text"
                className={styles.inputFields}
                onChange={(e) => setEmail(e.target.value.toLowerCase().trim())}
                id="email"
                required
              />
              <label className={styles.inputLabel} htmlFor="password">Password</label>
              <input
                type="password"
                className={styles.inputFields}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                required
              />
              <NavLink className={styles.navLink} to="/">
                <p className={styles.forgotPassword}>Forgot Password?</p>
              </NavLink>
              <button>Login</button>
              <p className={`${styles.errorMessage} ${styles.inputLabel}`}>{errorMessage}</p>
              <p>
                Don’t have an account? <NavLink to="/signup">Sign up</NavLink>
              </p>
            </form>
            <div className={styles.photo}>
              <img
                src="/groupPhoto.png"
                alt="cartoon group photo"
              />
              <div className={styles.carouselContainer}>
                <h3>Where tenants feel at home — every day</h3>
                <div className={styles.photoBadges}>
                  <div className={styles.scrollRow}>
                    <span>Comfort-Driven</span>
                    <span>Simple Setup</span>
                    <span>Trusted Platform</span>
                    <span>Seamless Communication</span>
                    <span>Easy Management</span>
                    <span>High Retention</span>
                    {/* Duplicate for seamless looping */}
                    <span>Comfort-Driven</span>
                    <span>Simple Setup</span>
                    <span>Trusted Platform</span>
                    <span>Seamless Communication</span>
                    <span>Easy Management</span>
                    <span>High Retention</span>
                  </div>
                  <div className={`${styles.scrollRow} ${styles.reverse}`}>
                    <span>Comfort-Driven</span>
                    <span>Simple Setup</span>
                    <span>Trusted Platform</span>
                    <span>Seamless Communication</span>
                    <span>Easy Management</span>
                    <span>High Retention</span>
                    {/* Duplicate for seamless looping */}
                    <span>Comfort-Driven</span>
                    <span>Simple Setup</span>
                    <span>Trusted Platform</span>
                    <span>Seamless Communication</span>
                    <span>Easy Management</span>
                    <span>High Retention</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage