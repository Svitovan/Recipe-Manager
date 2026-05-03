import { useCallback, useEffect, useMemo, useState } from "react";
import { RecipeContext } from "./RecipeContext.js";

const STORAGE_KEY = "recipe-manager:recipes";

const STARTER_RECIPES = [
  {
    id: "starter-overnight-oats",
    title: "Berry Overnight Oats",
    description:
      "A quick make-ahead breakfast with fruit and crunchy toppings.",
    ingredients: [
      "Rolled oats",
      "Greek yogurt",
      "Milk",
      "Mixed berries",
      "Honey",
    ],
    createdAt: "2025-01-07T08:00:00.000Z",
  },
  {
    id: "starter-pasta",
    title: "Garlic Lemon Pasta",
    description: "Simple weeknight pasta with a bright lemon finish.",
    ingredients: [
      "Spaghetti",
      "Garlic",
      "Lemon",
      "Olive oil",
      "Parmesan",
      "Parsley",
    ],
    createdAt: "2025-01-08T18:30:00.000Z",
  },
];

// Creates a unique id for a new recipe, using the browser crypto API when available.
function createRecipeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// Cleans recipe data loaded from storage and fills in safe default values when needed.
function normalizeRecipe(recipe, index) {
  const title = typeof recipe.title === "string" ? recipe.title.trim() : "";
  const description =
    typeof recipe.description === "string" ? recipe.description.trim() : "";
  const ingredients = Array.isArray(recipe.ingredients)
    ? recipe.ingredients
        .filter((ingredient) => typeof ingredient === "string")
        .map((ingredient) => ingredient.trim())
        .filter(Boolean)
    : [];

  return {
    id: typeof recipe.id === "string" ? recipe.id : `recipe-${index}`,
    title: title || "Untitled recipe",
    description,
    ingredients,
    createdAt:
      typeof recipe.createdAt === "string"
        ? recipe.createdAt
        : new Date().toISOString(),
  };
}

// Loads saved recipes from localStorage, or returns starter recipes when none are available.
function loadRecipes() {
  try {
    const savedRecipes = localStorage.getItem(STORAGE_KEY);

    if (!savedRecipes) {
      return STARTER_RECIPES;
    }

    const parsedRecipes = JSON.parse(savedRecipes);

    if (!Array.isArray(parsedRecipes)) {
      return STARTER_RECIPES;
    }

    return parsedRecipes.map(normalizeRecipe);
  } catch (error) {
    console.warn("Could not load recipes from local storage.", error);
    return STARTER_RECIPES;
  }
}

// Provides recipe state, actions, statistics, and persistence to the rest of the app.
export function RecipeProvider({ children }) {
  const [recipes, setRecipes] = useState(loadRecipes);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
    } catch (error) {
      console.warn("Could not save recipes to local storage.", error);
    }
  }, [recipes]);

  // Adds a new recipe to the beginning of the recipe list and returns its generated id.
  const addRecipe = useCallback((recipe) => {
    const newRecipe = {
      id: createRecipeId(),
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients,
      createdAt: new Date().toISOString(),
    };

    setRecipes((currentRecipes) => [newRecipe, ...currentRecipes]);
    return newRecipe.id;
  }, []);

  // Removes a recipe from the list by matching its id.
  const deleteRecipe = useCallback((recipeId) => {
    setRecipes((currentRecipes) =>
      currentRecipes.filter((recipe) => recipe.id !== recipeId),
    );
  }, []);

  // Calculates summary statistics from the current recipe list.
  const recipeStats = useMemo(() => {
    const ingredientCount = recipes.reduce(
      (total, recipe) => total + recipe.ingredients.length,
      0,
    );
    const averageIngredients = recipes.length
      ? Math.round((ingredientCount / recipes.length) * 10) / 10
      : 0;

    return {
      recipeCount: recipes.length,
      ingredientCount,
      averageIngredients,
    };
  }, [recipes]);

  // Builds the context value shared with all components that call useRecipes.
  const value = useMemo(
    () => ({
      addRecipe,
      deleteRecipe,
      recipeStats,
      recipes,
    }),
    [addRecipe, deleteRecipe, recipeStats, recipes],
  );

  return (
    <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>
  );
}
