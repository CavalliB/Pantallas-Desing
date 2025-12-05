import { DataModel, DataSource, DataSourceCache } from '@toolpad/core/Crud';
import { z } from 'zod';

type PaymentMethod = 'efectivo' | 'tarjeta' | 'transferencia';
type SaleStatus = 'pendiente' | 'completada' | 'cancelada';

export interface Sale extends DataModel {
    id: number;
    date: string;
    customerName: string;
    total: number;
    paymentMethod: PaymentMethod;
    status: SaleStatus;
    comprobante?: string;
    items?: Array<{
        id: number;
        productName: string;
        quantity: number;
        price: number;
    }>;
}

const INITIAL_SALES_STORE: Sale[] = [
    {
        id: 1,
        date: new Date('2025-10-28').toISOString(),
        customerName: 'María González',
        total: 16.50,
        paymentMethod: 'efectivo',
        status: 'completada',
        comprobante: '',
        items: [
            { id: 1, productName: 'Helado de Chocolate', quantity: 2, price: 5.50 },
            { id: 2, productName: 'Helado de Fresa', quantity: 1, price: 5.50 },
        ]
    },
    {
        id: 2,
        date: new Date('2025-10-29').toISOString(),
        customerName: 'Juan Pérez',
        total: 23.50,
        paymentMethod: 'tarjeta',
        status: 'completada',
        comprobante: 'T-12345',
        items: [
            { id: 1, productName: 'Helado de Vainilla', quantity: 3, price: 5.00 },
            { id: 2, productName: 'Paleta de Limón', quantity: 2, price: 4.25 },
        ]
    },
    {
        id: 3,
        date: new Date('2025-10-30').toISOString(),
        customerName: 'Ana Martínez',
        total: 12.00,
        paymentMethod: 'transferencia',
        status: 'pendiente',
        comprobante: '',
        items: [
            { id: 1, productName: 'Helado de Mango', quantity: 2, price: 6.00 },
        ]
    },
];

export const getSalesStore = (): Sale[] => {
    const value = localStorage.getItem('sales-store');
    return value ? JSON.parse(value) : INITIAL_SALES_STORE;
};

const setSalesStore = (value: Sale[]) => {
    localStorage.setItem('sales-store', JSON.stringify(value));
};

export const salesDataSource: DataSource<Sale> = {
    fields: [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'customerName', headerName: 'Cliente', width: 180 },
        { field: 'total', headerName: 'Total', type: 'number', width: 120, editable: false },
        {
            field: 'paymentMethod',
            headerName: 'Método de Pago',
            type: 'singleSelect',
            valueOptions: ['efectivo', 'tarjeta', 'transferencia'],
            width: 150,
        },
        {
            field: 'status',
            headerName: 'Estado',
            type: 'singleSelect',
            valueOptions: ['pendiente', 'completada', 'cancelada'],
            width: 130,
        },
        { field: 'comprobante', headerName: 'Comprobante', width: 150 },
        {
            field: 'date',
            headerName: 'Fecha',
            type: 'dateTime',
            width: 180,
            valueGetter: (value: string) => value && new Date(value),
            editable: false,
        },
    ],

    getMany: async ({ paginationModel, filterModel }) => {
        let store = getSalesStore();

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
        const sale = getSalesStore().find((s) => s.id === Number(id));
        if (!sale) throw new Error('Venta no encontrada');
        return sale;
    },

    createOne: async (data) => {
        const store = getSalesStore();
        const newId = store.reduce((max, s) => Math.max(max, s.id), 0) + 1;

        const newSale: Sale = {
            id: newId,
            date: data.date ?? new Date().toISOString(),
            customerName: data.customerName ?? '',
            total: data.total ?? 0,
            paymentMethod: data.paymentMethod ?? 'efectivo',
            status: data.status ?? 'pendiente',
            comprobante: data.comprobante ?? '',
            items: Array.isArray((data as any).items) ? (data as any).items : [],
        };

        setSalesStore([...store, newSale]);
        return newSale;
    },

    updateOne: async (id, data) => {
        let updated: Sale | null = null;
        const store = getSalesStore().map((s) => {
            if (s.id === Number(id)) {
                const items = Array.isArray((data as any).items)
                    ? data.items
                    : s.items ?? [];

                updated = {
                    ...s,
                    date: data.date ?? s.date,
                    customerName: data.customerName ?? s.customerName,
                    total: data.total ?? s.total,
                    paymentMethod: data.paymentMethod ?? s.paymentMethod,
                    status: data.status ?? s.status,
                    comprobante: data.comprobante ?? s.comprobante,
                    items,
                };
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
        total: z.number().optional(),
        paymentMethod: z.enum(['efectivo', 'tarjeta', 'transferencia']).default('efectivo'),
        status: z.enum(['pendiente', 'completada', 'cancelada']).default('pendiente'),
        comprobante: z.string().optional(),
        items: z
            .array(
                z.object({
                    id: z.number().optional(),
                    productName: z.string().min(1, 'Nombre del producto es requerido'),
                    quantity: z.number().min(1, 'Cantidad debe ser al menos 1'),
                    price: z.number().min(0, 'Precio debe ser mayor o igual a 0'),
                })
            )
            .default([]),
    })['~standard'].validate,
};

export const salesCache = new DataSourceCache();