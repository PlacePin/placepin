import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { PolarArea } from "react-chartjs-2";
import styles from './maintenanceRequestChart.module.css';


interface MaintenanceRequestChartProps {
  maintenanceRequest: Record<string, any>
}

const MaintenanceRequestChart = ({
  maintenanceRequest
}: MaintenanceRequestChartProps) => {
  
  ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

  const data = {
    labels: ["Electrician", "Plumbing", "Carpentry", "Other"],
    datasets: [
      {
        label: "Tradesmen",
        data: [
          maintenanceRequest.electrician,
          maintenanceRequest.plumber,
          maintenanceRequest.carpenter,
          maintenanceRequest.other
        ],
        backgroundColor: [
          "#00bfa5",
          "#0F5FC2",
          "#FFCF56",
          "#DA001A",
        ],
      },
    ],
  };

  const isAllValuesZero = Object
    .values(maintenanceRequest)
    .every(request => request <= 0)

  const noData = (
    <div className={styles.noDataWrapper}>
      <h2 className={styles.noDataText}>
        No Maintenance Request Made
      </h2>
    </div>
  )

  return (
    <>
      {isAllValuesZero ?
        noData :
        <PolarArea
          data={data}
        />
      }
    </>
  )
}

export default MaintenanceRequestChart