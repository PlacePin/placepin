import styles from './tenantActivity.module.css';
import EngagementPatternsChart from '../../../../../components/charts/EngagementPatternsChart';
import MaintenanceRequestChart from '../../../../../components/charts/MaintenanceRequestChart';
import type { PerkPatterns } from '../../../../../interfaces/interfaces';
import { useCallback, useEffect, useRef, useState } from 'react';
import axiosInstance from '../../../../../utils/axiosInstance';
import { useAuth } from '../../../../../context/AuthContext';

interface TenantActivityProps {
  maintenanceRequest: Record<string, any>;
  perkPatterns: PerkPatterns;
  tenantId: string;
}

const TenantActivity = ({
  maintenanceRequest,
  perkPatterns,
  tenantId,
}: TenantActivityProps) => {

  const [payments, setPayments] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { accessToken } = useAuth();

  const fetchPayments = async (pageNum: number) => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const { data } = await axiosInstance.get(
        `api/landlords/tenants/${tenantId}/rent-payment-history`,
        {
          params: { page: pageNum, limit: 15 },
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )

      setPayments((prev: any) => [...prev, ...data.data]);
      setHasMore(pageNum < data.totalPages);

    } catch (err) {
      console.error(err);
      // Setup Sentry
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchPayments(page);
  }, [page]);

  useEffect(() => {
  setPayments([]);
  setPage(1);
  setHasMore(true);
}, [tenantId]);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastPaymentRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);


  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const availableYears = [currentYear, currentYear - 1, currentYear - 2];

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
        <div className={`${styles.defaultCardStyles} ${styles.payment}`}>
          <p className={styles.title}>Payment History</p>
          {payments.length === 0 && !isLoading ? (
            noPaymentHistory
          ) : (
            <>
              {payments.map((payment: any, index: number) => {
                const isLast = index === payments.length - 1;
                const content = (
                  <div key={index} className={styles.rentPayment}>
                    <p>
                      <span className={styles.rentAmount}>
                        {`$${payment.rentAmount.toLocaleString('en-US')}`}
                      </span>
                      {' a month Paid On: '}
                      <span className={styles.date}>
                        {new Date(payment.monthPaid).toLocaleDateString('en-US', {
                          timeZone: "UTC",
                        })}
                      </span>
                    </p>
                  </div>
                );
                if (isLast) {
                  return (
                    <div ref={lastPaymentRef} key={index}>
                      {content}
                    </div>
                  );
                }
                return content;
              })}
              {isLoading && <p>Loading more payments...</p>}
            </>
          )}
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