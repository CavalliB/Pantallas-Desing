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
                name: 'New Product',       // Nombre por defecto
                price: 0,                  // Precio por defecto
                category: 'Desserts',   // Categoría por defecto (debe ser válida)
                stock: 0,                  // Stock por defecto
            }}
            pageTitles={{
                show: `Product ${productId}`,
                create: 'New Product',
                edit: `Product ${productId} - Edit`,
            }}
        />
    );
}
