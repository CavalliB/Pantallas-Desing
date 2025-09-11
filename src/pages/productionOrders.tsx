import { Crud } from "@toolpad/core/Crud";
import { useParams } from "react-router";
import {
  productionOrderDataSource,
  ProductionOrder,
  productionOrdersCache,
} from "../data/productionOrders";

export default function ProductionOrdersCrudPage() {
  const { orderId } = useParams();

  return (
    <Crud<ProductionOrder>
      dataSource={productionOrderDataSource}
      dataSourceCache={productionOrdersCache}
      rootPath="/production-orders"
      initialPageSize={25}
      defaultValues={{
        quantity: 1,
        status: "Pending",
        category: "IceCream", // siempre IceCream
      }}
      pageTitles={{
        show: `Order ${orderId}`,
        create: "New Production Order",
        edit: `Order ${orderId} - Edit`,
      }}
    />
  );
}
