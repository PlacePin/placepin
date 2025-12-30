import { Info, User } from 'lucide-react';
import styles from './landlordMaintenance.module.css';
import { capitalizeWords } from '../../../../utils/stringUtils';
import { useGetAxios } from '../../../../hooks/useGetAxios';
import { useState } from 'react';
import TradesmenDetails from '../../../../components/modals/TradesmenDetails';

const LandlordMaintenance = () => {

  const [selectedTradesmen, setSelectedTradesmen] = useState<any>(null)

  const { data, error } = useGetAxios(`/api/landlords/tradesmen`);

  // Todo: Fix this to skeleton loading or cache so null doesn't render on each re-render
  if (!data) {
    return <div></div>;
  }

  if (error) {
    return <div>{"Something went wrong, but don't panic, we'll fix it!"}</div>
  }

  const tradesmen = data.tradesmen
  const numberOfTradesmen = tradesmen.length

  const tradesmenCards = tradesmen.map((tradesmen: any) => {
    return (
      <div
        key={tradesmen._id}
        className={styles.tradesmenCards}
      >
        <User
          width={150}
          height={200}
          strokeWidth={1}
        />
        <div
          className={styles.descriptionWrapper}
        >
          <p>
            {capitalizeWords(tradesmen.fullName)}
          </p>
          <button
            className={styles.infoButton}
            onClick={() => setSelectedTradesmen(tradesmen)}
          >
            <Info
              size={18}
              className={styles.infoIcon}
            />
            Info
          </button>
        </div>
      </div>
    )
  })

  return (
    <>
      <div className={styles.container}>
        <h2>Hire a Tradesman</h2>
        {numberOfTradesmen ? (
          <>
            <div className={styles.tradesmenCardsContainer}>
              {tradesmenCards}
            </div>
            {selectedTradesmen && (
              <TradesmenDetails tradesmen={selectedTradesmen} />
            )}
          </>
        ) : (
          <div className={styles.noDataButtonContainer}>
            <button className={styles.button}>Find Tradesman</button>
          </div>
        )}
      </div>
    </>
  )
}

export default LandlordMaintenance
