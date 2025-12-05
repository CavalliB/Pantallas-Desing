import * as React from 'react';
import { Crud } from "@toolpad/core/Crud";
import { useParams, useNavigate } from "react-router";
import { Button, Select, SelectProps, Typography, Alert } from "@mui/material";
import BackButton from "../components/BackButton";
import {
  PageContainer,
  PageHeader,
  PageHeaderToolbar,
} from "@toolpad/core/PageContainer";
import {
  productionOrderDataSource,
  ProductionOrder,
  productionOrdersCache,
} from "../data/productionOrders";
import { getProductsStore } from "../data/products";

function CustomSelect(props: SelectProps) {
  const { value, name, children } = props;

  const recipe = React.useMemo(() => {
    // We strictly check name 'productId' as defined in dataSource
    if (name === 'productId' && value) {
      const p = getProductsStore().find((x) => x.id === Number(value));
      return p?.receta;
    }
    return null;
  }, [name, value]);

  return (
    <div>
      <Select {...props} fullWidth>
        {children}
      </Select>
      {recipe && (
        <Alert severity="info" sx={{ mt: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold">Receta:</Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{recipe}</Typography>
        </Alert>
      )}
    </div>
  );
}

export default function ProductionOrdersCrudPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  // Toolbar con el botón
  const CustomToolbar = () => {
    return (
      <PageHeaderToolbar>
        {orderId && <BackButton to="/production-orders" />}
      </PageHeaderToolbar>
    );
  };

  // PageHeader que usa el toolbar custom
  const CustomPageHeader = (headerProps: any) => {
    return <PageHeader {...headerProps} slots={{ toolbar: CustomToolbar }} />;
  };

  // PageContainer que usa el PageHeader custom
  const CustomPageContainer = (props: any) => {
    return <PageContainer {...props} slots={{ header: CustomPageHeader }} />;
  };

  return (
    <Crud<ProductionOrder>
      dataSource={productionOrderDataSource}
      dataSourceCache={productionOrdersCache}
      rootPath="/production-orders"
      initialPageSize={25}
      defaultValues={{
        cantidad: 1,
        status: "Pendiente",
        categoria: "Helado",
      }}
      pageTitles={{
        show: `Orden de produccion ${orderId}`,
        create: "Nueva orden de producción",
        edit: `Orden de produccion ${orderId} - Editar`,
      }}
      slots={{
        pageContainer: CustomPageContainer, // usamos el PageContainer custom
        form: {
            select: CustomSelect,
        }
      }}
    />
  );
}
