import styles from './landlordHomepage.module.css';
import ActiveTenantsCard from '../../../../components/cards/landlord/ActiveTenantsCard';
import PerkAdoptionCard from '../../../../components/cards/landlord/PerkAdoptionCard';
import StatsKPICard from '../../../../components/cards/landlord/StatsKPICard';
import RetentionHealthMeter from '../../../../components/cards/landlord/RetentionHealthMeter';
import InviteTenantModal from '../../../../components/modals/InviteTenantModal';
import { useState } from 'react';

const LandlordHomepage = () => {

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showNudgeModal, setShowNudgeModal] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);

  const handleInvite = () => {
    console.log('Make modal popup to send email invite!')
    setShowInviteModal(true)
  }

  const handleNudge = () => {
    console.log("Make a modal to nudge a tenant that hasn't used a perk in awhile!")
  }

  const handleGift = () => {
    console.log('Make a modal to gift a perk to a tenant!')
  }

  return (
    <div className={styles.landlordHomepageContainer}>
      <div className={styles.statsContainer}>
        <h3 className={styles.level3Header}>Stats / KPI's</h3>
        <div className={styles.statsCards}>
          <StatsKPICard
            title={'Active Tenants'}
            ctaText={'Invite Tenants'}
            handleClick={handleInvite}
          >
            <ActiveTenantsCard
              numberOfTenants={0}
              tenantsWithSubscription={0}
            />
          </StatsKPICard>
          <StatsKPICard
            title={'Perk Adoption'}
            ctaText={'Tip: Tenants using perks renew 20% more often.'}
            handleClick={handleNudge}
          >
            <PerkAdoptionCard
              numberOfTenants={0}
              tenantsUsingPerksPercentage={0}
              mostUsedPerk={''}
            />
          </StatsKPICard>
          <StatsKPICard
            title={'Retention Health Meter'}
            ctaText={'Tip: Help keep a tenant longer with a perk!'}
            handleClick={handleGift}
          >
            <RetentionHealthMeter numberOfTenants={0} retentionHealth='High' value={50}/>
          </StatsKPICard>
        </div>
      </div>
      {showInviteModal && <InviteTenantModal />}
    </div>
  )
}

export default LandlordHomepage