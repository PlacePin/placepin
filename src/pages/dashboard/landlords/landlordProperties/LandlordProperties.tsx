import { useState } from 'react';
import styles from './landlordProperties.module.css';
import AddPropertyModal from '../../../../components/modals/AddPropertyModal';
import { useGetAxios } from '../../../../hooks/useGetAxios';
import { Info, Plus } from 'lucide-react';
import PropertyPortal from './propertyPortal/PropertyPortal';
import PropertySummary from './propertyPortal/PropertySummary';
import PortalHeader from '../../../../components/headers/PortalHeader';
import PrimaryButton from '../../../../components/buttons/PrimaryButton';
import PropertyAnalytics from './propertyPortal/PropertyAnalytics';
import PropertyDetails from './propertyPortal/PropertyDetails';
import PropertyWorkOrdersList from './propertyPortal/PropertyWorkOrdersList';

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

  console.log('sp', selectedProperty)

  const stockPhotos = ['/townhouse.png', '/triplex.png', '/orangehouse.png']

  const properties = data.properties;
  const building = selectedProperty?.properties;
  const numberOfProperties = properties.length;
  let propertyId: string;
  let vacancyAmount: number;
  let propertyAddress: string;
  let buildingName = ''
  let resourceType = ''


  if (!selectedProperty || !building) {
    vacancyAmount = 0
    propertyId = ''
    propertyAddress = ''
  } else {
    vacancyAmount = building.numberOfUnits - selectedProperty.tenantCount
    propertyId = selectedProperty.properties._id
    const { number, street, streetType } = selectedProperty.properties.address
    propertyAddress = `${number} ${street} ${streetType}`
  }

  if (selectedProperty === null) {
    resourceType = ''
  } else if (selectedProperty.hasOwnProperty('properties')) {
    resourceType = 'Property'
  } else {
    resourceType = 'N/A'
  }

  const propertyCards = properties.map((property: any) => {

    const randomImg = Math.floor(Math.random() * stockPhotos.length)
    const address = `${property.properties.address.number} ${property.properties.address.street} ${property.properties.address.streetType}`
    const id = property.properties._id

    if (property.properties.name === undefined || property.properties.name.trim() === '') {
      buildingName = 'No Name'
    } else {
      buildingName = property.properties.name
    }

    return (
      <div
        key={id}
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
          <PortalHeader
            resourcePic={[
              <img src='/emptyProfile.png' />,
              <img src='/charts.png' />,
              <img src='/emptyProfile.png' />,
              <img src='/triplex.png' />,
              <img src='/emptyProfile.png' />,
              <img src='/groupPhoto.png' />,
              <img src='/housing.jpg' />
            ]}
            numberOfResources={numberOfProperties}
            resourceName={building.name || 'No Name'}
            resourceId={propertyId}
            resourceType={resourceType}
            onClose={() => setSelectedProperty(null)}
          />
          <div className={styles.portalBody}>
            <PropertySummary
              residents={selectedProperty.tenantCount}
              numberOfUnits={building.numberOfUnits}
              vacancy={vacancyAmount}
              address={propertyAddress}
            />
            <div className={styles.portalMainSection}>
              <PropertyAnalytics />
              <PropertyDetails />
              <PropertyWorkOrdersList />
            </div>
          </div>
        </PropertyPortal>
      ) : numberOfProperties
        ? (
          <div className={styles.container}>
            <div className={styles.headerWrapper}>
              <h2>Properties</h2>
              <PrimaryButton
                title={'Add Property'}
                onClick={() => setShowAddPropertyModal(prev => !prev)}
                icon={<Plus />}
              />
            </div>
            <div className={styles.propertyCardsContainer}>
              {propertyCards}
            </div>
            {showAddPropertyModal && (
              <AddPropertyModal
                onClose={() => setShowAddPropertyModal(prev => !prev)}
              />
            )}
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