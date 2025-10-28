import { DataModel, DataSource, DataSourceCache } from '@toolpad/core/Crud';
import { z } from 'zod';

type OrderBuyStatus = 'pendiente' | 'finalizado' | 'cancelado';


export interface BuyOrder extends DataModel {
    id: number;
    date: string;
    total: number;
    status: OrderBuyStatus;
    // Array de insumos/lineas compradas asociados a la orden
    items?: Array<{
        id: number;
        productName: string;
        quantity: number;
        price?: number;
    }>;
}

const INITIAL_BUY_ORDERS_STORE: BuyOrder[] = [
    {
        id: 1,
        date: new Date().toISOString(),
        total: 150.0,
        status: 'pendiente',
        items: [
            { id: 1, productName: 'Harina', quantity: 10, price: 20 },
            { id: 2, productName: 'Azúcar', quantity: 5, price: 10 },
        ],
    },
    {
        id: 2,
        date: new Date().toISOString(),
        total: 200.0,
        status: 'finalizado',
        items: [
            { id: 1, productName: 'Leche', quantity: 20, price: 5 },
        ],
    },
    {
        id: 3,
        date: new Date().toISOString(),
        total: 100.0,
        status: 'cancelado',
        items: [],
    },
];

const getBuyOrdersStore = (): BuyOrder[] => {
    const value = localStorage.getItem('buyOrders-store');
    return value ? JSON.parse(value) : INITIAL_BUY_ORDERS_STORE;
};

const setBuyOrdersStore = (value: BuyOrder[]) => {
    localStorage.setItem('buyOrders-store', JSON.stringify(value));
};

export const buyOrdersDataSource: DataSource<BuyOrder> = {
    fields: [
        { field: 'id', headerName: 'ID', width: 70 },
        {
            field: 'date',
            headerName: 'date',
            type: 'dateTime',
            valueGetter: (value: string) => value && new Date(value),
            editable: false,
        },
        { field: 'total', headerName: 'Total', type: 'number', width: 100 },
        {
            field: 'status',
            headerName: 'Status',
            type: 'singleSelect',
            valueOptions: ['pendiente', 'finalizado', 'cancelado'],
            width: 130,
        },

    ],

    getMany: async ({ paginationModel }) => {
        const store = getBuyOrdersStore();

        const start = paginationModel.page * paginationModel.pageSize;
        const end = start + paginationModel.pageSize;
        return {
            items: store.slice(start, end),
            itemCount: store.length,
        };
    },
    getOne: async (id) => {
        const buyOrder = getBuyOrdersStore().find((s) => s.id === Number(id));
        if (!buyOrder) throw new Error('BuyOrder not found');
        return buyOrder;
    },

    createOne: async (data) => {
        const store = getBuyOrdersStore();
        const newId = store.reduce((max, s) => Math.max(max, s.id), 0) + 1;

        const newBuyOrder: BuyOrder = {
            id: newId,
            date: data.date ?? new Date().toISOString(),
            total: data.total ?? 0,
            status: data.status ?? 'pendiente',
            items: Array.isArray((data as any).items) ? (data as any).items : [],
        };

        setBuyOrdersStore([...store, newBuyOrder]);
        return newBuyOrder;
    },

    updateOne: async (id, data) => {
        let updated: BuyOrder | null = null;
        const store = getBuyOrdersStore().map((s) => {
            if (s.id === Number(id)) {
                const items = Array.isArray((data as any).items)
                    ? data.items
                    : s.items ?? [];

                updated = {
                    ...s,
                    date: data.date ?? s.date,
                    total: data.total ?? s.total,
                    status: data.status ?? s.status,
                    items,
                };
                return updated;
            }
            return s;
        });
        setBuyOrdersStore(store);
        if (!updated) throw new Error('BuyOrder not found');
        return updated;
    },


    deleteOne: async (id) => {
        const store = getBuyOrdersStore().filter((s) => s.id !== Number(id));
        setBuyOrdersStore(store);
    },

    validate: z
        .object({
            date: z.string().optional(),
            total: z.number().optional(),
            status: z.enum(['pendiente', 'finalizado', 'cancelado']).default('pendiente'),
            items: z
                .array(
                    z.object({
                        id: z.number().optional(),
                        productName: z.string().min(1, 'Product name is required'),
                        quantity: z.number().min(0, 'Quantity must be >= 0'),
                        price: z.number().optional(),
                    })
                )
                .default([]),
        })
    ["~standard"].validate,
};

export const buyOrderCache = new DataSourceCache();
