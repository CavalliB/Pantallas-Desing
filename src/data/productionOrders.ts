import { DataModel, DataSource, DataSourceCache } from "@toolpad/core/Crud";
import { z } from "zod";
import { getProductsStore } from "./products";

export interface ProductionOrder extends DataModel {
  id: number;
  productId: number;
  cantidad: number;
  categoria: "Helado"; // solo Helado
  status: "Pendiente" | "En progeso" | "Finalizado";
  creada: string;
}

// Datos iniciales de ejemplo
const INITIAL_ORDERS_STORE: ProductionOrder[] = [
  {
    id: 1,
    productId: 1,
    cantidad: 20,
    categoria: "Helado",
    status: "Pendiente",
    creada: new Date().toISOString(),
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
    { field: "productId", headerName: "Producto ID", type: "number", width: 120 },
    { field: "cantidad", headerName: "Cantidad", type: "number", width: 120 },
    { field: "categoria", headerName: "Categoria", width: 140 },
    {
      field: "status",
      headerName: "Status",
      type: "singleSelect",
      valueOptions: ["Pendiente", "En progeso", "Finalizado"],
      width: 160,
    },
    {
      field: 'creada',
      headerName: 'Creada',
      type: 'dateTime',
      valueGetter: (value: string) => value && new Date(value),
      editable: false,
      width: 180,

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

    // Validar que el producto exista y sea Helado
    const product = productsStore.find((p) => p.id === data.productId);
    if (!product) throw new Error("Producto no encontrado");
    if (product.categoria !== "Helado") {
      throw new Error("Solo helados pueden tener órdenes de producción");
    }

    const newOrder: ProductionOrder = {
      id: ordersStore.reduce((max, o) => Math.max(max, o.id), 0) + 1,
      productId: product.id,
      cantidad: data.cantidad ?? 1,
      categoria: "Helado",
      status: data.status ?? "Pendiente",
      creada: new Date().toISOString(),
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

    if (!updatedOrder) throw new Error("Orden de producción no encontrada para actualizar");
    return updatedOrder;
  },

  deleteOne: async (id) => {
    const ordersStore = getOrdersStore();
    setOrdersStore(ordersStore.filter((o) => o.id !== Number(id)));
  },

  validate: z
    .object({
      productId: z.number().min(1, "El Product ID es requerido"),
      cantidad: z.number().min(1, "Cantidad debe ser al menos 1"),
      categoria: z.enum(["Helado"]),
      status: z.enum(["Pendiente", "En progeso", "Finalizado"]),
    })
  ["~standard"].validate,
};

export const productionOrdersCache = new DataSourceCache();
