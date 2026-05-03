import { useMemo, useState } from "react";
import { useRecipes } from "../context/RecipeContext.js";

// Converts the multiline ingredient textarea value into a clean array of ingredient names.
function parseIngredients(ingredientText) {
  return ingredientText
    .split("\n")
    .map((ingredient) => ingredient.trim())
    .filter(Boolean);
}

// Displays the form used to create and save a new recipe.
export function RecipeForm() {
  const { addRecipe } = useRecipes();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredientText, setIngredientText] = useState("");
  const [formMessage, setFormMessage] = useState("");

  const ingredientPreview = useMemo(
    () => parseIngredients(ingredientText),
    [ingredientText],
  );
  const canSubmit = title.trim().length > 0 && ingredientPreview.length > 0;

  // Validates the form, saves the recipe through context, and resets the fields.
  function handleSubmit(event) {
    event.preventDefault();

    if (!canSubmit) {
      setFormMessage("Add a recipe name and at least one ingredient.");
      return;
    }

    addRecipe({
      title: title.trim(),
      description: description.trim(),
      ingredients: ingredientPreview,
    });

    setTitle("");
    setDescription("");
    setIngredientText("");
    setFormMessage("Recipe saved locally in your browser.");
  }

  return (
    <section
      className="panel recipe-form-card"
      aria-labelledby="recipe-form-title"
    >
      <div className="section-heading">
        <p className="eyebrow">Create</p>
        <h2 id="recipe-form-title">Add a new recipe</h2>
        <p>
          Enter a recipe name and list each ingredient on its own line. The app
          stores your recipes in local storage to simulate a backend save.
        </p>
      </div>

      <form className="recipe-form" onSubmit={handleSubmit}>
        <label htmlFor="recipe-title">Recipe name</label>
        <input
          id="recipe-title"
          type="text"
          placeholder="e.g. Tomato basil soup"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <label htmlFor="recipe-description">Short description</label>
        <textarea
          id="recipe-description"
          rows="3"
          placeholder="What makes this recipe useful or delicious?"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        <label htmlFor="recipe-ingredients">Ingredients</label>
        <textarea
          id="recipe-ingredients"
          rows="7"
          placeholder={"1 cup rice\n2 eggs\nFresh herbs"}
          value={ingredientText}
          onChange={(event) => setIngredientText(event.target.value)}
        />

        {ingredientPreview.length > 0 && (
          <div className="ingredient-preview" aria-live="polite">
            <span>Preview:</span>
            {ingredientPreview.map((ingredient) => (
              <span className="preview-pill" key={ingredient}>
                {ingredient}
              </span>
            ))}
          </div>
        )}

        <button className="primary-button" type="submit" disabled={!canSubmit}>
          Save recipe
        </button>
        <p className="form-message" aria-live="polite">
          {formMessage}
        </p>
      </form>
    </section>
  );
}
