import styles from './tenantActivity.module.css';
import EngagementPatternsChart from '../../../../../components/charts/EngagementPatternsChart';
import MaintenanceRequestChart from '../../../../../components/charts/MaintenanceRequestChart';
import type { PerkPatterns } from '../../../../../interfaces/interfaces';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

const PAYMENTS_PER_PAGE = 5;

const MOBILE_COLLAPSE_MQ = '(max-width: 650px)';

interface TenantActivityProps {
  rentPayments: Record<string, any>[];
  maintenanceRequest: Record<string, any>;
  perkPatterns: PerkPatterns;
}

const TenantActivity = ({
  rentPayments,
  maintenanceRequest,
  perkPatterns,
}: TenantActivityProps) => {

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [paymentHistoryMobileOpen, setPaymentHistoryMobileOpen] = useState(true);
  const [isMobilePaymentCollapsible, setIsMobilePaymentCollapsible] = useState(false);
  const [paymentPage, setPaymentPage] = useState(1);

  const sortedPayments = [...rentPayments].reverse();
  const totalPaymentPages = Math.ceil(sortedPayments.length / PAYMENTS_PER_PAGE);
  const paginatedPayments = sortedPayments.slice(
    (paymentPage - 1) * PAYMENTS_PER_PAGE,
    paymentPage * PAYMENTS_PER_PAGE
  );

  useEffect(() => {
    const mobileQuery = window.matchMedia(MOBILE_COLLAPSE_MQ);
    const sync = () => setIsMobilePaymentCollapsible(mobileQuery.matches);
    sync();
    mobileQuery.addEventListener('change', sync);
    return () => mobileQuery.removeEventListener('change', sync);
  }, []);

  const availableYears = [currentYear, currentYear - 1, currentYear - 2];

  const rentPaymentsMapped = paginatedPayments.map((rentPayment, i) => {
    return (
      <div key={i} className={styles.rentPayment}>
        <p>
          <span className={styles.rentAmount}>
            {`$${rentPayment.rentAmount.toLocaleString('en-US')}`}
          </span>
          {' a month Paid On: '}
          <span className={styles.date}>
            {new Date(rentPayment.monthPaid).toLocaleDateString('en-US', {
              timeZone: "UTC",
            })}
          </span>
        </p>
      </div>
    )
  })

  const paginationControls = totalPaymentPages > 1 && (
    <div className={styles.paginationControls}>
      <button
        type="button"
        className={styles.paginationButton}
        onClick={() => setPaymentPage(prev => Math.max(1, prev - 1))}
        disabled={paymentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>
      <span className={styles.paginationInfo}>
        {paymentPage} / {totalPaymentPages}
      </span>
      <button
        type="button"
        className={styles.paginationButton}
        onClick={() => setPaymentPage(prev => Math.min(totalPaymentPages, prev + 1))}
        disabled={paymentPage === totalPaymentPages}
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )

  const noPaymentHistory = (
    <div className={styles.noPaymentHistoryWrapper}>
      <h2 className={styles.noPaymentHistoryText}>
        No Payment History Yet
      </h2>
    </div>
  )

  return (
    <div className={styles.activityWrapper}>
      <div className={styles.paymentMaintenance}>
        <div
          className={`${styles.defaultCardStyles} ${styles.payment} ${isMobilePaymentCollapsible && !paymentHistoryMobileOpen ? styles.paymentCollapsed : ''}`}
        >
          <div className={styles.paymentHeader}>
            <p className={styles.paymentTitle}>Payment History</p>
            {isMobilePaymentCollapsible && (
              <button
                type="button"
                className={styles.paymentToggle}
                aria-expanded={paymentHistoryMobileOpen}
                aria-controls="tenant-payment-history"
                onClick={() => setPaymentHistoryMobileOpen(prev => !prev)}
              >
                <ChevronDown
                  size={22}
                  className={`${styles.paymentChevron}${paymentHistoryMobileOpen ? ` ${styles.paymentChevronExpanded}` : ''}`}
                  aria-hidden
                />
                <span className={styles.paymentToggleLabel}>
                  {paymentHistoryMobileOpen ? 'Hide' : 'Show'} payment history
                </span>
              </button>
            )}
          </div>
          <div
            id="tenant-payment-history"
            className={styles.paymentPanel}
            hidden={isMobilePaymentCollapsible && !paymentHistoryMobileOpen}
          >
            {rentPayments.length ?
              <>
                {rentPaymentsMapped}
                {paginationControls}
              </> :
              noPaymentHistory
            }
          </div>
        </div>
        <div className={`${styles.defaultCardStyles} ${styles.maintenance}`}>
          <p className={styles.title}>Maintenance Request</p>
          <div className={styles.chartSection}>
            <MaintenanceRequestChart
              maintenanceRequest={maintenanceRequest}
            />
          </div>
        </div>
      </div>
      <div className={`${styles.defaultCardStyles} ${styles.engagement}`}>
        <div className={styles.titleWithFilter}>
          <p className={styles.title}>Engagement Patterns</p>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className={styles.yearSelect}
          >
            {availableYears.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <EngagementPatternsChart
          perkPatterns={perkPatterns}
          selectedYear={selectedYear}
        />
      </div>
    </div>
  )
}

export default TenantActivity