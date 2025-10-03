import * as React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import IcecreamIcon from '@mui/icons-material/Icecream';
import BlenderIcon from '@mui/icons-material/Blender';
import InventoryIcon from '@mui/icons-material/Inventory';
import { Outlet } from 'react-router';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import type { Navigation } from '@toolpad/core/AppProvider';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'supplier',
    title: 'Supplier',
    icon: <PersonIcon />,
    pattern: 'supplier{/:supplierID}*',
  },
  {
    segment:'products',
    title:'Products',
    icon:<IcecreamIcon/>,
    pattern: 'products{/:productId}*',
  },
  {
    segment:'production-orders',
    title:'Production Orders',
    icon:<BlenderIcon/>,
    pattern: 'production-orders{/:orderId}*',
  },
  {
    segment:'supplies',
    title:'Supplies',
    icon:<InventoryIcon/>,
    pattern: 'supplies{/:suppliesId}*',
  },
];

const BRANDING = {
  title: 'My IceCream App',
};

export default function App() {
  return (
    <ReactRouterAppProvider navigation={NAVIGATION} branding={BRANDING}>
      <Outlet />
    </ReactRouterAppProvider>
  );
}
