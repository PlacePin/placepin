import { LandlordModel } from "../database/models/Landlord.model";

export async function snapshotFinancials(landlordId: string) {
  const landlord = await LandlordModel.findById(landlordId);

  if (!landlord) return;

  let totalExpectedIncome = 0;
  let totalExpenses = 0;
  let tenantCount = 0;

  landlord.properties.forEach((property: any) => {
    property.tenants.forEach((tenant: any) => {
      totalExpectedIncome += tenant.rentAmountExpected;
      totalExpenses += tenant.expenses;
      tenantCount++;
    });
  });

  await LandlordModel.findByIdAndUpdate(landlordId, {
    $push: {
      financialSnapshots: {
        month: new Date(),
        totalExpectedIncome,
        totalExpenses,
        tenantCount
      }
    }
  });
}