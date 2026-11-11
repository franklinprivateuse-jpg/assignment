import { Routes, Route } from 'react-router-dom';
// Page components
import Home from '../pages/home/Home';
import About from '../pages/about/About';
import Education from '../pages/education/Education';
import Knowledge from '../pages/knowledge/Knowledge';
import Gallery from '../pages/gallery/Gallery';
import Videos from '../pages/videos/Videos';
import Blog from '../pages/blog/Blog';
import BlogDetail from '../pages/blog/BlogDetail';
import Messaging from '../pages/messaging/Messaging';
import Readme from '../pages/readme/Readme';
import NotFound from '../pages/notfound/NotFound';
// Admin page — not in the public navbar; owner navigates to /admin directly
import Admin from '../pages/admin/Admin';

/** Central route configuration — maps URL paths to page components */
const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/education" element={<Education />} />
      <Route path="/knowledge" element={<Knowledge />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/videos" element={<Videos />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:id" element={<BlogDetail />} />
      <Route path="/messaging" element={<Messaging />} />
      <Route path="/readme" element={<Readme />} />
      {/* Admin dashboard — hidden from navbar, accessed via direct URL */}
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;