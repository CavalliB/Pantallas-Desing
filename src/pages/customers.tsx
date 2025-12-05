import * as React from 'react';
import { Crud } from '@toolpad/core/Crud';
import { useParams } from 'react-router';
import { customersDataSource, Customer, customersCache } from '../data/customers';
import BackButton from '../components/BackButton';
import {
  PageContainer,
  PageHeader,
  PageHeaderToolbar,
} from '@toolpad/core/PageContainer';

export default function CustomersCrudPage() {
  const { customerId } = useParams();

  const CustomToolbar = () => (
    <PageHeaderToolbar>
      {customerId && <BackButton to="/customers" />}
    </PageHeaderToolbar>
  );

  const CustomPageHeader = (headerProps: any) => {
    return <PageHeader {...headerProps} slots={{ toolbar: CustomToolbar }} />;
  };

  const CustomPageContainer = (props: any) => {
    return <PageContainer {...props} slots={{ header: CustomPageHeader }} />;
  };

  return (
    <Crud<Customer>
      dataSource={customersDataSource}
      dataSourceCache={customersCache}
      rootPath="/customers"
      initialPageSize={25}
      pageTitles={{
        show: `Cliente ${customerId}`,
        create: 'Nuevo Cliente',
        edit: `Cliente ${customerId} - Editar`,
      }}
      slots={{
        pageContainer: CustomPageContainer,
      }}
    />
  );
}