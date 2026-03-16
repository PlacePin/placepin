import { useGetAxios } from '../../../../../hooks/useGetAxios';
import styles from './propertyWorkOrdersList.module.css';

interface WorkOrder {
  _id: string;
  tradesmanName: string;
  unit: string;
  tradesmanType: string;
  date: string;
  retainer: boolean;
}

interface PropertyWorkOrdersListProps {
  landlordId: string,
  propertyId: string,
}

const PropertyWorkOrdersList = ({
  landlordId,
  propertyId,
}: PropertyWorkOrdersListProps) => {

  const { data: workOrders, error } = useGetAxios(
    `api/workorders/${landlordId}/${propertyId}`,
    undefined,
    [landlordId, propertyId]
  );

  const allWorkOrders: WorkOrder[] = Array.isArray(workOrders) ? workOrders : [];

  if (error) return <p>Error loading work orders</p>;

  return (
    <section className={styles.paymentSection}>
      <h3>Work Orders</h3>
      <div className={styles.paymentContainer}>
        <table className={styles.workOrdersTable}>
          <thead>
            <tr>
              <th>Tradesman</th>
              <th>Unit</th>
              <th>Trade</th>
              <th>Start Date</th>
              <th>Retainer</th>
            </tr>
          </thead>
          <tbody>
            {allWorkOrders.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.emptyMessage}>
                  No work orders found
                </td>
              </tr>
            ) : (
              allWorkOrders.map((workOrder) => (
                <tr key={workOrder._id}>
                  <td>{workOrder.tradesmanName}</td>
                  <td>{workOrder.unit}</td>
                  <td>{workOrder.tradesmanType}</td>
                  <td>{new Date(workOrder.date).toLocaleDateString()}</td>
                  <td>{workOrder.retainer ? 'Yes' : 'No'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default PropertyWorkOrdersList