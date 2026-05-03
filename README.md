# Recipe Manager

A simple React + Vite frontend application for creating and managing recipes locally in the browser.

## What was built

- A recipe creation form with fields for recipe name, description, and multiline ingredients.
- A reusable ingredient architecture where `IngredientItem` is separated from `IngredientList` and recipe display components.
- A searchable recipe list with recipe cards and delete actions.
- Simulated data storage using `localStorage`, so recipes persist across page refreshes without a backend.
- Summary stats showing total recipes, total ingredients, and average ingredients per recipe.

## React concepts used

- `useState` for form fields, search input, and recipe state.
- `useEffect` for syncing recipes to local browser storage.
- `useMemo` for derived data such as ingredient previews, recipe filtering, dates, context values, and statistics.
- `useContext` through a custom `useRecipes` hook for sharing recipe data and actions across components.

## Project structure

- `src/context/RecipeProvider.jsx` manages recipe state, derived stats, and persistence.
- `src/context/RecipeContext.js` exposes the recipe context and custom hook.
- `src/components/RecipeForm.jsx` handles recipe creation.
- `src/components/RecipeList.jsx` handles searching and rendering recipes.
- `src/components/RecipeCard.jsx` displays one recipe.
- `src/components/IngredientList.jsx` and `src/components/IngredientItem.jsx` display ingredients as reusable components.
- `src/components/RecipeStats.jsx` displays cookbook statistics.

## Run locally

1. Install dependencies:

   `npm install`

2. Start the development server:

   `npm run dev`

3. Create a recipe and refresh the browser to see local persistence in action.

## Other scripts

- `npm run build` creates a production build.
- `npm run lint` checks the project with ESLint.
