import { useState } from 'react';
import styles from './landlordTenantInsights.module.css'
import InviteTenantModal from '../../../../components/modals/InviteTenantModal';
import { useGetAxios } from '../../../../hooks/useGetAxios';
import StatsOverviewCard from './StatsOverviewCard';
import PaymentReliability from './PaymentReliability';
import { firstNameLastInitial } from '../../../../utils/stringUtils';
import ProfitLossChart from '../../../../components/charts/ProfitLossChart';

const LandlordTenantInsights = () => {

  const [showInviteModal, setShowInviteModal] = useState(false);

  const { data, error } = useGetAxios(`/api/landlords/tenants`);

  if (error) {
    return <div>{"Something went wrong, but don't panic, we'll fix it!"}</div>
  }

  // Todo: Fix this so skeleton loading or cache so null doesn't render on each re-render

  if (!data) {
    return <div>{'Loading Data'}</div>
  }

  const tenants = data?.tenants ?? [];
  const numberOfTenants = tenants.length;
  const tenantNames = tenants.map((tenant: { fullName: string }) => {
    return firstNameLastInitial(tenant.fullName)
  })

  let totalExpectedIncome = 0;
  let totalExpenses = 0;

  tenants.forEach((tenant: any) => {
    totalExpectedIncome += tenant.rentAmountExpected
    totalExpenses += tenant.expenses
  })

  console.log('data', tenants)

  return (
    <>
      {numberOfTenants
        ?
        <div className={styles.container}>
          <h2>Tenant Insights</h2>
          <div>
            <StatsOverviewCard
              numberOfTenants={numberOfTenants}
              totalExpectedIncome={totalExpectedIncome}
              totalExpenses={totalExpenses}
            />
          </div>
          <div className={styles.finances}>
            <PaymentReliability tenants={tenantNames} />
            <ProfitLossChart
              totalExpectedIncome={totalExpectedIncome}
              totalExpenses={totalExpenses}
            />
          </div>
        </div>
        :
        <div>
          <h2 className={styles.noData}>No Data</h2>
          <div className={styles.noDataButtonContainer}>
            <button
              className={styles.button}
              onClick={() => setShowInviteModal(prev => !prev)}
            >
              Invite Tenants
            </button>
          </div>
          {showInviteModal && (
            <InviteTenantModal
              onClose={() => setShowInviteModal(prev => !prev)}
            />
          )}
        </div>
      }
    </>
  )
}

export default LandlordTenantInsights