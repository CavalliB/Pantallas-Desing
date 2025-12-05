import * as React from 'react';
import { Crud } from '@toolpad/core/Crud';
import { useParams, useNavigate } from 'react-router';
import { Button, TextField, InputAdornment } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useGridApiRef } from '@mui/x-data-grid';
import { productsDataSource, Product, productsCache } from '../data/products';
import BackButton from '../components/BackButton';
import {
    PageContainer,
    PageHeader,
    PageHeaderToolbar,
} from '@toolpad/core/PageContainer';

export default function ProductsCrudPage() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const apiRef = useGridApiRef();
    const [searchText, setSearchText] = React.useState('');

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchText(value);
        if (apiRef.current) {
            apiRef.current.setFilterModel({
                items: value
                    ? [{ field: 'nombre', operator: 'contains', value }]
                    : [],
            });
        }
    };

    const handleModifyRecipe = () => {
        navigate("/recipes"); 
    };

    const CustomToolbar = () => (
        <PageHeaderToolbar>
            {productId && <BackButton to="/products" />}
             {!productId && (
                <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Buscar producto..."
                    value={searchText}
                    onChange={handleSearch}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }
                    }}
                />
            )}
            <Button
                variant="contained"
                color="primary"
                onClick={handleModifyRecipe}
            >
                Recetas
            </Button>
        </PageHeaderToolbar>
    );

    const CustomPageHeader = (headerProps: any) => {
        return <PageHeader {...headerProps} slots={{ toolbar: CustomToolbar }} />;
    };

    const CustomPageContainer = (props: any) => {
        return <PageContainer {...props} slots={{ header: CustomPageHeader }} />;
    };

    return (
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
    );
}
