import { CircleCheckBig, Upload } from "lucide-react";
import styles from './uploadZone.module.css';

const UploadZone = ({
  label,
  file,
  dragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
}: {
  label: string
  file: File | null
  dragging: boolean
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: () => void
  onDrop: (e: React.DragEvent) => void
  onClick: () => void
}) => {
  const zoneClass = [
    styles.uploadZone,
    dragging ? styles.uploadZoneDragging : "",
    file && !dragging ? styles.uploadZoneSuccess : "",
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div
      className={zoneClass}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClick}
    >
      {file ? <CircleCheckBig /> : <Upload />}
      <p className={styles.uploadLabel}>{file ? file.name : label}</p>
      <p className={styles.uploadSub}>
        {file ? "Click to replace" : "JPG, PNG or PDF · max 10MB"}
      </p>
    </div>
  )
}

export default UploadZone