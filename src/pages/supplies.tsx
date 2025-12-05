import * as React from "react";
import { Crud } from "@toolpad/core/Crud";
import { useParams } from "react-router";
import { useGridApiRef } from '@mui/x-data-grid';
import { suppliesDataSource, Supplies, suppliesCache } from "../data/supplies";
import BackButton from "../components/BackButton";
import SearchToolbar from "../components/SearchToolbar";
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

export default function SuppliesCrudPage() {
  const { suppliesId } = useParams();
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
      placeholder: "Buscar insumo...",
      children: suppliesId && <BackButton to="/supplies" />
  }), [searchText, handleSearch, suppliesId]);

  return (
    <SearchContext.Provider value={contextValue}>
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
