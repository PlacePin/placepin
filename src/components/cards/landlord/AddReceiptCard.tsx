import { useState } from 'react';
import PrimaryButton from '../../buttons/PrimaryButton';
import styles from './addReceiptCard.module.css';
import AddReceiptModal from '../../modals/AddReceiptModal';

interface AddReceiptCardProp {
  properties: Record<string, any>[]
}

const AddReceiptCard = ({
  properties
}: AddReceiptCardProp) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showCreateReceipt, setShowCreateReceipt] = useState(false)

  return (
    <section>
      <div
        className={styles.cardContainer}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Animated background gradient */}
        <div className={styles.backgroundGradient} />

        {/* Floating particles effect */}
        <div className={styles.particle1} />
        <div className={styles.particle2} />

        <div className={styles.content}>
          {/* Header */}
          <div className={styles.header}>
            <h2 className={styles.title}>Add Receipts</h2>
            <p className={styles.subtitle}>
              Upload and organize your receipts instantly
            </p>
          </div>

          {/* Image Container */}
          <div className={styles.imageContainer}>
            {/* Glow effect behind image */}
            <div className={`${styles.imageGlow} ${isHovered ? styles.imageGlowActive : ''}`} />

            {/* Image wrapper with animation */}
            <div className={styles.imageWrapper}>
              <img
                src='/till.png'
                width={100}
                height={100}
                alt="Receipt icon"
                className={styles.image}
                style={{
                  transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                }}
              />
            </div>

            {/* Decorative elements */}
            <img
              src='/coin.png'
              className={styles.decorativeDot1}
            />
            <img
              src='/dollar.png'
              className={styles.decorativeDot2} />
          </div>

          {/* Supportive text */}
          <div className={styles.supportText}>
            <p>
              Digitize your paper receipts in seconds.<br />
              Keep your finances organized effortlessly.
            </p>
          </div>

          {/* Button */}
          <div className={styles.buttonWrapper}>
            <PrimaryButton
              title="Add Receipts"
              onClick={() => { setShowCreateReceipt(prev => !prev) }}
            />
          </div>

          {/* Subtle hint text */}
          {/* <div className={styles.hintText}>
          <p>
            <svg className={styles.infoIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Supports JPG, PNG, and PDF formats
          </p>
        </div> */}
        </div>
      </div>
      {showCreateReceipt && (
        <AddReceiptModal
          onClose={() => setShowCreateReceipt(prev => !prev)}
          properties={properties}
        />
      )}
    </section>
  );
};

export default AddReceiptCard;