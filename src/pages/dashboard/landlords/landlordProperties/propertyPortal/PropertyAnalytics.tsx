import Tooltip from '../../../../../components/tooltips/Tooltip';
import styles from './propertyAnalytics.module.css';

const PropertyAnalytics = () => {
  return (
    <div className={styles.analyticsContainer}>
      <div className={styles.header}>
        <h4>
          Financials
        </h4>
      </div>
      <div className={styles.analyticsWrapper}>
        <div className={styles.sectionContainers}>
          <span>
            {'$800,000'}
          </span>
          <Tooltip
            text={'This is an estimate.'}
            position={'top'}
          >
            <p>Outstanding Principal</p>
          </Tooltip>
        </div>
        <div className={styles.sectionContainers}>
          <span>
            {'$4,000'}
          </span>
          <Tooltip
            text={'This is an estimate.'}
            position={'top'}
          >
            <p>Mortgage</p>
          </Tooltip>
        </div>
        <div className={styles.sectionContainers}>
          <span>
            {'3.75%'}
          </span>
          <p>
            Interest Rate
          </p>
        </div>
        <div className={styles.sectionContainers}>
          <span>
            {'$10,000'}
          </span>
          <Tooltip
            text={'This is an estimate.'}
            position={'top'}
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
