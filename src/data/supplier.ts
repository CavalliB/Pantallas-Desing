import { DataModel, DataSource, DataSourceCache } from '@toolpad/core/Crud';
import { z } from 'zod';

type SupplierRole = 'producto' | 'insumos' | 'otros';

export interface Supplier extends DataModel {
  id: number;
  name: string;
  role: SupplierRole;
  Email: string;
}

const INITIAL_SUPPLIERS_STORE: Supplier[] = [
  { id: 1, name: 'Edward Perry', role: 'producto', Email: 'hola@gmail.com'},
  { id: 2, name: 'Josephine Drake', role: 'insumos', Email: 'hola@gmail.com' },
  { id: 3, name: 'Cody Phillips', role: 'otros', Email: 'hola@gmail.com' },
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
      headerName: 'Categoria',
      type: 'singleSelect',
      valueOptions: ['producto', 'insumos', 'otros'],
      width: 140,
    },
    { field: 'Email', headerName: 'Email', width: 200 },
  ],

  getMany: async ({ paginationModel }) => {
    const store = getSuppliersStore();

    const start = paginationModel.page * paginationModel.pageSize;
    const end = start + paginationModel.pageSize;
    return {
      items: store.slice(start, end),
      itemCount: store.length,
    };
  },

  getOne: async (id) => {
    const supplier = getSuppliersStore().find((s) => s.id === Number(id));
    if (!supplier) throw new Error('Proveedor no encontrado');
    return supplier;
  },

  createOne: async (data) => {
    const store = getSuppliersStore();
    const newSupplier = { id: store.reduce((max, s) => Math.max(max, s.id), 0) + 1, ...data } as Supplier;
    setSuppliersStore([...store, newSupplier]);
    return newSupplier;
  },

  updateOne: async (id, data) => {
    let updated: Supplier | null = null;
    const store = getSuppliersStore().map((s) => {
      if (s.id === Number(id)) {
        updated = { ...s, ...data };
        return updated;
      }
      return s;
    });
    setSuppliersStore(store);
    if (!updated) throw new Error('Proveedor no encontrado');
    return updated;
  },

  deleteOne: async (id) => {
    const store = getSuppliersStore().filter((s) => s.id !== Number(id));
    setSuppliersStore(store);
  },

  validate: z.object({
    name: z.string().nonempty('Nombre es obligatorio'),
    role: z.enum(['producto', 'insumos', 'otros']),
  })['~standard'].validate,
};

export const suppliersCache = new DataSourceCache();
