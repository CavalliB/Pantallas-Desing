import { DataModel, DataSource, DataSourceCache } from '@toolpad/core/Crud';
import { z } from 'zod';

// Tipos de categoría de producto
type ProductCategory = 'Electronics' | 'Clothing' | 'Food';

export interface Product extends DataModel {
  id: number;
  name: string;
  price: number;
  category: ProductCategory;
  stock: number;
}

const INITIAL_PRODUCTS_STORE: Product[] = [
  {
    id: 1,
    name: 'Smartphone',
    price: 699,
    category: 'Electronics',
    stock: 50,
  },
  {
    id: 2,
    name: 'Jeans',
    price: 49,
    category: 'Clothing',
    stock: 120,
  },
  {
    id: 3,
    name: 'Chocolate Bar',
    price: 2,
    category: 'Food',
    stock: 500,
  },
];

const getProductsStore = (): Product[] => {
  const value = localStorage.getItem('products-store');
  return value ? JSON.parse(value) : INITIAL_PRODUCTS_STORE;
};

const setProductsStore = (value: Product[]) => {
  localStorage.setItem('products-store', JSON.stringify(value));
};

export const productsDataSource: DataSource<Product> = {
  fields: [
    { field: 'id', headerName: 'ID' },
    { field: 'name', headerName: 'Name', width: 140 },
    { field: 'price', headerName: 'Price', type: 'number' },
    {
      field: 'category',
      headerName: 'Category',
      type: 'singleSelect',
      valueOptions: ['Electronics', 'Clothing', 'Food'],
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
    await new Promise((resolve) => setTimeout(resolve, 750));

    const productsStore = getProductsStore();
    const productToShow = productsStore.find((p) => p.id === Number(productId));
    if (!productToShow) throw new Error('Product not found');
    return productToShow;
  },
  createOne: async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 750));

    const productsStore = getProductsStore();
    // Validar que los campos requeridos estén presentes
    const { name, price, category, stock } = data;
    if (!name || !price || !category || !stock) {
      throw new Error('Todos los campos son obligatorios');
    }
    const newProduct: Product = {
      id: productsStore.reduce((max, p) => Math.max(max, p.id), 0) + 1,
      name,
      price,
      category,
      stock,
    };
    setProductsStore([...productsStore, newProduct]);
    return newProduct;
  },
  updateOne: async (productId, data) => {
    await new Promise((resolve) => setTimeout(resolve, 750));

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

    if (!updatedProduct) throw new Error('Product not found');
    return updatedProduct;
  },
  deleteOne: async (productId) => {
    await new Promise((resolve) => setTimeout(resolve, 750));
    const productsStore = getProductsStore();
    setProductsStore(productsStore.filter((p) => p.id !== Number(productId)));
  },
  validate: z.object({
    name: z.string().nonempty('Name is required'),
    price: z.number().min(0, 'Price must be at least 0'),
    category: z.enum(['Electronics', 'Clothing', 'Food'], {
      errorMap: () => ({ message: 'Category must be Electronics, Clothing or Food' }),
    }),
    stock: z.number().min(0, 'Stock must be at least 0'),
  })['~standard'].validate,
};

export const productsCache = new DataSourceCache();
