import { useState } from 'react';
import PrimaryButton from '../../buttons/PrimaryButton';
import styles from './reviewUpdateReceiptCard.module.css';

interface ReviewUpdateReceiptCardProps {
  openReceipts: () => void;
}

const ReviewUpdateReceiptCard = ({
  openReceipts
}: ReviewUpdateReceiptCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <section>
        <div
          className={styles.cardContainer}
          onMouseEnter={() => setIsHovered(prev => !prev)}
          onMouseLeave={() => setIsHovered(prev => !prev)}
        >
          {/* Animated background gradient */}
          <div className={styles.backgroundGradient} />

          {/* Floating particles effect */}
          <div className={styles.particle1} />
          <div className={styles.particle2} />

          <div className={styles.content}>
            {/* Header */}
            <div className={styles.header}>
              <h2 className={styles.title}>Review & Update</h2>
              <p className={styles.subtitle}>
                Manage and edit your existing receipts
              </p>
            </div>

            {/* Image Container */}
            <div className={styles.imageContainer}>
              {/* Glow effect behind image */}
              <div className={`${styles.imageGlow} ${isHovered ? styles.imageGlowActive : ''}`} />

              {/* Image wrapper with animation */}
              <div className={styles.imageWrapper}>
                <img
                  src='/receipt.png'
                  width={100}
                  height={100}
                  alt="Review receipts icon"
                  className={styles.image}
                  style={{
                    transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                  }}
                />
              </div>

              {/* Decorative elements */}
              <img
                src='/thinking.png'
                className={styles.decorativeDot1}
              />
            </div>

            {/* Supportive text */}
            <div className={styles.supportText}>
              <p>
                View, edit, and manage all your receipts.<br />
                Keep everything accurate and up-to-date.
              </p>
            </div>

            {/* Button */}
            <div className={styles.buttonWrapper}>
              <PrimaryButton
                title="View Receipts"
                onClick={openReceipts}
              />
            </div>
            {/* Subtle hint text */}
            {
              /* <div className={styles.hintText}>
                   <p>
                     <svg className={styles.infoIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.         828 15H9v-2.828l8.586-8.586z" />
                     </svg>
                     Quick edit and delete options available
                   </p>
                 </div>
              */
            }
          </div>
        </div>
      </section>
    </>
  );
};

export default ReviewUpdateReceiptCard;