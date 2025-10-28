import { useState } from 'react';
import styles from './landlordMessaging.module.css'
import { Plus } from 'lucide-react';

const LandlordMessaging = () => {

  const [activeMessage, setActiveMessage] = useState<string[]>(["Isabella", "Calvin", "Kenji", "Ralph", "Aaron", "Yves", "Marcaine", "Mirthaud", "Caliyah"]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  let convoWith = ''

  const people = activeMessage.map((person, i) => {

    convoWith = activeIndex !== null ? activeMessage[activeIndex] : '';

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
    <div className={styles.container}>
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
            {people}
          </div>
        </div>
        <div
          className={styles.convo}
        >
          <h3
            className={styles.header}
          >
            {convoWith}
          </h3>
          <div
            className={styles.dialog}
          >
            Message Convo
          </div>
          <div
            className={styles.messageText}
          >
            <input
              type='text'
              className={styles.inputMessage}
              placeholder='Write a Message...'
            />
            <button
              className={styles.button}
            >
              Send
            </button>
          </div>
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