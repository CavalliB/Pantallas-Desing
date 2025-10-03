import { DataModel, DataSource, DataSourceCache } from '@toolpad/core/Crud';
import { z } from 'zod';

type SupplierRole = 'product' | 'supplies' | 'others';

export interface Supplier extends DataModel {
  id: number;
  name: string;
  role: SupplierRole;
}

const INITIAL_SUPPLIERS_STORE: Supplier[] = [
  { id: 1, name: 'Edward Perry', role: 'product' },
  { id: 2, name: 'Josephine Drake', role: 'supplies' },
  { id: 3, name: 'Cody Phillips', role: 'others' },
];

const getSuppliersStore = (): Supplier[] => {
  const value = localStorage.getItem('suppliers-store');
  return value ? JSON.parse(value) : INITIAL_SUPPLIERS_STORE;
};

const setSuppliersStore = (value: Supplier[]) => {
  localStorage.setItem('suppliers-store', JSON.stringify(value));
};

export const suppliersDataSource: DataSource<Supplier> = {
  fields: [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Nombre', width: 180 },
    {
      field: 'role',
      headerName: 'Rol',
      type: 'singleSelect',
      valueOptions: ['product', 'supplies', 'others'],
      width: 140,
    },
  ],

  getMany: async ({ paginationModel }) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const store = getSuppliersStore();

    const start = paginationModel.page * paginationModel.pageSize;
    const end = start + paginationModel.pageSize;
    return {
      items: store.slice(start, end),
      itemCount: store.length,
    };
  },

  getOne: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const supplier = getSuppliersStore().find((s) => s.id === Number(id));
    if (!supplier) throw new Error('Supplier not found');
    return supplier;
  },

  createOne: async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const store = getSuppliersStore();
    const newSupplier = { id: store.reduce((max, s) => Math.max(max, s.id), 0) + 1, ...data } as Supplier;
    setSuppliersStore([...store, newSupplier]);
    return newSupplier;
  },

  updateOne: async (id, data) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    let updated: Supplier | null = null;
    const store = getSuppliersStore().map((s) => {
      if (s.id === Number(id)) {
        updated = { ...s, ...data };
        return updated;
      }
      return s;
    });
    setSuppliersStore(store);
    if (!updated) throw new Error('Supplier not found');
    return updated;
  },

  deleteOne: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const store = getSuppliersStore().filter((s) => s.id !== Number(id));
    setSuppliersStore(store);
  },

  validate: z.object({
    name: z.string().nonempty('Nombre es obligatorio'),
    role: z.enum(['product', 'supplies', 'others']),
  })['~standard'].validate,
};

export const suppliersCache = new DataSourceCache();
