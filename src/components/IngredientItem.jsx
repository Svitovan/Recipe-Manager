// Displays a single ingredient inside the ingredient list.
export function IngredientItem({ ingredient }) {
  return (
    <li className="ingredient-item">
      <span className="ingredient-bullet" aria-hidden="true">
        •
      </span>
      <span>{ingredient}</span>
    </li>
  );
}
