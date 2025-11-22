import type { ReactNode } from "react";
import styles from './propertyPortal.module.css';

interface PropertyPortalProps {
  children: ReactNode,
}

const PropertyPortal = ({
  children
}: PropertyPortalProps) => {
  return (
    <div className={styles.wrapperContainer}>
      {children}
    </div>
  )
}

export default PropertyPortal