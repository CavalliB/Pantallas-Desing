import * as React from 'react';
import { Crud } from '@toolpad/core/Crud';
import { useParams } from 'react-router';
import { useGridApiRef } from '@mui/x-data-grid';
import { suppliersDataSource, Supplier, suppliersCache } from '../data/supplier';
import BackButton from '../components/BackButton';
import SearchToolbar from '../components/SearchToolbar';
import {
  PageContainer,
  PageHeader,
} from '@toolpad/core/PageContainer';
import { SearchContext, useSearchContext } from '../context/SearchContext';

const CustomToolbar = () => {
    const { searchText, handleSearch, placeholder, children } = useSearchContext();
    return (
        <SearchToolbar value={searchText} onChange={handleSearch} placeholder={placeholder}>
            {children}
        </SearchToolbar>
    );
};

const CustomPageHeader = (headerProps: any) => {
    return <PageHeader {...headerProps} slots={{ toolbar: CustomToolbar }} />;
};

const CustomPageContainer = (props: any) => {
    return <PageContainer {...props} slots={{ header: CustomPageHeader }} />;
};

export default function SupplierCrudPage() {
  const { supplierId } = useParams();
  const apiRef = useGridApiRef();
  const [searchText, setSearchText] = React.useState('');

  const handleSearch = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearchText(value);
      if (apiRef.current) {
          apiRef.current.setFilterModel({
              items: [],
              quickFilterValues: value ? [value] : [],
          });
      }
  }, [apiRef]);

  const contextValue = React.useMemo(() => ({
      searchText,
      handleSearch,
      placeholder: "Buscar proveedor...",
      children: supplierId && <BackButton to="/supplier" />
  }), [searchText, handleSearch, supplierId]);

  return (
    <SearchContext.Provider value={contextValue}>
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
        slotProps={{
            list: {
                dataGrid: {
                    apiRef,
                }
            }
        }}
        />
    </SearchContext.Provider>
  );
}
