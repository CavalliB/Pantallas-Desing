import * as React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import IcecreamIcon from '@mui/icons-material/Icecream';
import BlenderIcon from '@mui/icons-material/Blender';
import InventoryIcon from '@mui/icons-material/Inventory';
import GroupIcon from '@mui/icons-material/Group';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Outlet } from 'react-router';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import type { Navigation } from '@toolpad/core/AppProvider';

const NAVIGATION: Navigation = [
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'supplier',
    title: 'Proveedor',
    icon: <PersonIcon />,
    pattern: 'supplier{/:supplierID}*',
  },
  {
    segment: 'Products',
    title: 'Productos',
    icon: <IcecreamIcon />,
    pattern: 'products{/:productId}*',
  },
  {
    segment: 'production-orders',
    title: 'Ordenes de Producción',
    icon: <BlenderIcon />,
    pattern: 'production-orders{/:orderId}*',
  },
  {
    segment: 'supplies',
    title: 'Insumos',
    icon: <InventoryIcon />,
    pattern: 'supplies{/:suppliesId}*',
  },
  {
    segment: 'buyOrders',
    title: 'Ordenes de Compra',
    icon: <InventoryIcon />,
    pattern: 'buyOrders{/:buyOrdersId}*',
  },
  {
    segment: 'customers',
    title: 'Clientes',
    icon: <GroupIcon />,
    pattern: 'customers{/:customerId}*',
  },
  {
    segment: 'sales',
    title: 'Ventas',
    icon: <ShoppingCartIcon />,
    pattern: 'sales{/:saleId}*',
  },
];

const BRANDING = {
  title: 'Heladeria',
};

export default function App() {
  return (
    <ReactRouterAppProvider navigation={NAVIGATION} branding={BRANDING} >
      <Outlet />
    </ReactRouterAppProvider>
  );
}