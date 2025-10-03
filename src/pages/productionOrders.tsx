import { Crud } from "@toolpad/core/Crud";
import { useParams, useNavigate } from "react-router";
import { Button } from "@mui/material";
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

  // Botón que redirige a la lista de recetas
  const handleModifyRecipe = () => {
    navigate("/recipes"); // redirige a la lista de recetas
  };

  // Toolbar con el botón
  const CustomToolbar = () => {
    return (
      <PageHeaderToolbar>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleModifyRecipe}
        >
          Modificar receta
        </Button>
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
        quantity: 1,
        status: "Pending",
        category: "IceCream",
      }}
      pageTitles={{
        show: `Order ${orderId}`,
        create: "New Production Order",
        edit: `Order ${orderId} - Edit`,
      }}
      slots={{
        pageContainer: CustomPageContainer, // usamos el PageContainer custom
      }}
    />
  );
}
