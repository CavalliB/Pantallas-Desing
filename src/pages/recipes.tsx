import * as React from 'react';
import { Crud } from "@toolpad/core/Crud";
import { useNavigate, useParams } from "react-router";
import { Button } from "@mui/material";
import { useGridApiRef } from '@mui/x-data-grid';
import {
  PageContainer,
  PageHeader,
} from "@toolpad/core/PageContainer";
import SearchToolbar from '../components/SearchToolbar';
import {
  recipesDataSource,
  Recipe,
  recipesCache,
} from "../data/recipes";
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

export default function RecipesCrudPage() {
  const { recipeId } = useParams();
  const navigate = useNavigate();
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

  const handleBack = () => {
    navigate("/products");
  };

  const contextValue = React.useMemo(() => ({
      searchText,
      handleSearch,
      placeholder: "Buscar receta...",
      children: (
        <Button variant="outlined" color="primary" onClick={handleBack}>
          Volver
        </Button>
      )
  }), [searchText, handleSearch]); // handleBack is stable enough or should use useCallback if defined inside. Ideally handleBack should be stable.

  return (
    <SearchContext.Provider value={contextValue}>
        <Crud<Recipe>
        dataSource={recipesDataSource}
        dataSourceCache={recipesCache}
        rootPath="/recipes"
        initialPageSize={10}
        defaultValues={{
            nombre: "",
            descripcion: "",
        }}
        pageTitles={{
            show: `Receta ${recipeId}`,
            create: "Nueva Receta",
            edit: `Receta ${recipeId} - Editar`,
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
