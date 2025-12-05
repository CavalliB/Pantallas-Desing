import * as React from 'react';
import { Crud } from '@toolpad/core/Crud';
import { useParams, useNavigate } from 'react-router';
import { Button } from "@mui/material";
import { useGridApiRef } from '@mui/x-data-grid';
import { productsDataSource, Product, productsCache } from '../data/products';
import BackButton from '../components/BackButton';
import SearchToolbar from '../components/SearchToolbar';
import {
    PageContainer,
    PageHeader,
    PageHeaderToolbar,
} from '@toolpad/core/PageContainer';
import { SearchContext, useSearchContext } from '../context/SearchContext';

// Define components outside to prevent remounting
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

export default function ProductsCrudPage() {
    const { productId } = useParams();
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

    const handleModifyRecipe = () => {
        navigate("/recipes"); 
    };

    const contextValue = React.useMemo(() => ({
        searchText,
        handleSearch,
        placeholder: "Buscar producto...",
        children: (
            <>
                {productId && <BackButton to="/products" />}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleModifyRecipe}
                >
                    Recetas
                </Button>
            </>
        )
    }), [searchText, handleSearch, productId, handleModifyRecipe]);

    return (
        <SearchContext.Provider value={contextValue}>
            <Crud<Product>
                dataSource={productsDataSource}
                dataSourceCache={productsCache}
                rootPath="/products"
                initialPageSize={25}
                defaultValues={{
                    nombre: 'Nuevo Producto',
                    precio: 0,
                    categoria: 'Postres',
                    stock: 0,
                }}
                pageTitles={{
                    show: `Producto ${productId}`,
                    create: 'Nuevo Producto',
                    edit: `Producto ${productId} - Editar`,
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
