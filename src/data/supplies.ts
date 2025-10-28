import { DataModel, DataSource, DataSourceCache } from "@toolpad/core/Crud";
import { z } from "zod";

export interface Supplies extends DataModel {
  id: number;
  nombre: string;
  cantidad: number;
  unidad: string; // kg, litros, cajas, etc.
}

// Datos iniciales
const INITIAL_SUPPLIES_STORE: Supplies[] = [
  { id: 1, nombre: "Leche", cantidad: 50, unidad: "litros" },
  { id: 2, nombre: "Azucar", cantidad: 20, unidad: "kilogramos" },
  { id: 3, nombre: "Copa", cantidad: 200, unidad: "unidades" },
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
    { field: "nombre", headerName: "Nombre", width: 200 },
    { field: "cantidad", headerName: "Cantidad", type: "number", width: 120 },
    { field: "unidad", headerName: "Unidad", width: 100 },
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
    if (!supply) throw new Error("Insumo no encontrado");
    return supply;
  },

  createOne: async (data) => {
    const store = getSuppliesStore();
    const newSupplies: Supplies = {
      id: store.reduce((max, s) => Math.max(max, s.id), 0) + 1,
      nombre: data.nombre ?? "",
      cantidad: data.cantidad ?? 0,
      unidad: data.unidad ?? "unidades",
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
    if (!updated) throw new Error("Insumo no encontrado");
    return updated;
  },

  deleteOne: async (id) => {
    const store = getSuppliesStore();
    setSuppliesStore(store.filter((s) => s.id !== Number(id)));
  },

  validate: z
    .object({
      nombre: z.string().nonempty("Nombre es requerido"),
      cantidad: z.number().min(0, "Cantidad debe ser al menos 0"),
      unidad: z.string().nonempty("Unidad es requerida"),
    })
    ["~standard"].validate,
};

export const suppliesCache = new DataSourceCache();
