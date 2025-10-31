import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import App from './App';
import Layout from './layouts/dashboard';
import DashboardPage from './pages';
import SupplierCrudPage from './pages/supplier';
import ProductsCrudPage from './pages/products';
import ProductionOrdersCrudPage from './pages/productionOrders';
import SuppliesCrudPage from './pages/supplies';
import RecipesCrudPage from './pages/recipes';
import buyOrdersCrudPage from './pages/buyOrders';
import CustomersCrudPage from './pages/customers';
import SalesCrudPage from './pages/sales';

const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: '/',
        Component: Layout,
        children: [
          {
            path: '',
            Component: DashboardPage,
          },
          {
            path: 'supplier/:supplierId?/*',
            Component: SupplierCrudPage,
          },
          {
            path: 'products/:productId?/*',
            Component: ProductsCrudPage,
          },
          {
            path: 'production-orders/:orderId?/*',
            Component: ProductionOrdersCrudPage,
          },
          {
            path: 'supplies/:suppliesId?/*',
            Component: SuppliesCrudPage,
          },
          {
            path: 'recipes/:recipesId?/*',
            Component: RecipesCrudPage,
          },
          {
            path: 'buyOrders/:buyOrdersId?/*',
            Component: buyOrdersCrudPage,
          },
          {
            path: 'customers/:customerId?/*',
            Component: CustomersCrudPage,
          },
          {
            path: 'sales/:saleId?/*',
            Component: SalesCrudPage,
          }

        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);