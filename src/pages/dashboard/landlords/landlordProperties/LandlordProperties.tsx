import { useState } from 'react';
import styles from './landlordProperties.module.css';
import AddPropertyModal from '../../../../components/modals/AddPropertyModal';
import { useGetAxios } from '../../../../hooks/useGetAxios';
import { Info } from 'lucide-react';

const LandlordProperties = () => {

  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);

  const { data, error } = useGetAxios(`/api/landlords/properties`);

  if (!data) {
    return <div></div>;
  }

  if (error) {
    return <div>{"Something went wrong, but don't panic, we'll fix it!"}</div>
  }

  const properties = data.properties
  let buildingName = ''

  const propertiesCards = properties.map((property: any, i: number) => {

    if(property.properties.name === undefined || property.properties.name.trim() === ''){
      buildingName = 'No Name'
    } else {
      buildingName = property.properties.name
    }

    return (
      <div
        key={i}
        className={styles.propertyCards}
      >
        <div
          className={styles.photoWrapper}
        >
          <img
            src='/emptyProfile.png'
            alt='tenant photo'
            width={150}
            height={200}
          />
        </div>
        <div
          className={styles.descriptionWrapper}
        >
          <p>
            {buildingName}
          </p>
          <button
            className={styles.infoButton}
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
      {properties.length
        ?
        <div className={styles.container}>
          <h2>Properties</h2>
          <div className={styles.propertyCardsContainer}>
            {propertiesCards}
          </div>
        </div>
        :
        <div className={styles.container}>
          <h2 className={styles.noData}>No Data</h2>
          <div className={styles.noDataButtonContainer}>
            <button
              className={styles.button}
              onClick={() => setShowAddPropertyModal(prev => !prev)}
            >
              Add Property
            </button>
          </div>
          {showAddPropertyModal && (
            <AddPropertyModal
              onClose={() => setShowAddPropertyModal(prev => !prev)}
            />
          )}
        </div>
      }
    </>
  )
}

export default LandlordProperties