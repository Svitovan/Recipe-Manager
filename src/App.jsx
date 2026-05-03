import "./App.css";
import { RecipeForm } from "./components/RecipeForm.jsx";
import { RecipeList } from "./components/RecipeList.jsx";
import { RecipeStats } from "./components/RecipeStats.jsx";
import { RecipeProvider } from "./context/RecipeProvider.jsx";

// Builds the main application layout and wraps all recipe UI in RecipeProvider.
function App() {
  return (
    <RecipeProvider>
      <div className="app-shell">
        <header className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">Recipe Manager</p>
            <h1>Build a local cookbook one recipe at a time.</h1>
            <p className="hero-description">
              Create recipes, track ingredients, and keep your entries available
              in the browser with simulated local storage.
            </p>
          </div>
          <RecipeStats />
        </header>

        <main className="content-grid">
          <RecipeForm />
          <RecipeList />
        </main>
      </div>
    </RecipeProvider>
  );
}

export default App;
