
import styles from './unauthorizedError.module.css'

const UnauthorizedError = () => {
  return (
    <div className={styles.errorContainer}>
    <h1>401 - unauthorized access</h1>
      <p>you do not have permission to view this page using the credentials supplied.</p>
  </div>
  )
}

export default UnauthorizedError