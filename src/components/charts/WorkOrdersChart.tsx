import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './workOrdersChart.module.css';
import { useGetAxios } from '../../hooks/useGetAxios';

interface MonthlyWorkOrder {
  month: string;
  orders: number;
}

interface WorkOrdersChartProps {
  landlordId: string;
  propertyId: string;
  year?: number;
}

export default function WorkOrdersChart({
  landlordId,
  propertyId,
  year = new Date().getFullYear(),
}: WorkOrdersChartProps) {

  const { data: monthlyWorkOrders, error } = useGetAxios(
    `api/workorders/${landlordId}/${propertyId}/monthly`,
    undefined,
    [landlordId, propertyId]
  )

  const EMPTY_CHART_DATA: MonthlyWorkOrder[] = [
  { month: 'Jan', orders: 0 },
  { month: 'Feb', orders: 0 },
  { month: 'Mar', orders: 0 },
  { month: 'Apr', orders: 0 },
  { month: 'May', orders: 0 },
  { month: 'Jun', orders: 0 },
  { month: 'Jul', orders: 0 },
  { month: 'Aug', orders: 0 },
  { month: 'Sep', orders: 0 },
  { month: 'Oct', orders: 0 },
  { month: 'Nov', orders: 0 },
  { month: 'Dec', orders: 0 },
];

  const chartData: MonthlyWorkOrder[] = Array.isArray(monthlyWorkOrders) ? monthlyWorkOrders : EMPTY_CHART_DATA;

  const totalOrders = chartData.reduce((sum: any, item: any) => sum + item.orders, 0);
  const avgOrders = chartData.length ? Math.round(totalOrders / chartData.length) : 0;
  const peakMonth = chartData.reduce((max: any, item: any) => item.orders > max.orders ? item : max, chartData[0]);

  if (error) return <p>Error loading work orders</p>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h3 className={styles.title}>Property Work Orders - {year}</h3>
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                stroke="#6b7280"
                style={{ fontSize: '14px' }}
              />
              <YAxis
                stroke="#6b7280"
                style={{ fontSize: '14px' }}
                label={{
                  value: 'Number of Work Orders',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 15,
                  dy: 100,
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
              />
              <Area
                type="monotone"
                dataKey="orders"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorOrders)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className={styles.statsGrid}>
          <div className={styles.statCard + ' ' + styles.statCardBlue}>
            <p className={styles.statLabel}>Total Work Orders</p>
            <p className={styles.statValue + ' ' + styles.statValueBlue}>{totalOrders}</p>
          </div>
          <div className={styles.statCard + ' ' + styles.statCardGreen}>
            <p className={styles.statLabel}>Monthly Average</p>
            <p className={styles.statValue + ' ' + styles.statValueGreen}>{avgOrders}</p>
          </div>
          <div className={styles.statCard + ' ' + styles.statCardPurple}>
            <p className={styles.statLabel}>Peak Month</p>
            <p className={styles.statValue + ' ' + styles.statValuePurple}>{peakMonth ? `${peakMonth.month} (${peakMonth.orders})` : 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
