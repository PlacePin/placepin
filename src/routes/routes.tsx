import type { RouteObject } from "react-router-dom";
import { LANDLORD_ROUTES, LANDLORD_CHILD_ROUTES } from "./landlordRoutes";
import { TENANT_ROUTES } from "./tenantRoutes";
import LandingPage from "../pages/home/LandingPage";
import SignupPage from "../pages/auth/signup/SignupPage";
import LoginPage from "../pages/auth/login/LoginPage";
import LandlordDashboard from "../pages/dashboard/landlords/LandlordDashboard";
import TenantDashboard from "../pages/dashboard/tenants/TenantDashboard";
import PrivateRoute from "./PrivateRoute";
import LandlordTenants from "../pages/dashboard/landlords/landlordTenants/LandlordTenants";
import LandlordHomepage from "../pages/dashboard/landlords/landlordHomepage/LandlordHomepage";
import LandlordProperties from "../pages/dashboard/landlords/landlordProperties/LandlordProperties";
import LandlordBillingPayments from "../pages/dashboard/landlords/landlordBillingPayments/LandlordBillingPayments";
import LandlordTenantInsights from "../pages/dashboard/landlords/landlordTenantInsights/LandlordTenantInsights";
import LandlordMessaging from "../pages/dashboard/landlords/landlordMessaging/LandlordMessaging";
import LandlordVendors from "../pages/dashboard/landlords/landlordVendors/LandlordVendors";
import GeneralSettings from "../pages/settings/GeneralSettings";
import SuccessfulSubscription from "../pages/stripeUrlPages/SuccessfulSubscription";
import FailedSubscription from "../pages/stripeUrlPages/FailedSubscription";

const routes: RouteObject[] = [
  { path: '/', element: <LandingPage /> },
  { path: '/signup', element: <SignupPage /> },
  { path: '/login', element: <LoginPage /> },
  {
    path: LANDLORD_ROUTES.DASHBOARD, element: <PrivateRoute />,
    children: [
      {
        path: '',
        element: <LandlordDashboard />,
        children: [
          {path: '', element: <LandlordHomepage />},
          {path: LANDLORD_CHILD_ROUTES.TENANTS, element: <LandlordTenants />},
          {path: LANDLORD_CHILD_ROUTES.PROPERTIES, element: <LandlordProperties />},
          {path: LANDLORD_CHILD_ROUTES.BILLING, element: <LandlordBillingPayments />},
          {path: LANDLORD_CHILD_ROUTES.INSIGHTS, element: <LandlordTenantInsights />},
          {path: LANDLORD_CHILD_ROUTES.VENDORS, element: <LandlordVendors />},
          {path: LANDLORD_CHILD_ROUTES.MESSAGING, element: <LandlordMessaging />},
          {path: LANDLORD_CHILD_ROUTES.SETTINGS, element: <GeneralSettings />},
        ]
      }
    ]
  },
  {
    path: TENANT_ROUTES.DASHBOARD, element: <PrivateRoute />,
    children: [
      {path: '', element: <TenantDashboard />,
        children: [
          {path: '', element: <LandlordTenants />},
        ]
      }
    ]
  },
  {
    path: '', element: <PrivateRoute />,
    children: [
      {path: '/success', element: <SuccessfulSubscription />},
      {path: '/cancel', element: <FailedSubscription />}
    ]
  }
]

export default routes