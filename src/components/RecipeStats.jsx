import { useRecipes } from "../context/RecipeContext.js";

// Shows summary statistics for the current recipe collection.
export function RecipeStats() {
  const { recipeStats } = useRecipes();

  return (
    <section className="stats-grid" aria-label="Recipe summary">
      <div className="stat-card">
        <strong>{recipeStats.recipeCount}</strong>
        <span>Recipes</span>
      </div>
      <div className="stat-card">
        <strong>{recipeStats.ingredientCount}</strong>
        <span>Ingredients</span>
      </div>
      <div className="stat-card">
        <strong>{recipeStats.averageIngredients}</strong>
        <span>Avg. ingredients</span>
      </div>
    </section>
  );
}
