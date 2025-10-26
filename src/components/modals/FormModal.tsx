import { X } from 'lucide-react';
import styles from './formModal.module.css';
import { type ReactNode } from 'react';

interface FormModalProps {
  children: ReactNode,
  title: string,
  onClose?: () => void,
}

const FormModal = ({ children, title, onClose }: FormModalProps) => {

  return (
    <div
      className={styles.modalOverlay}
      onClick={onClose}
    >
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.exitWrapper}>
          <h2>{title}</h2>
          <X
            className={styles.exit}
            onClick={onClose}
          />
        </div>
        <div className={styles.childrenWrapper}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default FormModal