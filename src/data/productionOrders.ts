import { DataModel, DataSource, DataSourceCache } from "@toolpad/core/Crud";
import { z } from "zod";
import { getProductsStore } from "./products"; 

export interface ProductionOrder extends DataModel {
  id: number;
  productId: number;
  quantity: number;
  category: "IceCream"; // solo IceCream
  status: "Pending" | "InProgress" | "Completed";
  createdAt: string;
}

// Datos iniciales de ejemplo
const INITIAL_ORDERS_STORE: ProductionOrder[] = [
  {
    id: 1,
    productId: 1,
    quantity: 20,
    category: "IceCream",
    status: "Pending",
    createdAt: new Date().toISOString(),
  },
];

// Helpers de persistencia en localStorage
const getOrdersStore = (): ProductionOrder[] => {
  const value = localStorage.getItem("orders-store");
  return value ? JSON.parse(value) : INITIAL_ORDERS_STORE;
};

const setOrdersStore = (value: ProductionOrder[]) => {
  localStorage.setItem("orders-store", JSON.stringify(value));
};

// DataSource para el CRUD
export const productionOrderDataSource: DataSource<ProductionOrder> = {
  fields: [
    { field: "id", headerName: "ID", width: 90 },
    { field: "productId", headerName: "Product ID", type: "number", width: 120 },
    { field: "quantity", headerName: "Quantity", type: "number", width: 120 },
    { field: "category", headerName: "Category", width: 140 },
    {
      field: "status",
      headerName: "Status",
      type: "singleSelect",
      valueOptions: ["Pending", "InProgress", "Completed"],
      width: 160,
    },
    {
      field: 'createdAt',
      headerName: 'Created at',
      type: 'dateTime',
      valueGetter: (value: string) => value && new Date(value),
      editable: false,
    },
  ],

  getMany: async ({ paginationModel }) => {
    const ordersStore = getOrdersStore();
    const start = paginationModel.page * paginationModel.pageSize;
    const end = start + paginationModel.pageSize;
    const paginatedOrders = ordersStore.slice(start, end);

    return {
      items: paginatedOrders,
      itemCount: ordersStore.length,
    };
  },

  getOne: async (id) => {
    const ordersStore = getOrdersStore();
    const order = ordersStore.find((o) => o.id === Number(id));
    if (!order) throw new Error("Order not found");
    return order;
  },

  createOne: async (data) => {
    const ordersStore = getOrdersStore();
    const productsStore = getProductsStore();

    // Validar que el producto exista y sea IceCream
    const product = productsStore.find((p) => p.id === data.productId);
    if (!product) throw new Error("Product not found");
    if (product.category !== "IceCream") {
      throw new Error("Only IceCream products can be used in production orders");
    }

    const newOrder: ProductionOrder = {
      id: ordersStore.reduce((max, o) => Math.max(max, o.id), 0) + 1,
      productId: product.id,
      quantity: data.quantity ?? 1,
      category: "IceCream",
      status: data.status ?? "Pending",
      createdAt: new Date().toISOString(),
    };

    setOrdersStore([...ordersStore, newOrder]);
    return newOrder;
  },

  updateOne: async (id, data) => {
    const ordersStore = getOrdersStore();
    let updatedOrder: ProductionOrder | null = null;

    setOrdersStore(
      ordersStore.map((o) => {
        if (o.id === Number(id)) {
          updatedOrder = { ...o, ...data };
          return updatedOrder;
        }
        return o;
      })
    );

    if (!updatedOrder) throw new Error("Order not found");
    return updatedOrder;
  },

  deleteOne: async (id) => {
    const ordersStore = getOrdersStore();
    setOrdersStore(ordersStore.filter((o) => o.id !== Number(id)));
  },

  validate: z
    .object({
      productId: z.number().min(1, "Product is required"),
      quantity: z.number().min(1, "Quantity must be at least 1"),
      category: z.enum(["IceCream"]),
      status: z.enum(["Pending", "InProgress", "Completed"]),
    })
    ["~standard"].validate,
};

export const productionOrdersCache = new DataSourceCache();
