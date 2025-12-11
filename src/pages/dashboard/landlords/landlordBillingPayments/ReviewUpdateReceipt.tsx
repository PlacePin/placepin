import { useState } from 'react';
import styles from './reviewUpdateReceipt.module.css';
import PrimaryButton from '../../../../components/buttons/PrimaryButton';

interface ReviewUpdateReceiptProps {
  onClose: () => void;
  receiptInfo: Record<string, any>[]
}

const ReviewUpdateReceipt = ({
  onClose,
  receiptInfo,
}: ReviewUpdateReceiptProps) => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedProperty, setSelectedProperty] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // console.log('receipt info', receiptInfo)

  const propertyList = receiptInfo.map((property) => {
    return {
      id: property._id,
      address: `${property.address.street}, 
              ${property.address.city} 
              ${property.address.state}, 
              ${property.address.zip}`,
      taxYears: property.taxYears.map((year: { year: any; }) => year.year),
      taxYearsData: property.taxYears.map((yearData: { year: any; receipts: any[]; }) => ({
        year: yearData.year,
        receipts: yearData.receipts.map(receipt => ({
          id: receipt._id,
          amount: parseFloat(receipt.amount),
          date: receipt.date,
          expenseCategory: receipt.expenseCategory,
          paymentMethod: receipt.paymentMethod,
          description: receipt.description,
        }))
      }))
    }
  });

  // Filter receipts based on selected property and year
  const getReceiptsForSelection = () => {
    if (!selectedProperty || !selectedYear) return [];

    const property = propertyList.find(property => property.id === selectedProperty);
    if (!property) return [];

    const yearData = property.taxYearsData.find((taxYear: { year: any; }) => taxYear.year.toString() === selectedYear);
    return yearData?.receipts || [];
  };

  const receipts = getReceiptsForSelection();

  // Get the currently selected property's tax years
  const selectedPropertyData = propertyList.find(property => property.id === selectedProperty);
  const availableTaxYears = selectedPropertyData?.taxYears || [];

  console.log('list', propertyList)

  const expenses = [
    { category: 'Advertising', values: Array(12).fill(0) },
    { category: 'Auto and Travel', values: Array(12).fill(0) },
    { category: 'Cleaning and Maintenance', values: [360, 240, 300, 40, 40, 150, 40, 40, 40, 40, 40, 0] },
    { category: 'Commissions', values: Array(12).fill(0) },
    { category: 'Insurance', values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3312] },
    { category: 'Legal and Other Professional Fees', values: Array(12).fill(0) },
    { category: 'Management Fees', values: [0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0] },
    { category: 'Mortgage Interest', values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 21619.54] },
    { category: 'Other Interest', values: Array(12).fill(0) },
    { category: 'Repairs', values: [0, 494.12, 182.16, 0, 2975, 1624.33, 44.72, 0, 1200, 30, 131.85, 435] },
    { category: 'Supplies', values: [0, 0, 38.97, 0, 0, 239.99, 59.52, 75.87, 0, 0, 0, 0] },
    { category: 'Taxes', values: Array(12).fill(0) },
    { category: 'Utilities', values: [1166.75, 505, 234.25, 1947.75, 0, 1308.50, 0, 0, 0, 1962.75, 1308.50, 553.94] },
  ];

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const calculateTotal = (values) => values.reduce((sum, val) => sum + val, 0);

  const handleReceiptClick = (receipt) => {
    setSelectedReceipt(receipt);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>
          Rental Property Statement
        </h3>
        <PrimaryButton
          onClick={onClose}
          title={'← Back to Menu'}
        />
      </div>
      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Property Address</label>
          <select
            value={selectedProperty}
            onChange={(e) => {
              setSelectedProperty(e.target.value);
              // Reset tax year when property changes
              const newProperty = propertyList.find(list => list.id === e.target.value);
              if (newProperty && newProperty.taxYears.length > 0) {
                setSelectedYear(newProperty.taxYears[0].toString());
              }
            }}
            className={styles.select}
          >
            <option value="">Select a property</option>
            {propertyList.map(property => (
              <option
                key={property.id}
                value={property.id}
              >
                {property.address}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Tax Year</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className={styles.select}
            disabled={!selectedProperty || availableTaxYears.length === 0}
          >
            {availableTaxYears.length === 0 ? (
              <option value="">No tax years available</option>
            ) : (
              availableTaxYears.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))
            )}
          </select>
        </div>
      </div>
      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Excel Sheet */}
        <div className={styles.excelContainer}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.headerRow}>
                  <th className={`${styles.headerCell} ${styles.stickyColumn}`}>
                    Expenses
                  </th>
                  <th className={styles.headerCell}>
                    Totals
                  </th>
                  {months.map((month, idx) => (
                    <th key={month} className={`${styles.headerCell} ${idx >= 8 ? styles.futureMonth : ''}`}>
                      {month}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense, rowIdx) => (
                  <tr key={expense.category} className={rowIdx % 2 === 0 ? styles.evenRow : styles.oddRow}>
                    <td className={`${styles.cell} ${styles.categoryCell} ${styles.stickyColumn}`}>
                      {expense.category}
                    </td>
                    <td className={`${styles.cell} ${styles.totalCell}`}>
                      ${calculateTotal(expense.values).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    {expense.values.map((value, monthIdx) => (
                      <td
                        key={monthIdx}
                        className={`${styles.cell} ${styles.valueCell} ${monthIdx >= 8 ? styles.futureMonth : ''} ${value > 0 ? styles.hasValue : styles.noValue}`}
                      >
                        ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className={styles.totalRow}>
                  <td className={`${styles.cell} ${styles.totalRowLabel} ${styles.stickyColumn}`}>
                    Total Expenses
                  </td>
                  <td className={`${styles.cell} ${styles.totalRowValue}`}>
                    ${expenses.reduce((sum, exp) => sum + calculateTotal(exp.values), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  {Array(12).fill(0).map((_, monthIdx) => {
                    const monthTotal = expenses.reduce((sum, exp) => sum + exp.values[monthIdx], 0);
                    return (
                      <td key={monthIdx} className={`${styles.cell} ${styles.totalRowValue} ${monthIdx >= 8 ? styles.futureMonth : ''}`}>
                        ${monthTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* Receipt List */}
        <div className={styles.receiptContainer}>
          <h2 className={styles.receiptTitle}>Receipts</h2>
          <div className={styles.receiptList}>
            {receipts.length === 0 ? (
              <div className={styles.noReceipts}>
                <p>No receipts found for this property and tax year.</p>
              </div>
            ) : (
              receipts.map(receipt => (
                <div
                  key={receipt.id}
                  onClick={() => handleReceiptClick(receipt)}
                  className={`${styles.receiptCard} ${selectedReceipt?.id === receipt.id ? styles.receiptCardSelected : ''}`}
                >
                  <div className={styles.receiptHeader}>
                    <span className={styles.receiptCategory}>{receipt.expenseCategory}</span>
                    <span className={styles.receiptAmount}>${receipt.amount.toFixed(2)}</span>
                  </div>
                  <div className={styles.receiptDetails}>
                    <div>Date: {new Date(receipt.date).toLocaleDateString()}</div>
                    <div>Payment: {receipt.paymentMethod}</div>
                    {receipt.description && (
                      <div className={styles.receiptDescription}>{receipt.description}</div>
                    )}
                  </div>
                  {selectedReceipt?.id === receipt.id && (
                    <div className={styles.receiptActions}>
                      <button className={styles.editButton}>
                        Edit Receipt
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewUpdateReceipt;