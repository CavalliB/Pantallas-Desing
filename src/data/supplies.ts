import { DataModel, DataSource, DataSourceCache } from "@toolpad/core/Crud";
import { z } from "zod";

export interface Supplies extends DataModel {
  id: number;
  name: string;
  quantity: number;
  unit: string; // kg, litros, cajas, etc.
}

// Datos iniciales
const INITIAL_SUPPLIES_STORE: Supplies[] = [
  { id: 1, name: "Milk", quantity: 50, unit: "liters" },
  { id: 2, name: "Sugar", quantity: 20, unit: "kg" },
  { id: 3, name: "Cups", quantity: 200, unit: "units" },
];

// Persistencia en localStorage
const getSuppliesStore = (): Supplies[] => {
  const value = localStorage.getItem("supplies-store");
  return value ? JSON.parse(value) : INITIAL_SUPPLIES_STORE;
};

const setSuppliesStore = (value: Supplies[]) => {
  localStorage.setItem("supplies-store", JSON.stringify(value));
};

// DataSource CRUD
export const suppliesDataSource: DataSource<Supplies> = {
  fields: [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "quantity", headerName: "Quantity", type: "number", width: 120 },
    { field: "unit", headerName: "Unit", width: 100 },
  ],

  getMany: async ({ paginationModel }) => {
    const store = getSuppliesStore();
    const start = paginationModel.page * paginationModel.pageSize;
    const end = start + paginationModel.pageSize;
    return {
      items: store.slice(start, end),
      itemCount: store.length,
    };
  },

  getOne: async (id) => {
    const store = getSuppliesStore();
    const supply = store.find((s) => s.id === Number(id));
    if (!supply) throw new Error("Supplies not found");
    return supply;
  },

  createOne: async (data) => {
    const store = getSuppliesStore();
    const newSupplies: Supplies = {
      id: store.reduce((max, s) => Math.max(max, s.id), 0) + 1,
      name: data.name ?? "",
      quantity: data.quantity ?? 0,
      unit: data.unit ?? "units",
    };
    setSuppliesStore([...store, newSupplies]);
    return newSupplies;
  },

  updateOne: async (id, data) => {
    const store = getSuppliesStore();
    let updated: Supplies | null = null;
    setSuppliesStore(
      store.map((s) => {
        if (s.id === Number(id)) {
          updated = { ...s, ...data };
          return updated;
        }
        return s;
      })
    );
    if (!updated) throw new Error("Supplies not found");
    return updated;
  },

  deleteOne: async (id) => {
    const store = getSuppliesStore();
    setSuppliesStore(store.filter((s) => s.id !== Number(id)));
  },

  validate: z
    .object({
      name: z.string().nonempty("Name is required"),
      quantity: z.number().min(0, "Quantity must be at least 0"),
      unit: z.string().nonempty("Unit is required"),
    })
    ["~standard"].validate,
};

export const suppliesCache = new DataSourceCache();
