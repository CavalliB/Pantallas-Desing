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
        nombre: "Nuevo Insumo",
        cantidad: 0,
        unidad: "unidades",
      }}
      pageTitles={{
        show: `Insumos ${suppliesId}`,
        create: "Nuevo Insumo",
        edit: `Insumos ${suppliesId} - Editar`,
      }}
    />
  );
}
