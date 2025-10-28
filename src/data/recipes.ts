import { DataModel, DataSource, DataSourceCache } from "@toolpad/core/Crud";
import { z } from "zod";

export interface Recipe extends DataModel {
  id: number;
  nombre: string;
  descripcion: string;
  //ingredients: string[]; // En desarrollo XD
}

const INITIAL_RECIPES_STORE: Recipe[] = [
  {
    id: 1,
    nombre: "Helado de Vainilla",
    descripcion: "Receta clásica de helado de vainilla artesanal.",
  },
];

const getRecipesStore = (): Recipe[] => {
  const value = localStorage.getItem("recipes-store");
  return value ? JSON.parse(value) : INITIAL_RECIPES_STORE;
};

const setRecipesStore = (value: Recipe[]) => {
  localStorage.setItem("recipes-store", JSON.stringify(value));
};

export const recipesDataSource: DataSource<Recipe> = {
  fields: [
    { field: "id", headerName: "ID", width: 90 },
    { field: "nombre", headerName: "Nombre", width: 200 },
    { field: "descripcion", headerName: "Descripcion", width: 300 },
  ],

  getMany: async ({ paginationModel }) => {
    const recipesStore = getRecipesStore();
    const start = paginationModel.page * paginationModel.pageSize;
    const end = start + paginationModel.pageSize;
    const paginatedRecipes = recipesStore.slice(start, end);

    return {
      items: paginatedRecipes,
      itemCount: recipesStore.length,
    };
  },

  getOne: async (id) => {
    const recipesStore = getRecipesStore();
    const recipe = recipesStore.find((r) => r.id === Number(id));
    if (!recipe) throw new Error("Recipe not found");
    return recipe;
  },

  createOne: async (data) => {
    const recipesStore = getRecipesStore();

    const newRecipe: Recipe = {
      id: recipesStore.reduce((max, r) => Math.max(max, r.id), 0) + 1,
      nombre: data.nombre ?? "Receta sin nombre",
      descripcion: data.descripcion ?? "",
    };

    setRecipesStore([...recipesStore, newRecipe]);
    return newRecipe;
  },

  updateOne: async (id, data) => {
    const recipesStore = getRecipesStore();
    let updatedRecipe: Recipe | null = null;

    setRecipesStore(
      recipesStore.map((r) => {
        if (r.id === Number(id)) {
          updatedRecipe = { ...r, ...data };
          return updatedRecipe;
        }
        return r;
      })
    );

    if (!updatedRecipe) throw new Error("Receta no encontrada");
    return updatedRecipe;
  },

  deleteOne: async (id) => {
    const recipesStore = getRecipesStore();
    setRecipesStore(recipesStore.filter((r) => r.id !== Number(id)));
  },

  validate: z
    .object({
      nombre: z.string().min(1, "Name is required"),
      descripcion: z.string().optional(),
    })
    ["~standard"].validate,
};

export const recipesCache = new DataSourceCache();
