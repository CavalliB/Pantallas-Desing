import * as React from 'react';
import { Crud } from '@toolpad/core/Crud';
import { useParams } from 'react-router';
import { salesDataSource, Sale, salesCache } from '../data/sales';
import BackButton from '../components/BackButton';
import {
  PageContainer,
  PageHeader,
  PageHeaderToolbar,
} from '@toolpad/core/PageContainer';

export default function SalesCrudPage() {
  const { saleId } = useParams();

  const CustomToolbar = () => (
    <PageHeaderToolbar>
      {saleId && <BackButton to="/sales" />}
    </PageHeaderToolbar>
  );

  const CustomPageHeader = (headerProps: any) => {
    return <PageHeader {...headerProps} slots={{ toolbar: CustomToolbar }} />;
  };

  const CustomPageContainer = (props: any) => {
    return <PageContainer {...props} slots={{ header: CustomPageHeader }} />;
  };

  return (
    <Crud<Sale>
      dataSource={salesDataSource}
      dataSourceCache={salesCache}
      rootPath="/sales"
      initialPageSize={25}
      defaultValues={{ itemCount: 1 }}
      pageTitles={{
        show: `Venta ${saleId}`,
        create: 'Nueva Venta',
        edit: `Venta ${saleId} - Editar`,
      }}
      slots={{
        pageContainer: CustomPageContainer,
      }}
    />
  );
}
