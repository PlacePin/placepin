import { useState } from 'react';
import type { Receipt } from '../../../../interfaces/interfaces';
import styles from './reviewUpdateReceipt.module.css';
import PrimaryButton from '../../../../components/buttons/PrimaryButton';
import EditReceiptModal from '../../../../components/modals/EditReceiptModal';
import { CSVLink } from 'react-csv';
import { FileDown } from 'lucide-react';

interface ReviewUpdateReceiptProps {
  onClose: () => void;
  receiptInfo: Record<string, any>[]
}

const ReviewUpdateReceipt = ({
  onClose,
  receiptInfo = [],
}: ReviewUpdateReceiptProps) => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedProperty, setSelectedProperty] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

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

  const EXPENSE_CATEGORIES = [
    'Advertising',
    'Auto and Travel',
    'Cleaning and Maintenance',
    'Commissions',
    'Insurance',
    'Legal and Other Professional Fees',
    'Management Fees',
    'Mortgage Interest',
    'Other Interest',
    'Repairs',
    'Supplies',
    'Taxes',
    'Utilities',
  ];

  // Function to generate expenses from receipts
  const generateExpensesFromReceipts = () => {
    if (!selectedProperty || !selectedYear) {
      // Return empty expenses if no selection
      return EXPENSE_CATEGORIES.map(category => ({
        category,
        values: Array(12).fill(0)
      }));
    }

    const property = propertyList.find(property => property.id === selectedProperty);
    if (!property) {
      return EXPENSE_CATEGORIES.map(category => ({
        category,
        values: Array(12).fill(0)
      }));
    }

    const yearData = property.taxYearsData.find((ty: { year: any; }) => ty.year.toString() === selectedYear);
    const receiptsForYear = yearData?.receipts || [];

    // Initialize expenses object with all categories
    const expensesMap: { [key: string]: number[] } = {};
    EXPENSE_CATEGORIES.forEach(category => {
      expensesMap[category] = Array(12).fill(0);
    });

    // Populate expenses from receipts
    receiptsForYear.forEach((receipt: {
      date: string | number | Date;
      expenseCategory: string;
      amount: number;
    }) => {
      const receiptDate = new Date(receipt.date);
      const month = receiptDate.getMonth(); // 0-11
      const category = receipt.expenseCategory;

      // Add to the category if it exists, else add to "Other Interest" or create it
      if (expensesMap[category] !== undefined) {
        expensesMap[category][month] += receipt.amount;
      } else {
        // If category doesn't exist in list, add it dynamically
        if (!expensesMap[category]) {
          expensesMap[category] = Array(12).fill(0);
        }
        expensesMap[category][month] += receipt.amount;
      }
    });

    // Convert map to array format
    return Object.keys(expensesMap).map(category => ({
      category,
      values: expensesMap[category]
    }));
  };

  // Generate expenses dynamically
  const expenses = generateExpensesFromReceipts();

  const prepareCsvData = () => {
    const data = expenses.map(expense => {
      const row: any = {
        'Expenses': expense.category,
        'Totals': calculateTotal(expense.values).toFixed(2)
      };

      months.forEach((month, idx) => {
        row[month] = expense.values[idx].toFixed(2);
      });

      return row;
    });

    // Add total row
    const totalRow: any = {
      'Expenses': 'Total Expenses',
      'Totals': expenses.reduce((sum, exp) => sum + calculateTotal(exp.values), 0).toFixed(2)
    };

    months.forEach((month, idx) => {
      const monthTotal = expenses.reduce((sum, exp) => sum + exp.values[idx], 0);
      totalRow[month] = monthTotal.toFixed(2);
    });

    data.push(totalRow);
    return data;
  };

  const getPropertyAddress = () => {
  const property = propertyList.find(p => p.id === selectedProperty);
  if (!property) return 'property';
  
  // Split by comma to get just the street address
  const streetAddress = property.address.split(',')[0].trim();
  return streetAddress.replace(/\s+/g, '_');
};

  // Determine current month to mark future months
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const isCurrentYear = selectedYear === currentYear.toString();

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const headers = ['Expenses', 'Totals', ...months]

  const calculateTotal = (values: number[]) => values.reduce((sum, val) => sum + val, 0);

  const handleReceiptClick = (receipt: Receipt) => {
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
              availableTaxYears.map((year: number) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))
            )}
          </select>
        </div>
        {selectedProperty &&
          <div
            title={"Download CSV"}
            className={styles.csvContainer}
          >
            <CSVLink
              data={prepareCsvData()}
              headers={headers}
              className={styles.csv}
              filename={`${getPropertyAddress()}-${selectedYear}.csv`}
            >
              <FileDown
                size={32}
              />
            </CSVLink>
          </div>
        }
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
                  {months.map((month, idx) => {
                    const isFutureMonth = isCurrentYear && idx > currentMonth;
                    return (
                      <th key={month} className={`${styles.headerCell} ${isFutureMonth ? styles.futureMonth : ''}`}>
                        {month}
                      </th>
                    );
                  })}
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
                    {expense.values.map((value, monthIdx) => {
                      const isFutureMonth = isCurrentYear && monthIdx > currentMonth;
                      return (
                        <td
                          key={monthIdx}
                          className={`${styles.cell} ${styles.valueCell} ${isFutureMonth ? styles.futureMonth : ''} ${value > 0 ? styles.hasValue : styles.noValue}`}
                        >
                          ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      );
                    })}
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
                    const isFutureMonth = isCurrentYear && monthIdx > currentMonth;
                    return (
                      <td key={monthIdx} className={`${styles.cell} ${styles.totalRowValue} ${isFutureMonth ? styles.futureMonth : ''}`}>
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
              receipts.map((receipt: Receipt) => (
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
                      <button
                        className={styles.editButton}
                        onClick={() => setShowReceiptModal(prev => !prev)}
                      >
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
      {showReceiptModal && selectedReceipt &&
        <EditReceiptModal
          onClose={() => setShowReceiptModal(prev => !prev)}
          propertyId={selectedProperty}
          amount={selectedReceipt.amount}
          date={selectedReceipt.date}
          description={selectedReceipt.description}
          expenseCategory={selectedReceipt.expenseCategory}
          paymentMethod={selectedReceipt.paymentMethod}
          taxYear={selectedYear}
          properties={receiptInfo}
          receiptId={selectedReceipt.id}
        />
      }
    </div>
  );
};

export default ReviewUpdateReceipt;
