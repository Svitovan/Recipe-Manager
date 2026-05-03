import { useMemo } from "react";
import { useRecipes } from "../context/RecipeContext.js";
import { IngredientList } from "./IngredientList.jsx";

const dateFormatter = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

// Displays one recipe card with its date, title, description, ingredients, and delete action.
export function RecipeCard({ recipe }) {
  const { deleteRecipe } = useRecipes();

  // Formats the recipe creation date and falls back to a friendly label for invalid dates.
  const createdDate = useMemo(() => {
    const date = new Date(recipe.createdAt);

    if (Number.isNaN(date.getTime())) {
      return "Recently";
    }

    return dateFormatter.format(date);
  }, [recipe.createdAt]);

  return (
    <article className="recipe-card">
      <div className="recipe-card-header">
        <div>
          <span className="recipe-date">{createdDate}</span>
          <h3>{recipe.title}</h3>
        </div>
        <button
          className="ghost-button"
          type="button"
          onClick={() => deleteRecipe(recipe.id)}
          aria-label={`Delete ${recipe.title}`}
        >
          Delete
        </button>
      </div>

      {recipe.description && (
        <p className="recipe-description">{recipe.description}</p>
      )}

      <IngredientList ingredients={recipe.ingredients} />
    </article>
  );
}
