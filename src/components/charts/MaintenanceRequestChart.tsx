import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { PolarArea } from "react-chartjs-2";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const data = {
  labels: ["Electrician", "Plumbing", "Carpentry", "Misc."],
  datasets: [
    {
      label: "Tradesmen",
      data: [11, 16, 7, 3],
      backgroundColor: [
        "#00bfa5",
        "#0F5FC2",
        "#FFCF56",
        "#DA001A",
      ],
    },
  ],
};

const MaintenanceRequestChart = () => {
  return (
    <>
      <PolarArea
        data={data}
      />
    </>
  )
}

export default MaintenanceRequestChart