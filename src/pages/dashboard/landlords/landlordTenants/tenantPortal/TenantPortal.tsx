import type { ReactNode } from "react";
import styles from './tenantPortal.module.css';

interface TenantPortalProps {
  children: ReactNode,
}

const TenantPortal = ({
  children
}: TenantPortalProps) => {
  return (
    <div className={styles.wrapperContainer}>
      {children}
    </div>
  )
}

export default TenantPortal