import * as React from 'react';
import { Crud } from '@toolpad/core/Crud';
import { useParams } from 'react-router';
import { suppliersDataSource, Supplier, suppliersCache } from '../data/supplier';
import BackButton from '../components/BackButton';
import {
  PageContainer,
  PageHeader,
  PageHeaderToolbar,
} from '@toolpad/core/PageContainer';

export default function SupplierCrudPage() {
  const { supplierId } = useParams();

  const CustomToolbar = () => (
    <PageHeaderToolbar>
      {supplierId && <BackButton to="/supplier" />}
    </PageHeaderToolbar>
  );

  const CustomPageHeader = (headerProps: any) => {
    return <PageHeader {...headerProps} slots={{ toolbar: CustomToolbar }} />;
  };

  const CustomPageContainer = (props: any) => {
    return <PageContainer {...props} slots={{ header: CustomPageHeader }} />;
  };

  return (
    <Crud<Supplier>
      dataSource={suppliersDataSource}
      dataSourceCache={suppliersCache}
      rootPath="/supplier"
      initialPageSize={25}
      defaultValues={{ itemCount: 1 }}
      pageTitles={{
        show: `Proveedor ${supplierId}`,
        create: 'Nuevo Proveedor',
        edit: `Proveedor ${supplierId} - Editar`,
      }}
      slots={{
        pageContainer: CustomPageContainer,
      }}
    />
  );
}
