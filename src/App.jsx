import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Header';
import Catalog from './Catalog';
import Blog from './Blog';
import Contact from './Contact';
import Admin from './Admin';
import Footer from './Footer';

export default function App() {
  return (
    <BrowserRouter>
      {/* Wrapper to ensure Footer sticks to the bottom */}
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Catalog />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </BrowserRouter>
  );
}