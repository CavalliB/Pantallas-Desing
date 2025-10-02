import * as React from "react";
import { Crud } from "@toolpad/core/Crud";
import { useParams } from "react-router";
import { suppliesDataSource, Supplies, suppliesCache } from "../data/supplies";

export default function SuppliesCrudPage() {
  const { suppliesId } = useParams();

  return (
    <Crud<Supplies>
      dataSource={suppliesDataSource}
      dataSourceCache={suppliesCache}
      rootPath="/supplies"
      initialPageSize={25}
      defaultValues={{
        name: "New Supplies",
        quantity: 0,
        unit: "units",
      }}
      pageTitles={{
        show: `Supplies ${suppliesId}`,
        create: "New Supplies",
        edit: `Supplies ${suppliesId} - Edit`,
      }}
    />
  );
}
