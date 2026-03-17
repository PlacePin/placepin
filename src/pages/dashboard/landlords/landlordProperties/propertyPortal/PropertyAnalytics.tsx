import Tooltip from '../../../../../components/tooltips/Tooltip';
import styles from './propertyAnalytics.module.css';

interface PropertyAnalyticsProps {
  outstandingPrincipal: number,
  mortgage: number,
  interestRate: number,
  projectedEquity: number,
}

const PropertyAnalytics = ({
  outstandingPrincipal,
  mortgage,
  interestRate,
  projectedEquity,
}: PropertyAnalyticsProps) => {
  return (
    <div className={styles.analyticsContainer}>
      <div className={styles.header}>
        <h4>
          Financials
        </h4>
      </div>
      <div className={styles.analyticsWrapper}>
        <div className={styles.sectionContainers}>
          <span className={styles.numbers}>
            {outstandingPrincipal ? `$${outstandingPrincipal.toLocaleString('en-US')}` : 'N/A'}
          </span>
          <Tooltip
            text={'This is an estimate.'}
            position={'bottom'}
          >
            <p>Outstanding Principal</p>
          </Tooltip>
        </div>
        <div className={styles.sectionContainers}>
          <span className={styles.numbers}>
            {mortgage ? `$${mortgage.toLocaleString('en-US')}` : 'N/A'}
          </span>
          <Tooltip
            text={'This is an estimate.'}
            position={'bottom'}
          >
            <p>Mortgage</p>
          </Tooltip>
        </div>
        <div className={styles.sectionContainers}>
          <span className={styles.numbers}>
            {interestRate ? `${interestRate}%` : 'N/A'}
          </span>
          <p>
            Interest Rate
          </p>
        </div>
        <div className={styles.sectionContainers}>
          <span className={styles.numbers}>
            {projectedEquity ? `${projectedEquity.toLocaleString('en-US')}` : 'N/A'}
          </span>
          <Tooltip
            text={'This is an estimate.'}
            position={'bottom'}
          >
            <p>
              Projected Equity
            </p>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default PropertyAnalytics;
