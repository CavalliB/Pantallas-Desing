import * as React from "react";
import { Crud } from "@toolpad/core/Crud";
import { useParams } from "react-router";
import { suppliesDataSource, Supplies, suppliesCache } from "../data/supplies";
import BackButton from "../components/BackButton";
import {
  PageContainer,
  PageHeader,
  PageHeaderToolbar,
} from '@toolpad/core/PageContainer';

export default function SuppliesCrudPage() {
  const { suppliesId } = useParams();

  const CustomToolbar = () => (
    <PageHeaderToolbar>
      {suppliesId && <BackButton to="/supplies" />}
    </PageHeaderToolbar>
  );

  const CustomPageHeader = (headerProps: any) => {
    return <PageHeader {...headerProps} slots={{ toolbar: CustomToolbar }} />;
  };

  const CustomPageContainer = (props: any) => {
    return <PageContainer {...props} slots={{ header: CustomPageHeader }} />;
  };

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
      slots={{
        pageContainer: CustomPageContainer,
      }}
    />
  );
}
