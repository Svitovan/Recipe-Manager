import { createContext, useContext } from "react";

export const RecipeContext = createContext(null);

// Gives components access to recipe context data and verifies they are inside RecipeProvider.
export function useRecipes() {
  const context = useContext(RecipeContext);

  if (!context) {
    throw new Error("useRecipes must be used inside a RecipeProvider");
  }

  return context;
}
