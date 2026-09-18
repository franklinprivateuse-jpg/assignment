import { Routes, Route } from 'react-router-dom';
import Home from '../pages/home/Home';
import About from '../pages/about/About';
import Education from '../pages/education/Education';
import Knowledge from '../pages/knowledge/Knowledge';
import Gallery from '../pages/gallery/Gallery';
import Videos from '../pages/videos/Videos';
import Blog from '../pages/blog/Blog';
import Messaging from '../pages/messaging/Messaging';
import Readme from '../pages/readme/Readme';

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
      <Route path="/messaging" element={<Messaging />} />
      <Route path="/readme" element={<Readme />} />
    </Routes>
  );
};

export default AppRouter;