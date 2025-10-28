import { DataModel, DataSource, DataSourceCache } from '@toolpad/core/Crud';
import { z } from 'zod';

// Tipos de categoría de producto
type ProductCategory = 'Helado' | 'Postres' | 'Otros';

export interface Product extends DataModel {
  id: number;
  nombre: string;
  precio: number;
  categoria: ProductCategory;
  stock: number;
}

const INITIAL_PRODUCTS_STORE: Product[] = [
  {
    id: 1,
    nombre: 'Dulce de Leche',
    precio: 0,
    categoria: 'Helado',
    stock: 50,
  },
  {
    id: 2,
    nombre: 'ChocoChoco Torta',
    precio: 49,
    categoria: 'Postres',
    stock: 120,
  },
  {
    id: 3,
    nombre: 'Cuchara',
    precio: 2,
    categoria: 'Otros',
    stock: 500,
  },
];

export const getProductsStore = (): Product[] => {
  const value = localStorage.getItem('products-store');
  return value ? JSON.parse(value) : INITIAL_PRODUCTS_STORE;
};

const setProductsStore = (value: Product[]) => {
  localStorage.setItem('products-store', JSON.stringify(value));
};

export const productsDataSource: DataSource<Product> = {
  fields: [
    { field: 'id', headerName: 'ID' },
    { field: 'nombre', headerName: 'Nombre', width: 140 },
    { field: 'precio', headerName: 'Precio', type: 'number' },
    {
      field: 'categoria',
      headerName: 'Categoria',
      type: 'singleSelect',
      valueOptions: ['Helado', 'Postres', 'Otros'], // ✔ ahora coincide
      width: 160,
    },

    { field: 'stock', headerName: 'Stock', type: 'number' },
  ],
  getMany: async ({ paginationModel, filterModel, sortModel }) => {
    await new Promise((resolve) => setTimeout(resolve, 750));

    const productsStore = getProductsStore();
    let filteredProducts = [...productsStore];

    // Filtros
    if (filterModel?.items?.length) {
      filterModel.items.forEach(({ field, value, operator }) => {
        if (!field || value == null) return;

        filteredProducts = filteredProducts.filter((product) => {
          const productValue = product[field];
          switch (operator) {
            case 'contains':
              return String(productValue).toLowerCase().includes(String(value).toLowerCase());
            case 'equals':
              return productValue === value;
            case 'startsWith':
              return String(productValue).toLowerCase().startsWith(String(value).toLowerCase());
            case 'endsWith':
              return String(productValue).toLowerCase().endsWith(String(value).toLowerCase());
            case '>':
              return (productValue as number) > value;
            case '<':
              return (productValue as number) < value;
            default:
              return true;
          }
        });
      });
    }

    // Ordenamiento
    if (sortModel?.length) {
      filteredProducts.sort((a, b) => {
        for (const { field, sort } of sortModel) {
          if ((a[field] as number) < (b[field] as number)) return sort === 'asc' ? -1 : 1;
          if ((a[field] as number) > (b[field] as number)) return sort === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    // Paginación
    const start = paginationModel.page * paginationModel.pageSize;
    const end = start + paginationModel.pageSize;
    const paginatedProducts = filteredProducts.slice(start, end);

    return {
      items: paginatedProducts,
      itemCount: filteredProducts.length,
    };
  },
  getOne: async (productId) => {

    const productsStore = getProductsStore();
    const productToShow = productsStore.find((p) => p.id === Number(productId));
    if (!productToShow) throw new Error('Product not found');
    return productToShow;
  },
  createOne: async (data) => {

    const productsStore = getProductsStore();
    // Validar que los campos requeridos estén presentes
    const { nombre, precio, categoria, stock } = data;
    if (!nombre || !precio || !categoria || !stock) {
      throw new Error('Todos los campos son obligatorios');
    }
    const newProduct: Product = {
      id: productsStore.reduce((max, p) => Math.max(max, p.id), 0) + 1,
      nombre,
      precio,
      categoria,
      stock,
    };
    setProductsStore([...productsStore, newProduct]);
    return newProduct;
  },
  updateOne: async (productId, data) => {

    const productsStore = getProductsStore();
    let updatedProduct: Product | null = null;

    setProductsStore(
      productsStore.map((p) => {
        if (p.id === Number(productId)) {
          updatedProduct = { ...p, ...data };
          return updatedProduct;
        }
        return p;
      }),
    );

    if (!updatedProduct) throw new Error('Producto no encontrado para actualizar');
    return updatedProduct;
  },
  deleteOne: async (productId) => {
    const productsStore = getProductsStore();
    setProductsStore(productsStore.filter((p) => p.id !== Number(productId)));
  },
  validate: z.object({
    nombre: z.string().nonempty('Nombre es requerido'),
    precio: z.number().min(0, 'Precio debe ser al menos 0'),
    categoria: z.enum(['Helado', 'Postres', 'Otros'], {
      errorMap: () => ({ message: 'La categoria debe ser Helado, Postres o otros' }),
    }),

    stock: z.number().min(0, 'Debe haber al menos 0 en stock'),
  })['~standard'].validate,
};

export const productsCache = new DataSourceCache();
