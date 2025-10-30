import { DataModel, DataSource, DataSourceCache } from '@toolpad/core/Crud';
import { z } from 'zod';

type PaymentMethod = 'efectivo' | 'tarjeta' | 'transferencia';

export interface Sale extends DataModel {
  id: number;
  date: string;
  customerName: string;
  product: string;
  quantity: number;
  unitPrice: number;
  total: number;
  paymentMethod: PaymentMethod;
}

const INITIAL_SALES_STORE: Sale[] = [
  { 
    id: 1, 
    date: new Date('2025-10-28').toISOString(), 
    customerName: 'María González', 
    product: 'Helado de Chocolate', 
    quantity: 2, 
    unitPrice: 5.50, 
    total: 11.00,
    paymentMethod: 'efectivo'
  },
  { 
    id: 2, 
    date: new Date('2025-10-29').toISOString(), 
    customerName: 'Juan Pérez', 
    product: 'Helado de Vainilla', 
    quantity: 3, 
    unitPrice: 5.00, 
    total: 15.00,
    paymentMethod: 'tarjeta'
  },
  { 
    id: 3, 
    date: new Date('2025-10-30').toISOString(), 
    customerName: 'Ana Martínez', 
    product: 'Helado de Fresa', 
    quantity: 1, 
    unitPrice: 6.00, 
    total: 6.00,
    paymentMethod: 'transferencia'
  },
];

const getSalesStore = (): Sale[] => {
  const value = localStorage.getItem('sales-store');
  return value ? JSON.parse(value) : INITIAL_SALES_STORE;
};

const setSalesStore = (value: Sale[]) => {
  localStorage.setItem('sales-store', JSON.stringify(value));
};

export const salesDataSource: DataSource<Sale> = {
  fields: [
    { field: 'id', headerName: 'ID', width: 70 },
    { 
      field: 'date', 
      headerName: 'Fecha', 
      type: 'dateTime', 
      width: 130,
      valueGetter: (value: string) => value && new Date(value),
      editable: false,
    },
    { field: 'customerName', headerName: 'Cliente', width: 180 },
    { field: 'product', headerName: 'Producto', width: 180 },
    { field: 'quantity', headerName: 'Cantidad', type: 'number', width: 100 },
    { field: 'unitPrice', headerName: 'Precio Unit.', type: 'number', width: 120 },
    { field: 'total', headerName: 'Total', type: 'number', width: 120 },
    {
      field: 'paymentMethod',
      headerName: 'Método de Pago',
      type: 'singleSelect',
      valueOptions: ['efectivo', 'tarjeta', 'transferencia'],
      width: 150,
    },
  ],

  getMany: async ({ paginationModel }) => {
    const store = getSalesStore();

    const start = paginationModel.page * paginationModel.pageSize;
    const end = start + paginationModel.pageSize;
    return {
      items: store.slice(start, end),
      itemCount: store.length,
    };
  },

  getOne: async (id) => {
    const sale = getSalesStore().find((s) => s.id === Number(id));
    if (!sale) throw new Error('Venta no encontrada');
    return sale;
  },

  createOne: async (data) => {
    const store = getSalesStore();
    const calculatedTotal = (data.quantity || 0) * (data.unitPrice || 0);
    const newSale = { 
      id: store.reduce((max, s) => Math.max(max, s.id), 0) + 1, 
      ...data,
      date: data.date ?? new Date().toISOString(),
      total: calculatedTotal
    } as Sale;
    setSalesStore([...store, newSale]);
    return newSale;
  },

  updateOne: async (id, data) => {
    let updated: Sale | null = null;
    const store = getSalesStore().map((s) => {
      if (s.id === Number(id)) {
        const calculatedTotal = (data.quantity || s.quantity) * (data.unitPrice || s.unitPrice);
        updated = { ...s, ...data, total: calculatedTotal };
        return updated;
      }
      return s;
    });
    setSalesStore(store);
    if (!updated) throw new Error('Venta no encontrada');
    return updated;
  },

  deleteOne: async (id) => {
    const store = getSalesStore().filter((s) => s.id !== Number(id));
    setSalesStore(store);
  },

  validate: z.object({
    date: z.string().optional(),
    customerName: z.string().nonempty('Cliente es obligatorio'),
    product: z.string().nonempty('Producto es obligatorio'),
    quantity: z.number().min(1, 'Cantidad debe ser mayor a 0'),
    unitPrice: z.number().min(0, 'Precio debe ser mayor o igual a 0'),
    paymentMethod: z.enum(['efectivo', 'tarjeta', 'transferencia']),
  })['~standard'].validate,
};

export const salesCache = new DataSourceCache();
