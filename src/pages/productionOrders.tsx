import { Crud } from "@toolpad/core/Crud";
import { useParams, useNavigate } from "react-router";
import { Button } from "@mui/material";
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
      }}
    />
  );
}
