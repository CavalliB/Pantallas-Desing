import * as React from 'react';
import { Crud } from "@toolpad/core/Crud";
import { useParams, useNavigate } from "react-router";
import { Button, Select, SelectProps, Typography, Alert } from "@mui/material";
import { useGridApiRef } from '@mui/x-data-grid';
import BackButton from "../components/BackButton";
import SearchToolbar from "../components/SearchToolbar";
import {
  PageContainer,
  PageHeader,
} from "@toolpad/core/PageContainer";
import {
  productionOrderDataSource,
  ProductionOrder,
  productionOrdersCache,
} from "../data/productionOrders";
import { getProductsStore } from "../data/products";
import { getRecipesStore } from "../data/recipes";
import { SearchContext, useSearchContext } from '../context/SearchContext';

function CustomSelect(props: SelectProps) {
  const { value, name, children } = props;

  const recipe = React.useMemo(() => {
    // We strictly check name 'productId' as defined in dataSource
    if (name === 'productId' && value) {
      const p = getProductsStore().find((x) => x.id === Number(value));
      if (p?.recipeId) {
          const r = getRecipesStore().find((x) => x.id === p.recipeId);
          return r ? `${r.nombre}: ${r.ingredientes || r.descripcion}` : null;
      }
    }
    return null;
  }, [name, value]);

  return (
    <div>
      <Select {...props} fullWidth>
        {children}
      </Select>
      {recipe && (
        <Alert severity="info" sx={{ mt: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold">Receta:</Typography>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{recipe}</Typography>
        </Alert>
      )}
    </div>
  );
}

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

export default function ProductionOrdersCrudPage() {
  const { orderId } = useParams();
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

  const contextValue = React.useMemo(() => ({
      searchText,
      handleSearch,
      placeholder: "Buscar orden (status)...",
      children: orderId && <BackButton to="/production-orders" />
  }), [searchText, handleSearch, orderId]);

  return (
    <SearchContext.Provider value={contextValue}>
        <Crud<ProductionOrder>
        dataSource={productionOrderDataSource}
        dataSourceCache={productionOrdersCache}
        rootPath="/production-orders"
        initialPageSize={25}
        defaultValues={{
            cantidad: 1,
            status: "Pendiente",
            categoria: "Helado",
        }}
        pageTitles={{
            show: `Orden de produccion ${orderId}`,
            create: "Nueva orden de producción",
            edit: `Orden de produccion ${orderId} - Editar`,
        }}
        slots={{
            pageContainer: CustomPageContainer, // usamos el PageContainer custom
            form: {
                select: CustomSelect,
            }
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
