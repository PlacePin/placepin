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

  function getTenantRating(onTimePercentage: number, totalPayments: number) {
    if (totalPayments < 3) return 'Thin File';
    if (onTimePercentage >= 90) return 'Excellent';
    if (onTimePercentage >= 70) return 'Good';
    return 'Risky';
  }

  const tenantPaymentTrackRecord = tenants.map((tenant: any) => {
    const payments = tenant.rentPayment || [];
    const totalPayments = payments.length;
    const lastPayment = payments[payments.length - 1];

    if (totalPayments === 0) {
      return {
        fullName: firstNameLastInitial(tenant.fullName),
        lastPayment: null,
        rentDueDate: null,
        onTimePercentage: null,
        totalPayments: 0,
        isLate: false,
        rating: 'Thin File'
      };
    }

    const onTimeCount = payments.filter((payment: any) => {
      const paidDate = new Date(payment.monthPaid);
      const dueDate = new Date(payment.rentDueDate);
      paidDate.setHours(0, 0, 0, 0);
      dueDate.setHours(0, 0, 0, 0);
      return paidDate <= dueDate;
    }).length;

    const onTimePercentage = payments.length === 0
      ? 0
      : (onTimeCount / payments.length) * 100;

    const lastPaidDate = new Date(lastPayment.monthPaid);
    const lastDueDate = new Date(lastPayment.rentDueDate);
    lastPaidDate.setHours(0, 0, 0, 0);
    lastDueDate.setHours(0, 0, 0, 0);

    return {
      fullName: firstNameLastInitial(tenant.fullName),
      lastPayment: lastPayment.monthPaid,
      rentDueDate: lastPayment.rentDueDate,
      onTimePercentage,
      totalPayments,
      isLate: lastPaidDate > lastDueDate,
      rating: getTenantRating(onTimePercentage, totalPayments)
    };
  });

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
            <PaymentReliability tenantPaymentTrackRecord={tenantPaymentTrackRecord} />
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