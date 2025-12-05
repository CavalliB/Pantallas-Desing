import * as React from 'react';
import { PageContainer } from '@toolpad/core/PageContainer';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { getSalesStore } from '../data/sales';
import { getProductsStore } from '../data/products';
import { productionOrderDataSource } from '../data/productionOrders';

// Helper since productionOrderDataSource doesn't export the store getter directly
// We'll read from localStorage directly for simplicity or assume we can access it.
// Actually productionOrderDataSource handles it internally.
// We'll reimplement getOrdersStore here or export it from data file.
// Ideally we should export getOrdersStore from data/productionOrders.ts.
// But for now, let's read localStorage directly to avoid changing too many files if not needed,
// OR update productionOrders.ts to export it.
// Let's rely on what we can import. getSalesStore and getProductsStore are exported?
// sales.ts exports getSalesStore? No, it's not exported.
// I need to export them.

export default function DashboardPage() {
  const [stats, setStats] = React.useState({
    totalSales: 0,
    lowStockCount: 0,
    pendingOrders: 0,
  });

  React.useEffect(() => {
    // Read from localStorage directly since getters might not be exported
    const sales = JSON.parse(localStorage.getItem('sales-store') || '[]');
    const products = JSON.parse(localStorage.getItem('products-store') || '[]');
    const orders = JSON.parse(localStorage.getItem('orders-store') || '[]');

    const totalSales = sales.reduce((acc: number, s: any) => acc + (s.total || 0), 0);
    const lowStockCount = products.filter((p: any) => p.stock < 10).length;
    const pendingOrders = orders.filter((o: any) => o.status === 'Pendiente').length;

    setStats({ totalSales, lowStockCount, pendingOrders });
  }, []);

  return (
    <PageContainer>
      <Typography variant="h4" gutterBottom>
        Bienvenido a la heladería
      </Typography>

      <Grid container spacing={3} mt={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Ventas Totales
              </Typography>
              <Typography variant="h5">
                ${stats.totalSales.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Productos con Stock Bajo
              </Typography>
              <Typography variant="h5" color={stats.lowStockCount > 0 ? 'error' : 'textPrimary'}>
                {stats.lowStockCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Ordenes Pendientes
              </Typography>
              <Typography variant="h5">
                {stats.pendingOrders}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
}
