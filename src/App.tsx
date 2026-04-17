import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useHiddenPosts } from "./hooks/useHiddenPosts";
import HomePage from "./pages/HomePage";
import HiddenPage from "./pages/HiddenPage";
import "./App.css";

function App() {
  const { hiddenIds, hidePost, unhidePost } = useHiddenPosts();
  const location = useLocation();

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">🔓 LEAKED DATA VIEWER</h1>
          <nav className="nav">
            <Link
              to="/"
              className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
            >
              📋 Posts
            </Link>
            <Link
              to="/hidden"
              className={`nav-link ${location.pathname === "/hidden" ? "active" : ""}`}
            >
              🔒 Hidden ({hiddenIds.size})
            </Link>
          </nav>
        </div>
      </header>

      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage hiddenIds={hiddenIds} onHidePost={hidePost} />
            }
          />
          <Route
            path="/hidden"
            element={
              <HiddenPage hiddenIds={hiddenIds} onUnhidePost={unhidePost} />
            }
          />
        </Routes>
      </main>

      <footer className="app-footer">
        <p>Data sourced from compromised servers • For educational purposes only</p>
      </footer>
    </div>
  );
}

export default App;
