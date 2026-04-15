import cron from 'node-cron';
import { LandlordModel } from '../database/models/Landlord.model';
import { snapshotFinancials } from './snapshotFinancials';
import { processRentPayments } from './processRentPayments';
import { resetRentStatus } from './resetRentStatus';

// Runs at midnight on the 1st of every month
cron.schedule('0 0 1 * *', async () => {
  console.log('Running monthly financial snapshot...');

  const landlords = await LandlordModel.find({}, '_id');

  for (const landlord of landlords) {
    await snapshotFinancials(landlord._id.toString());
  }

  console.log(`Snapshots complete for ${landlords.length} landlords`);
});

// Charge tenants whose rent is due on the 1st
cron.schedule('0 1 1 * *', async () => {
  await processRentPayments(1);
});

// Charge tenants whose rent is due on the 15th
cron.schedule('0 1 15 * *', async () => {
  await processRentPayments(15);
});

// Resets the rent status to be ready for the next month
cron.schedule('0 1 26 * *', async () => {
  await resetRentStatus();
});