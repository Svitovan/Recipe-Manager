import { useMemo, useState } from "react";
import { useRecipes } from "../context/RecipeContext.js";
import { RecipeCard } from "./RecipeCard.jsx";

// Displays saved recipes and lets the user search by title, description, or ingredient.
export function RecipeList() {
  const { recipes } = useRecipes();
  const [query, setQuery] = useState("");

  // Filters recipes based on the current search query.
  const filteredRecipes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return recipes;
    }

    return recipes.filter((recipe) => {
      const searchableRecipe = [
        recipe.title,
        recipe.description,
        ...recipe.ingredients,
      ]
        .join(" ")
        .toLowerCase();

      return searchableRecipe.includes(normalizedQuery);
    });
  }, [query, recipes]);

  return (
    <section
      className="panel recipe-list-card"
      aria-labelledby="recipe-list-title"
    >
      <div className="section-heading list-heading">
        <div>
          <p className="eyebrow">Cookbook</p>
          <h2 id="recipe-list-title">Your recipes</h2>
          <p>Search by recipe name, note, or ingredient.</p>
        </div>
        <label className="search-label" htmlFor="recipe-search">
          Search
          <input
            id="recipe-search"
            type="search"
            placeholder="Find a recipe"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>

      {recipes.length === 0 ? (
        <p className="empty-state">No recipes yet. Create your first one.</p>
      ) : filteredRecipes.length === 0 ? (
        <p className="empty-state">No recipes matched “{query}”.</p>
      ) : (
        <div className="recipe-grid">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </section>
  );
}
