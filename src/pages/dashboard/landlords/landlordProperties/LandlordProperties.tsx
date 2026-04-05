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
import townhouse from '../../../../assets/townhouse.png';
import triplex from '../../../../assets/triplex.png';
import orangehouse from '../../../../assets/orangehouse.png';

const LandlordProperties = () => {

  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  const { data, error } = useGetAxios(`/api/landlords/properties`);

  if (error) {
    return <div>{"Something went wrong, but don't panic, we'll fix it!"}</div>
  }

  if (!data) {
    return <div></div>;
  }

  const stockPhotos = [townhouse, triplex, orangehouse]

  const properties = data.properties;
  const building = selectedProperty?.properties;
  const numberOfProperties = properties.length;
  let landlordId: string;
  let propertyId: string;
  let vacancyAmount: number;
  let propertyAddress: string;
  let buildingName = '';
  let resourceType = '';
  let outstandingPrincipal = 0;
  let mortgage = 0;
  let interestRate = 0;
  let projectedEquity = 0;
  let lotSize = 0;
  let trashPickup = '';
  let electricianLastUpdate: Date | null;
  let boilerLastUpdated: Date | null;
  let closestPublicCommutes = '';
  let averageUnitSize = 0;

  if (!selectedProperty || !building) {
    vacancyAmount = 0;
    propertyId = '';
    propertyAddress = '';
    landlordId = '';
    electricianLastUpdate = null;
    boilerLastUpdated = null;
  } else {
    vacancyAmount = building.numberOfUnits - selectedProperty.tenantCount
    propertyId = selectedProperty.properties._id;
    landlordId = selectedProperty._id;
    const { street } = selectedProperty.properties.address;
    propertyAddress = `${street}`;
    outstandingPrincipal = selectedProperty.properties.propertyDetails?.financials?.outstandingPrincipal;
    mortgage = selectedProperty.properties.propertyDetails?.financials?.mortgage;
    interestRate = selectedProperty.properties.propertyDetails?.financials?.interestRate;
    projectedEquity = selectedProperty.properties.propertyDetails?.financials?.projectedEquity;
    lotSize = selectedProperty.properties.propertyDetails?.lotSize;
    trashPickup = selectedProperty.properties.propertyDetails?.trashPickup;
    electricianLastUpdate = selectedProperty.properties.propertyDetails?.electricianLastUpdate;
    boilerLastUpdated = selectedProperty.properties.propertyDetails?.boilerLastUpdated;
    closestPublicCommutes = selectedProperty.properties.propertyDetails?.closestPublicCommutes;
    averageUnitSize = selectedProperty.properties.propertyDetails?.averageUnitSize;
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
    const address = `${property.properties.address.street}`
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

  const realEstate = properties.map((property: any) => {
    return property.profilePic ? (
      <img
        src={`${property.profilePic}`}
        alt='Housing Profile Pic'
        onClick={() => setSelectedProperty(property)}
      />
    ) : (
      <img
        className={styles.picContainers}
        onClick={() => setSelectedProperty(property)}
        src={townhouse}
      />
    )
  })

  return (
    <>
      {selectedProperty ? (
        <PropertyPortal>
          <PortalHeader
            resourcePic={realEstate}
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
              landlordId={landlordId}
              propertyId={propertyId}
            />
            <div className={styles.portalMainSection}>
              <PropertyAnalytics
                outstandingPrincipal={outstandingPrincipal}
                mortgage={mortgage}
                interestRate={interestRate}
                projectedEquity={projectedEquity}
              />
              <PropertyDetails
                lotSize={lotSize}
                trashPickup={trashPickup}
                electricianLastUpdate={electricianLastUpdate}
                boilerLastUpdated={boilerLastUpdated}
                closestPublicCommutes={closestPublicCommutes}
                averageUnitSize={averageUnitSize}
              />
              <PropertyWorkOrdersList
                landlordId={landlordId}
                propertyId={propertyId}
              />
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