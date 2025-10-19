import { X } from 'lucide-react';
import styles from './formModal.module.css';
import { useState, type ReactNode } from 'react';

interface FormModalProps {
  children: ReactNode,
  title: string,
}

const FormModal = ({ children, title }: FormModalProps) => {

  const [closeModalContainer, setCloseModalContainer] = useState(false);

  return (
    <div className={closeModalContainer ? styles.close : ''}>
      <div className={styles.modalOverlay}>
        <div className={styles.modalContainer}>
          <div className={styles.exitWrapper}>
            <h2>{title}</h2>
            <X
              className={styles.exit}
              onClick={() => setCloseModalContainer(prev => !prev)}
            />
          </div>
          <div className={styles.childrenWrapper}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormModal