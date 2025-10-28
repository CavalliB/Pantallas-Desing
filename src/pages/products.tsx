import * as React from 'react';
import { Crud } from '@toolpad/core/Crud';
import { useParams } from 'react-router';
import { productsDataSource, Product, productsCache } from '../data/products';

export default function ProductsCrudPage() {
    const { productId } = useParams();

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
        />
    );
}
