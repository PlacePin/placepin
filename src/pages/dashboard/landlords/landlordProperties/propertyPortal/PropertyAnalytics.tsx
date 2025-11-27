import Tooltip from '../../../../../components/tooltips/Tooltip';
import styles from './propertyAnalytics.module.css';

const PropertyAnalytics = () => {
  return (
    <div>
      <Tooltip
        text={'This is an estimate.'}
        position={'top'}
      >
        Outstanding Principal
      </Tooltip>
      <div>Mortgage</div>
      <div>Interest Rate</div>
      <Tooltip
        text={'This is an estimate.'}
        position={'top'}
      >
        Projected Equity
      </Tooltip>
    </div>
  );
};

export default PropertyAnalytics;
