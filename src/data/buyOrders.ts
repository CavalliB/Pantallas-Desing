import { DataModel, DataSource, DataSourceCache } from '@toolpad/core/Crud';
import { z } from 'zod';

type OrderBuyStatus = 'pending' | 'complete' | 'canceled';


export interface BuyOrder extends DataModel {
    id: number;
    idBuyOrder: number;
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
        idBuyOrder: 1,
        date: new Date().toISOString(),
        total: 150.0,
        status: 'pending',
        items: [
            { id: 1, productName: 'Harina', quantity: 10, price: 20 },
            { id: 2, productName: 'Azúcar', quantity: 5, price: 10 },
        ],
    },
    {
        id: 2,
        idBuyOrder: 2,
        date: new Date().toISOString(),
        total: 200.0,
        status: 'complete',
        items: [
            { id: 1, productName: 'Leche', quantity: 20, price: 5 },
        ],
    },
    {
        id: 3,
        idBuyOrder: 3,
        date: new Date().toISOString(),
        total: 100.0,
        status: 'canceled',
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
        { field: 'idBuyOrder', headerName: 'BuyOrder ID', width: 100 },
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
            valueOptions: ['pending', 'complete', 'canceled'],
            width: 130,
        },
        {
            field: 'items',
            headerName: 'Insumos',
            width: 400,
            // Mostrar una representación legible de la sublista en las vistas
            valueGetter: (items: any[]) =>
                items && Array.isArray(items)
                    ? items.map((it: any) => `${it.productName} x${it.quantity}`).join(', ')
                    : '',
            editable: false,
        },
    ],

    getMany: async ({ paginationModel }) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const store = getBuyOrdersStore();

        const start = paginationModel.page * paginationModel.pageSize;
        const end = start + paginationModel.pageSize;
        return {
            items: store.slice(start, end),
            itemCount: store.length,
        };
    },
    getOne: async (id) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const buyOrder = getBuyOrdersStore().find((s) => s.id === Number(id));
        if (!buyOrder) throw new Error('BuyOrder not found');
        return buyOrder;
    },

    createOne: async (data) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const store = getBuyOrdersStore();
        // Normalizar items: asegurarnos de que sea un array y que cada item tenga id
        const incomingItems = Array.isArray((data as any).items) ? (data as any).items : [];
        const normalizedItems = incomingItems.map((it: any, idx: number) => ({ id: it.id ?? idx + 1, ...it }));

        const newBuyOrder = {
            id: store.reduce((max, s) => Math.max(max, s.id), 0) + 1,
            ...data,
            items: normalizedItems,
        } as BuyOrder;
        setBuyOrdersStore([...store, newBuyOrder]);
        return newBuyOrder;
    },

    updateOne: async (id, data) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        let updated: BuyOrder | null = null;
        const store = getBuyOrdersStore().map((s) => {
            if (s.id === Number(id)) {
                // Si se envían items en la actualización, normalizarlos
                const incomingItems = Array.isArray((data as any).items) ? (data as any).items : undefined;
                const normalizedItems = Array.isArray(incomingItems)
                    ? incomingItems.map((it: any, idx: number) => ({ id: it.id ?? idx + 1, ...it }))
                    : s.items ?? [];

                updated = { ...s, ...data, items: normalizedItems };
                return updated;
            }
            return s;
        });
        setBuyOrdersStore(store);
        if (!updated) throw new Error('BuyOrder not found');
        return updated;
    },

    deleteOne: async (id) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const store = getBuyOrdersStore().filter((s) => s.id !== Number(id));
        setBuyOrdersStore(store);
    },

    // Validación con zod para que el CRUD genere formularios correctos
    validate: z
        .object({
            idBuyOrder: z.number().optional(),
            date: z.string().optional(),
            total: z.number().optional(),
            status: z.enum(['pending', 'complete', 'canceled']).default('pending'),
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
