import { useState } from 'react';
import styles from './landlordMessaging.module.css'
import { Plus } from 'lucide-react';

const LandlordMessaging = () => {

  const [activeMessage, setActiveMessage] = useState<string[]>(["Isabella", "Calvin", "Kenji", "Ralph", "Aaron", "Yves", "Marcaine", "Mirthaud", "Caliyah"]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const people = activeMessage.map((person, i) => {
    return (
      <p
        key={i}
        className={`${styles.person} ${activeIndex === i ? styles.activeMessage : ""}`}
        onClick={() => setActiveIndex(i)}
      >
        {person}
      </p>
    )
  });

  return (
    <div>
      <h2 className={styles.title}>Messages</h2>
      <div className={styles.wrapper}>
        <div className={styles.leftContainer}>
          <div
            className={styles.composeContainer}
          >
            <p
              className={styles.compose}
            >
              <Plus />Compose
            </p>
          </div>
          <div
            className={styles.messagesList}
          >
            <p>{people}</p>
          </div>
        </div>
        <div
          className={styles.convo}
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