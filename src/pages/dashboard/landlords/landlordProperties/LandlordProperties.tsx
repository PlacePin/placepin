import { useState } from 'react';
import styles from './landlordProperties.module.css';
import AddPropertyModal from '../../../../components/modals/AddPropertyModal';
import { useGetAxios } from '../../../../hooks/useGetAxios';
import { Info } from 'lucide-react';
import PropertyPortal from './propertyPortal/PropertyPortal';
import PropertySummary from './propertyPortal/PropertySummary';
import PortalHeader from '../../../../components/headers/PortalHeader';

const LandlordProperties = () => {

  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  const { data, error } = useGetAxios(`/api/landlords/properties`);

  if (!data) {
    return <div></div>;
  }

  if (error) {
    return <div>{"Something went wrong, but don't panic, we'll fix it!"}</div>
  }

  console.log(selectedProperty)

  const stockPhotos = ['/townhouse.png', '/triplex.png', '/orangehouse.png']

  const properties = data.properties
  const numberOfProperties = properties.length
  let buildingName = ''

  const propertyCards = properties.map((property: any) => {

    const randomImg = Math.floor(Math.random() * stockPhotos.length)
    const address = `${property.properties.address.number} ${property.properties.address.street} ${property.properties.address.streetType}`
    const addressId = property.properties.address._id

    if (property.properties.name === undefined || property.properties.name.trim() === '') {
      buildingName = 'No Name'
    } else {
      buildingName = property.properties.name
    }

    return (
      <div
        key={addressId}
        className={styles.propertyCards}
      >
        <div
          className={styles.photoWrapper}
        >
          <img
            src={stockPhotos[randomImg]}
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
          <p>
            {address}
          </p>
          <button
            className={styles.infoButton}
            onClick={() => setSelectedProperty(property)}
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
      {selectedProperty ? (
        <PropertyPortal>
          <PortalHeader resourcePic={['']} numberOfResources={0} resourceName={'The Palace'} resourceId={''} onClose={function (): void {
            throw new Error('Function not implemented.');
          }} />
          <PropertySummary />
        </PropertyPortal>
      ) : numberOfProperties
        ? (
          <div className={styles.container}>
            <h2>Properties</h2>
            <div className={styles.propertyCardsContainer}>
              {propertyCards}
            </div>
          </div>
        ) : (
          <div>
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
        )
      }
    </>
  )
}

export default LandlordProperties