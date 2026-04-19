import { type ReactNode } from "react";
import styles from './dropdownModal.module.css';

interface DropdownModalProps {
  children?: ReactNode;
  selections: string[];
  onSelect?: (selection: string) => void;
}

const DropdownModal = ({
  children,
  selections,
  onSelect,
}: DropdownModalProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        {selections.map((selection, i) => (
          <button
            key={i}
            className={styles.item}
            onClick={() => onSelect?.(selection)}
          >
            {selection}
          </button>
        ))}
        {children}
      </div>
    </div>
  );
};


export default DropdownModal;