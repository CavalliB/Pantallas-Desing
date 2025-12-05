import * as React from 'react';
import { Crud } from '@toolpad/core/Crud';
import { useParams } from 'react-router';
import { useGridApiRef } from '@mui/x-data-grid';
import { customersDataSource, Customer, customersCache } from '../data/customers';
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

export default function CustomersCrudPage() {
  const { customerId } = useParams();
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
      placeholder: "Buscar cliente...",
      children: customerId && <BackButton to="/customers" />
  }), [searchText, handleSearch, customerId]);

  return (
    <SearchContext.Provider value={contextValue}>
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
