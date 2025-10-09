import { DataModel, DataSource, DataSourceCache } from '@toolpad/core/Crud';
import { z } from 'zod';

type OrderBuyStatus = 'pending' | 'complete' | 'canceled';


export interface BuyOrder extends DataModel {
    id: number;
    idBuyOrder: number;
    date: string;
    total: number;
    status: OrderBuyStatus;
}

const INITIAL_BUY_ORDERS_STORE: BuyOrder[] = [
    { id: 1, idBuyOrder: 1, date: new Date().toISOString(), total: 150.0, status: 'pending' },
    { id: 2, idBuyOrder: 2, date: new Date().toISOString(), total: 200.0, status: 'complete' },
    { id: 3, idBuyOrder: 3, date: new Date().toISOString(), total: 100.0, status: 'canceled' },
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
            field: "date", headerName: "date", type: "dateTime", width: 200, valueGetter: (params: any) => {
                if (!params || !params.row || !params.row.createdAt) return null; // evita error
                return new Date(params.row.createdAt);
            },
        }, 
        { field: 'total', headerName: 'Total', type: 'number', width: 100 },
        {
            field: 'status',
            headerName: 'Status',
            type: 'singleSelect',
            valueOptions: ['pending', 'complete', 'canceled'],
            width: 130,
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
        const newBuyOrder = { id: store.reduce((max, s) => Math.max(max, s.id), 0) + 1, ...data } as BuyOrder;
        setBuyOrdersStore([...store, newBuyOrder]);
        return newBuyOrder;
    },

    updateOne: async (id, data) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        let updated: BuyOrder | null = null;
        const store = getBuyOrdersStore().map((s) => {
            if (s.id === Number(id)) {
                updated = { ...s, ...data };
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

    validate: undefined,
};

export const buyOrderCache = new DataSourceCache();
