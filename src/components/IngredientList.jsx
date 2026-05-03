import { IngredientItem } from "./IngredientItem.jsx";

// Renders all ingredients for a recipe by creating one IngredientItem per ingredient.
export function IngredientList({ ingredients }) {
  return (
    <ul className="ingredient-list" aria-label="Ingredients">
      {ingredients.map((ingredient) => (
        <IngredientItem ingredient={ingredient} key={ingredient} />
      ))}
    </ul>
  );
}
