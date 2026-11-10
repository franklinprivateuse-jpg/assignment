// HashRouter enables client-side routing with hash-based URLs (e.g. /#/about),
// which works correctly on static hosts like GitHub Pages where refreshing
// a sub-route would otherwise return a 404 from the server.
import { HashRouter } from 'react-router-dom';
// Global navigation bar displayed on every page
import Navbar from './components/navbar/Navbar';
// Application route definitions and page components
import AppRouter from './app/AppRouter';

/**
 * Root application component.
 * Wraps the entire app with HashRouter to enable routing on static hosts,
 * and renders the persistent Navbar along with the routed page content.
 */
const App: React.FC = () => {
  return (
    <HashRouter>
      <Navbar />
      <AppRouter />
    </HashRouter>
  );
};

export default App;