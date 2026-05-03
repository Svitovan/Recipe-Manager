# Recipe Manager

Recipe Manager is a React + Vite single-page application for building a small cookbook in the browser. Users can add recipes, list ingredients, search saved recipes, delete recipes, and view summary statistics. The app does not use a backend server; it simulates persistence by saving recipe data to the browser's `localStorage`.

## What the app does

- Displays a polished recipe manager dashboard.
- Starts with two sample recipes when no saved data exists.
- Lets users create a new recipe with:
  - recipe name
  - short description
  - multiline ingredient list
- Converts each ingredient line into an ingredient item.
- Shows a live ingredient preview before saving.
- Saves recipes in local browser storage so they remain after refresh.
- Lists all saved recipes as cards.
- Allows users to search recipes by title, description, or ingredient.
- Allows users to delete recipes.
- Shows recipe statistics:
  - total number of recipes
  - total number of ingredients
  - average ingredients per recipe

## How the app works

The application is organized around a shared recipe context. `RecipeProvider` owns the recipe state and exposes that state, derived statistics, and recipe actions to the rest of the component tree. Components use the custom `useRecipes` hook to read from the context instead of passing recipe data through many layers of props.

At startup, the app follows this flow:

1. `main.jsx` renders the root React application inside `StrictMode`.
2. `App.jsx` wraps the UI in `RecipeProvider`.
3. `RecipeProvider` initializes the `recipes` state by calling `loadRecipes`.
4. `loadRecipes` checks `localStorage` for saved recipes using the key `recipe-manager:recipes`.
5. If saved recipes exist and are valid, they are normalized and loaded into state.
6. If no saved recipes exist, or if stored data is invalid, the app uses the starter recipes.
7. The provider passes recipes, actions, and statistics through `RecipeContext`.
8. UI components call `useRecipes` to access the shared data.

When a user creates a recipe:

1. `RecipeForm` tracks the form fields with local component state.
2. The ingredient textarea is split by line breaks.
3. Empty ingredient lines are removed.
4. The submit button is enabled only when a recipe title and at least one ingredient are present.
5. On submit, `RecipeForm` calls `addRecipe` from context.
6. `RecipeProvider` creates a new recipe object with an id and creation date.
7. The new recipe is inserted at the beginning of the recipe list.
8. The form clears and shows a success message.
9. The `useEffect` in `RecipeProvider` writes the updated recipe array to `localStorage`.

When a user searches:

1. `RecipeList` stores the search input in local state.
2. A memoized filter checks the recipe title, description, and ingredients.
3. Matching recipes are rendered as `RecipeCard` components.
4. If no recipes match, the app displays an empty search message.

When a user deletes a recipe:

1. The delete button in `RecipeCard` calls `deleteRecipe` from context.
2. `RecipeProvider` removes the matching recipe by id.
3. React re-renders the recipe list and statistics.
4. The updated recipe list is saved to `localStorage`.

## Data model

Each recipe is represented as an object with this shape:

- `id`: unique recipe identifier.
- `title`: recipe name displayed in cards and used by search.
- `description`: optional short note about the recipe.
- `ingredients`: array of ingredient strings.
- `createdAt`: ISO date string used to display when the recipe was created.

Example recipe data:

- `id`: `starter-overnight-oats`
- `title`: `Berry Overnight Oats`
- `description`: `A quick make-ahead breakfast with fruit and crunchy toppings.`
- `ingredients`: `['Rolled oats', 'Greek yogurt', 'Milk', 'Mixed berries', 'Honey']`
- `createdAt`: `2025-01-07T08:00:00.000Z`

## Persistence

The app stores recipes in `localStorage` under this key:

- `recipe-manager:recipes`

This means recipes are saved locally in the current browser. They are not shared between devices, users, browsers, or private/incognito sessions. Clearing browser storage will remove saved recipes and the app will fall back to the starter recipes.

`RecipeProvider` also protects the app from invalid stored data. If the saved value cannot be parsed as JSON, or if the parsed value is not an array, the app uses the starter recipes instead.

## Project structure

- `src/main.jsx`: React entry point. Mounts the app into the DOM.
- `src/App.jsx`: Main application layout. Wraps the page in `RecipeProvider` and renders the hero, stats, form, and recipe list.
- `src/App.css`: Component and layout styling for the application shell, panels, cards, form, buttons, stats, and responsive layout.
- `src/index.css`: Global styling, base element styles, and root-level CSS setup.
- `src/context/RecipeContext.js`: Creates the recipe context and exports the `useRecipes` hook.
- `src/context/RecipeProvider.jsx`: Stores recipe state, loads and saves local data, defines recipe actions, calculates statistics, and provides context values.
- `src/components/RecipeForm.jsx`: Form for creating new recipes.
- `src/components/RecipeList.jsx`: Searchable list of saved recipes.
- `src/components/RecipeCard.jsx`: Card display for a single recipe.
- `src/components/IngredientList.jsx`: Renders a recipe's ingredient collection.
- `src/components/IngredientItem.jsx`: Renders one ingredient row.
- `src/components/RecipeStats.jsx`: Displays summary statistics.
- `src/assets/`: Static assets used by the project.

## Component and module descriptions

### `main.jsx`

`main.jsx` is the application entry point. It imports React, React DOM, global CSS, and `App`. It finds the root DOM element with `document.getElementById('root')` and renders the app with `createRoot`. The app is wrapped in `StrictMode`, which helps highlight potential React issues during development.

### `App.jsx`

`App` defines the top-level UI structure. It wraps the entire interface in `RecipeProvider`, making recipe state available to every child component.

Inside the provider, `App` renders:

- a hero/header section with the app title and description
- `RecipeStats`, which shows cookbook summary data
- a main content grid containing:
  - `RecipeForm`
  - `RecipeList`

`App` does not manage recipe state directly. Its main responsibility is composition and page layout.

### `RecipeContext.js`

`RecipeContext.js` contains the shared React context setup.

It exports:

- `RecipeContext`: the context object created with `createContext(null)`.
- `useRecipes`: a custom hook that reads the context with `useContext`.

`useRecipes` also validates that it is called inside a `RecipeProvider`. If a component tries to use recipe data outside the provider, the hook throws this error:

- `useRecipes must be used inside a RecipeProvider`

This makes mistakes easier to find during development.

### `RecipeProvider.jsx`

`RecipeProvider` is the main state management module for the app. It is responsible for recipe data, persistence, actions, and derived statistics.

It contains:

- `STORAGE_KEY`: the `localStorage` key used to save recipes.
- `STARTER_RECIPES`: sample recipes shown the first time the app runs.
- `createRecipeId`: creates a unique recipe id using `crypto.randomUUID()` when available, with a timestamp/random fallback.
- `normalizeRecipe`: cleans and validates recipe data loaded from storage.
- `loadRecipes`: reads recipes from `localStorage` and falls back to starter data when needed.
- `RecipeProvider`: the React provider component.

The provider manages:

- `recipes`: the main array of recipe objects.
- `addRecipe`: adds a new recipe to the beginning of the array.
- `deleteRecipe`: removes a recipe by id.
- `recipeStats`: memoized derived statistics.
- `value`: memoized context value shared with child components.

The provider uses several React hooks:

- `useState` to store recipes.
- `useEffect` to save recipes whenever they change.
- `useCallback` to keep action functions stable.
- `useMemo` to avoid unnecessary recalculation of statistics and context values.

Because this project uses React 19, the provider can be rendered using the shorthand context provider syntax:

- `<RecipeContext value={value}>{children}</RecipeContext>`

In React 18 and earlier, the equivalent would usually be `RecipeContext.Provider`.

### `RecipeForm.jsx`

`RecipeForm` handles new recipe creation.

It manages local state for:

- `title`: recipe name input.
- `description`: short description textarea.
- `ingredientText`: multiline ingredient textarea.
- `formMessage`: feedback message shown after validation or save.

It includes a helper function, `parseIngredients`, which:

1. Splits the ingredient textarea by newline.
2. Trims whitespace from each line.
3. Removes empty lines.
4. Returns an array of clean ingredient strings.

`RecipeForm` uses `useMemo` to calculate `ingredientPreview` only when `ingredientText` changes. This preview is displayed as pill-style labels before the recipe is saved.

The form can be submitted only when:

- the title is not empty
- at least one ingredient exists

On successful submit, the component calls `addRecipe`, clears all fields, and displays the message:

- `Recipe saved locally in your browser.`

### `RecipeList.jsx`

`RecipeList` displays saved recipes and provides search functionality.

It reads `recipes` from the recipe context and keeps a local `query` state for the search input.

The component uses `useMemo` to calculate `filteredRecipes`. The search checks:

- recipe title
- recipe description
- ingredient names

Search is case-insensitive and ignores leading/trailing whitespace.

`RecipeList` displays three possible states:

1. No saved recipes: `No recipes yet. Create your first one.`
2. Recipes exist but none match the search: `No recipes matched “query”.`
3. Matching recipes exist: render a grid of `RecipeCard` components.

### `RecipeCard.jsx`

`RecipeCard` displays one recipe.

It receives a `recipe` prop and renders:

- formatted creation date
- recipe title
- delete button
- optional description
- ingredient list

It uses `useRecipes` to access `deleteRecipe`. When the delete button is clicked, it calls `deleteRecipe(recipe.id)`.

It also uses `useMemo` to format the recipe creation date. If `createdAt` is invalid, the component displays `Recently` instead of a broken date.

The ingredients are delegated to `IngredientList`, keeping `RecipeCard` focused on the recipe card layout rather than individual ingredient rendering.

### `IngredientList.jsx`

`IngredientList` receives an `ingredients` array and renders it as an unordered list.

For each ingredient, it renders an `IngredientItem` component. The key is built from the ingredient text and index, which is acceptable here because the list is simple and does not support reordering within a recipe.

This component keeps ingredient collection rendering separate from the recipe card.

### `IngredientItem.jsx`

`IngredientItem` renders a single ingredient as a list item.

It displays:

- a decorative bullet character
- the ingredient text

The bullet is marked with `aria-hidden="true"` because it is decorative and does not need to be announced by assistive technologies.

### `RecipeStats.jsx`

`RecipeStats` displays summary data from the recipe context.

It reads `recipeStats` using `useRecipes` and renders three stat cards:

- number of recipes
- total number of ingredients
- average ingredients per recipe

These values update automatically whenever recipes are added or deleted because they are derived from the provider's `recipes` state.

## React concepts used

This project demonstrates several core React concepts:

- Components for splitting UI into reusable pieces.
- Props for passing recipe and ingredient data into display components.
- `useState` for local form/search state and shared recipe state.
- `useEffect` for synchronizing recipe state with `localStorage`.
- `useMemo` for derived values such as ingredient previews, filtered recipes, formatted dates, recipe statistics, and context values.
- `useCallback` for stable action functions in context.
- `createContext` and `useContext` for shared app state.
- A custom hook, `useRecipes`, for cleaner context access and provider validation.

## File extension note

The context folder contains both `.js` and `.jsx` files intentionally:

- `RecipeContext.js` contains plain JavaScript and does not render JSX.
- `RecipeProvider.jsx` returns JSX, so the `.jsx` extension clearly communicates that it contains React markup.

This naming convention makes the project easier to read, although many React build tools can also support JSX inside `.js` files depending on configuration.

## Running the project locally

Install dependencies:

- `npm install`

Start the development server:

- `npm run dev`

Create a production build:

- `npm run build`

Preview the production build:

- `npm run preview`

Run ESLint:

- `npm run lint`

## Available scripts

- `npm run dev`: starts the Vite development server.
- `npm run build`: creates an optimized production build.
- `npm run preview`: serves the production build locally for preview.
- `npm run lint`: checks the project with ESLint.

## Technologies used

- React 19
- React DOM 19
- Vite 8
- ESLint
- Browser `localStorage`

## Limitations and possible improvements

Current limitations:

- Recipes are stored only in the current browser.
- There is no backend database or authentication.
- Recipes can be created and deleted, but not edited.
- Ingredient items are plain text only.
- There is no import/export feature.

Possible future improvements:

- Add recipe editing.
- Add categories or tags.
- Add preparation steps and cooking time.
- Add recipe images.
- Add sorting options.
- Add cloud persistence with a backend API.
- Add automated tests.
- Add confirmation before deleting a recipe.
