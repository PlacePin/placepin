import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { PolarArea } from "react-chartjs-2";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

interface MaintenanceRequestChartProps {
  maintenanceRequest: Record<string, any>
}

const MaintenanceRequestChart = ({
  maintenanceRequest
}: MaintenanceRequestChartProps) => {
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

  return (
    <>
      <PolarArea
        data={data}
      />
    </>
  )
}

export default MaintenanceRequestChart