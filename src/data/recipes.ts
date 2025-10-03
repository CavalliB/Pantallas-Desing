import { DataModel, DataSource, DataSourceCache } from "@toolpad/core/Crud";
import { z } from "zod";

// Modelo de receta
export interface Recipe extends DataModel {
  id: number;
  name: string;
  description: string;
  ingredients: string[]; // lista simple de ingredientes
  createdAt: string;
}

// Datos iniciales de ejemplo
const INITIAL_RECIPES_STORE: Recipe[] = [
  {
    id: 1,
    name: "Helado de Vainilla",
    description: "Receta clásica de helado de vainilla artesanal.",
    ingredients: ["Leche", "Crema", "Azúcar", "Vainilla"],
    createdAt: new Date().toISOString(),
  },
];

// Helpers de persistencia en localStorage
const getRecipesStore = (): Recipe[] => {
  const value = localStorage.getItem("recipes-store");
  return value ? JSON.parse(value) : INITIAL_RECIPES_STORE;
};

const setRecipesStore = (value: Recipe[]) => {
  localStorage.setItem("recipes-store", JSON.stringify(value));
};

// DataSource para el CRUD
export const recipesDataSource: DataSource<Recipe> = {
  fields: [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "description", headerName: "Description", width: 300 },
    {
      field: "ingredients",
      headerName: "Ingredients",
      width: 300,
      valueGetter: (params: any) =>
        Array.isArray(params?.row?.ingredients)
          ? params.row.ingredients.join(", ")
          : "",
    },
    {
      field: "createdAt",
      headerName: "Created At",
      type: "dateTime",
      width: 200,
      valueGetter: (params: any) =>
        params?.row?.createdAt ? new Date(params.row.createdAt) : null,
    },
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
      name: data.name ?? "Unnamed Recipe",
      description: data.description ?? "",
      ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
      createdAt: new Date().toISOString(),
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

    if (!updatedRecipe) throw new Error("Recipe not found");
    return updatedRecipe;
  },

  deleteOne: async (id) => {
    const recipesStore = getRecipesStore();
    setRecipesStore(recipesStore.filter((r) => r.id !== Number(id)));
  },

  validate: z
    .object({
      name: z.string().min(1, "Name is required"),
      description: z.string().optional(),
      ingredients: z.array(z.string()).default([]),
    })
    ["~standard"].validate,
};

export const recipesCache = new DataSourceCache();
