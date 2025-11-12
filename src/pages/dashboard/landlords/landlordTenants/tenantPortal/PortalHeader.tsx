import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import styles from './portalHeader.module.css';
import { capitalizeWords } from '../../../../../utils/stringUtils';

interface PortalHeaderProps {
  profilePic: any[],
  numberOfTenants: number,
  tenantName: string,
}

const PortalHeader = ({
  profilePic,
  numberOfTenants,
  tenantName,
}: PortalHeaderProps) => {

  const pics = profilePic.map((pic, i) => {
    return (
      <div
        key={i}
        className={styles.picContainers}
      >
        {pic}
      </div>
    )
  })

  return (
    <section className={styles.wrapper}>
      <div className={styles.tenantInfo}>
        <h3>{capitalizeWords(tenantName)} • Tenant</h3>
        <span>{numberOfTenants} Tenants</span>
      </div>
      <div
        className={styles.picWrapper}
      >
        <ChevronLeft
          size={24}
          className={styles.chevron}
        />
        {pics}
        <ChevronRight
          size={24}
          className={styles.chevron}
        />
      </div>
      <div className={styles.button}>
        <Plus size={24} />
        <span>
          Invite Tenant
        </span>
      </div>
    </section>
  )
}

export default PortalHeader