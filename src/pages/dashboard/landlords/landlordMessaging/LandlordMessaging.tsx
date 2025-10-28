import { useState } from 'react';
import styles from './landlordMessaging.module.css'

const LandlordMessaging = () => {

  const [activeTab, setActiveTab] = useState<string[]>([]);

  return (
    <div>
      <h2 className={styles.title}>Messages</h2>
      <div className={styles.wrapper}>
        <div
          className={styles.messagesContainer}
        >
          <p
          className={styles.startMessage}
          >
            Compose
            </p>
          {/* <div className={styles.noDataButtonContainer}>
          <button className={styles.button}>Start a message</button>
        </div> */}
        </div>
        <div
          className={styles.compose}
        >
        </div>
        <div
        className={styles.promo}
        >

        </div>
      </div>
    </div>
  )
}

export default LandlordMessaging