import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './WorkOrdersChart.module.css';

export default function WorkOrdersChart() {
  const data = [
    { month: 'Jan', orders: 12 },
    { month: 'Feb', orders: 19 },
    { month: 'Mar', orders: 15 },
    { month: 'Apr', orders: 25 },
    { month: 'May', orders: 22 },
    { month: 'Jun', orders: 30 },
    { month: 'Jul', orders: 28 },
    { month: 'Aug', orders: 24 },
    { month: 'Sep', orders: 20 },
    { month: 'Oct', orders: 27 },
    { month: 'Nov', orders: 23 },
    { month: 'Dec', orders: 18 },
  ];

  const totalOrders = data.reduce((sum, item) => sum + item.orders, 0);
  const avgOrders = Math.round(totalOrders / data.length);
  const peakMonth = data.reduce((max, item) => item.orders > max.orders ? item : max, data[0]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Property Work Orders - {2025}</h2>
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
            <p className={styles.statValue + ' ' + styles.statValuePurple}>{peakMonth.month} ({peakMonth.orders})</p>
          </div>
        </div>
      </div>
    </div>
  );
}
