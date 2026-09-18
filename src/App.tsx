// BrowserRouter enables client-side routing for the entire application
import { BrowserRouter } from 'react-router-dom';
// Global navigation bar displayed on every page
import Navbar from './components/navbar/Navbar';
// Application route definitions and page components
import AppRouter from './app/AppRouter';

/**
 * Root application component.
 * Wraps the entire app with BrowserRouter to enable routing,
 * and renders the persistent Navbar along with the routed page content.
 */
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <AppRouter />
    </BrowserRouter>
  );
};

export default App;