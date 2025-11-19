import type { ReactNode } from "react";
import styles from './landlordPortal.module.css';

interface LandlordPortalProps {
  children: ReactNode,
}

const LandlordPortal = ({
  children
}: LandlordPortalProps) => {
  return (
    <div className={styles.wrapperContainer}>
      {children}
    </div>
  )
}

export default LandlordPortal