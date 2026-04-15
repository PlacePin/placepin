import { LandlordModel } from '../database/models/Landlord.model';

export async function resetRentStatus() {
  console.log('Resetting rent status for paid tenants...');

  const landlords = await LandlordModel.find({
    'properties.tenants.rentStatus': 'paid'
  });

  for (const landlord of landlords) {
    for (const property of landlord.properties) {
      for (const tenant of property.tenants) {
        if (tenant.rentStatus !== 'paid') continue;

        await LandlordModel.findOneAndUpdate(
          {
            _id: landlord._id,
            'properties.tenants.tenantId': tenant.tenantId
          },
          {
            $set: {
              'properties.$.tenants.$[ten].rentStatus': 'queued',
              'properties.$.tenants.$[ten].monthPaid': false,
              'properties.$.tenants.$[ten].rentAmountPaid': 0,
            }
          },
          { arrayFilters: [{ 'ten.tenantId': tenant.tenantId }] }
        );
      }
    }
  }

  console.log(`Rent status reset complete for ${landlords.length} landlords`);
}