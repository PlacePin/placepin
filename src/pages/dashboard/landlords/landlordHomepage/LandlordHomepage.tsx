import styles from './landlordHomepage.module.css';
import ActiveTenantsCard from '../../../../components/cards/landlord/ActiveTenantsCard';
import PerkAdoptionCard from '../../../../components/cards/landlord/PerkAdoptionCard';
import StatsKPICard from '../../../../components/cards/landlord/StatsKPICard';
import RetentionHealthMeter from '../../../../components/cards/landlord/RetentionHealthMeter';
import InviteTenantModal from '../../../../components/modals/InviteTenantModal';
import { useState } from 'react';
import { useGetAxios } from '../../../../hooks/useGetAxios';

const LandlordHomepage = () => {

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showNudgeModal, setShowNudgeModal] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);

  const { data, error } = useGetAxios(`/api/users`)

  if(!data){
    return <div>{'Loading Data'}</div>
  }

  if(error){
    return <div>{"Something went wrong, but don't panic, we'll fix it!"}</div>
  }

  const properties = data.user.properties
  let tenantsWithSubscription = 0
  
  properties.forEach((property: any) => {
    tenantsWithSubscription += property.tenants.length
  })
  
  const handleInvite = () => {
    setShowInviteModal(prev => !prev)
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
              numberOfTenants={tenantsWithSubscription}
              tenantsWithSubscription={tenantsWithSubscription}
            />
          </StatsKPICard>
          <StatsKPICard
            title={'Perk Adoption'}
            ctaText={'Tip: Tenants using perks renew 20% more often.'}
            handleClick={handleNudge}
          >
            <PerkAdoptionCard
              numberOfTenants={tenantsWithSubscription}
              tenantsUsingPerksPercentage={0}
              mostUsedPerk={''}
            />
          </StatsKPICard>
          <StatsKPICard
            title={'Retention Health Meter'}
            ctaText={'Tip: Help keep a tenant longer with a perk!'}
            handleClick={handleGift}
          >
            <RetentionHealthMeter
              numberOfTenants={tenantsWithSubscription}
              retentionHealth='Medium'
              value={50}
            />
          </StatsKPICard>
        </div>
      </div>
      {showInviteModal && (
        <InviteTenantModal
          onClose={() => setShowInviteModal(prev => !prev)}
        />
      )}
    </div>
  )
}

export default LandlordHomepage