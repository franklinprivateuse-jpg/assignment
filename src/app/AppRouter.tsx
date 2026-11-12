import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// Page components — lazy-loaded so each page is split into its own chunk,
// reducing the initial bundle size and improving first paint performance
const Home = lazy(() => import('../pages/home/Home'));
const About = lazy(() => import('../pages/about/About'));
const Education = lazy(() => import('../pages/education/Education'));
const Knowledge = lazy(() => import('../pages/knowledge/Knowledge'));
const Gallery = lazy(() => import('../pages/gallery/Gallery'));
const Videos = lazy(() => import('../pages/videos/Videos'));
const Blog = lazy(() => import('../pages/blog/Blog'));
const BlogDetail = lazy(() => import('../pages/blog/BlogDetail'));
const Messaging = lazy(() => import('../pages/messaging/Messaging'));
const Readme = lazy(() => import('../pages/readme/Readme'));
const NotFound = lazy(() => import('../pages/notfound/NotFound'));
// Admin page — not in the public navbar; owner navigates to /admin directly
const Admin = lazy(() => import('../pages/admin/Admin'));

/** Loading indicator shown while a lazy-loaded page chunk downloads */
const PageFallback: React.FC = () => (
  <div
    style={{
      padding: '4rem 0',
      textAlign: 'center',
      color: 'var(--color-text-secondary)',
    }}
  >
    Loading...
  </div>
);

/** Central route configuration — maps URL paths to lazy-loaded page components */
const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<PageFallback />}>
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
    </Suspense>
  );
};

export default AppRouter;