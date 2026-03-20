import cron from 'node-cron';
import { snapshotFinancials } from './snapshotFinancials';
import { LandlordModel } from '../database/models/Landlord.model';

// Runs at midnight on the 1st of every month
cron.schedule('0 0 1 * *', async () => {
  console.log('Running monthly financial snapshot...');

  const landlords = await LandlordModel.find({}, '_id');
  
  for (const landlord of landlords) {
    await snapshotFinancials(landlord._id.toString());
  }

  console.log(`Snapshots complete for ${landlords.length} landlords`);
});