import * as React from 'react';
import { Crud } from '@toolpad/core/Crud';
import { useParams } from 'react-router';
import { suppliersDataSource, Supplier, suppliersCache } from '../data/supplier';

export default function SupplierCrudPage() {
  const { supplierId } = useParams();

  return (
    <Crud<Supplier>
      dataSource={suppliersDataSource}
      dataSourceCache={suppliersCache}
      rootPath="/supplier"
      initialPageSize={25}
      defaultValues={{ itemCount: 1 }}
      pageTitles={{
        show: `Supplier ${supplierId}`,
        create: 'New Supplier',
        edit: `Supplier ${supplierId} - Edit`,
      }}
    />
  );
}
