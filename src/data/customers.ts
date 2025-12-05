import { DataModel, DataSource, DataSourceCache } from '@toolpad/core/Crud';
import { z } from 'zod';

export interface Customer extends DataModel {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
}

const INITIAL_CUSTOMERS_STORE: Customer[] = [
    { id: 1, name: 'María González', email: 'maria@email.com', phone: '555-0101', address: 'Av. Principal 123' },
    { id: 2, name: 'Juan Pérez', email: 'juan@email.com', phone: '555-0102', address: 'Calle 5 #456' },
    { id: 3, name: 'Ana Martínez', email: 'ana@email.com', phone: '555-0103', address: 'Carrera 10 #789' },
];

export const getCustomersStore = (): Customer[] => {
    const value = localStorage.getItem('customers-store');
    return value ? JSON.parse(value) : INITIAL_CUSTOMERS_STORE;
};

const setCustomersStore = (value: Customer[]) => {
    localStorage.setItem('customers-store', JSON.stringify(value));
};

export const customersDataSource: DataSource<Customer> = {
    fields: [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Nombre', width: 180 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'phone', headerName: 'Teléfono', width: 140 },
        { field: 'address', headerName: 'Dirección', width: 150 },
    ],

    getMany: async ({ paginationModel, filterModel }) => {
        let store = getCustomersStore();

        if (filterModel?.quickFilterValues?.length) {
            const searchTerms = filterModel.quickFilterValues.map((term) => String(term).toLowerCase());
            store = store.filter((item) => {
                return searchTerms.every((term) => {
                    return Object.values(item).some((value) =>
                        String(value).toLowerCase().includes(term)
                    );
                });
            });
        }

        const start = paginationModel.page * paginationModel.pageSize;
        const end = start + paginationModel.pageSize;
        return {
            items: store.slice(start, end),
            itemCount: store.length,
        };
    },

    getOne: async (id) => {
        const customer = getCustomersStore().find((c) => c.id === Number(id));
        if (!customer) throw new Error('Cliente no encontrado');
        return customer;
    },

    createOne: async (data) => {
        const store = getCustomersStore();
        const newCustomer = { id: store.reduce((max, c) => Math.max(max, c.id), 0) + 1, ...data } as Customer;
        setCustomersStore([...store, newCustomer]);
        return newCustomer;
    },

    updateOne: async (id, data) => {
        let updated: Customer | null = null;
        const store = getCustomersStore().map((c) => {
            if (c.id === Number(id)) {
                updated = { ...c, ...data };
                return updated;
            }
            return c;
        });
        setCustomersStore(store);
        if (!updated) throw new Error('Cliente no encontrado');
        return updated;
    },

    deleteOne: async (id) => {
        const store = getCustomersStore().filter((c) => c.id !== Number(id));
        setCustomersStore(store);
    },

    validate: z.object({
        name: z.string().nonempty('Nombre es obligatorio'),
        email: z.string().email('Email inválido'),
        phone: z.string().nonempty('Teléfono es obligatorio'),
        address: z.string().nonempty('Dirección es obligatoria'),
    })['~standard'].validate,
};

export const customersCache = new DataSourceCache();