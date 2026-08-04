import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Heart, Maximize2, ArrowRight, Search, Shuffle, ExternalLink } from 'lucide-react';

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const activeCategory = searchParams.get('category') || 'All';
  const isNewView = searchParams.get('view') === 'new';

  const fetchDatabase = () => {
    const massiveDefaultCategories = [
      'Electronic Components', 'Resistors', 'Capacitors', 'ICs & Chips', 
      'Microcontrollers', 'Robotics', 'Sensors', 'Motors & Drivers', 
      'Displays', 'Power Supply', 'Tools', 'IoT & Wireless', 'Breadboards'
    ];

    const massiveDefaultProducts = [
      { id: 101, name: '100 ohm, 1/4 Watt Resistor (Pack of 10)', category: 'Resistors', price: '₹10.00', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80', productUrl: '#' },
      { id: 102, name: '10k ohm, 1/4 Watt Resistor (Pack of 10)', category: 'Resistors', price: '₹10.00', image: 'https://images.unsplash.com/photo-1608564697071-0f95109bc588?w=400&q=80', productUrl: '#' },
      { id: 103, name: '220 ohm, 1/4 Watt Resistor (Pack of 10)', category: 'Resistors', price: '₹10.00', image: 'https://images.unsplash.com/photo-1580983584897-40f413ee0c05?w=400&q=80', productUrl: '#' },
      { id: 104, name: '10W Cement Resistor 5 Ohm', category: 'Resistors', price: '₹25.00', image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=400&q=80', productUrl: '#' },
      { id: 105, name: 'SMD Resistor 0805 Array (100 pcs)', category: 'Resistors', price: '₹150.00', image: 'https://images.unsplash.com/photo-1517077304055-6e89abf0ceb6?w=400&q=80', productUrl: '#' },
      { id: 106, name: '1000uF 25V Electrolytic Capacitor (Pack of 5)', category: 'Capacitors', price: '₹30.00', image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=400&q=80', productUrl: '#' },
      { id: 107, name: '100uF 25V Electrolytic Capacitor (Pack of 5)', category: 'Capacitors', price: '₹15.00', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&q=80', productUrl: '#' },
      { id: 108, name: '100uF 25V SMD Aluminum Capacitor', category: 'Capacitors', price: '₹4.00', image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=400&q=80', productUrl: '#' },
      { id: 109, name: '104 Ceramic Capacitor 100nF (Pack of 20)', category: 'Capacitors', price: '₹20.00', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&q=80', productUrl: '#' },
      { id: 110, name: 'Tantalum Capacitor 10uF 16V SMD', category: 'Capacitors', price: '₹12.00', image: 'https://images.unsplash.com/photo-1620288627228-769a7c858f96?w=400&q=80', productUrl: '#' },
      { id: 111, name: 'NE555 Timer IC (DIP-8)', category: 'ICs & Chips', price: '₹12.00', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80', productUrl: '#' },
      { id: 112, name: 'LM358 Operational Amplifier IC', category: 'ICs & Chips', price: '₹15.00', image: 'https://images.unsplash.com/photo-1608564697071-0f95109bc588?w=400&q=80', productUrl: '#' },
      { id: 113, name: 'L293D Motor Driver IC', category: 'ICs & Chips', price: '₹45.00', image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=400&q=80', productUrl: '#' },
      { id: 114, name: 'ATmega328P-PU Microcontroller Chip', category: 'ICs & Chips', price: '₹220.00', image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=400&q=80', productUrl: '#' },
      { id: 115, name: 'SN74HC595N Shift Register', category: 'ICs & Chips', price: '₹25.00', image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=400&q=80', productUrl: '#' },
      { id: 116, name: 'Arduino Uno R3 Compatible Board', category: 'Microcontrollers', price: '₹1,200.00', image: 'https://images.unsplash.com/photo-1517077304055-6e89abf0ceb6?w=400&q=80', productUrl: '#' },
      { id: 117, name: 'Raspberry Pi 4 Model B - 8GB', category: 'Microcontrollers', price: '₹6,500.00', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&q=80', productUrl: '#' },
      { id: 118, name: 'ESP32 Development Board Type-C', category: 'Microcontrollers', price: '₹450.00', image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&q=80', productUrl: '#' },
      { id: 119, name: 'DIY Drone Frame Kit 250mm', category: 'Robotics', price: '₹2,500.00', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&q=80', productUrl: '#' },
      { id: 120, name: 'Ultrasonic Sensor HC-SR04', category: 'Sensors', price: '₹120.00', image: 'https://images.unsplash.com/photo-1620288627228-769a7c858f96?w=400&q=80', productUrl: '#' },
    ];

    let dbProducts = JSON.parse(localStorage.getItem('ktronic_products')) || [];
    let dbCategories = JSON.parse(localStorage.getItem('ktronic_categories')) || [];

    if (dbProducts.length < 20) {
      dbProducts = [...massiveDefaultProducts, ...dbProducts];
      localStorage.setItem('ktronic_products', JSON.stringify(dbProducts));
    }
    if (dbCategories.length < 10) {
      dbCategories = massiveDefaultCategories;
      localStorage.setItem('ktronic_categories', JSON.stringify(dbCategories));
    }

    setProducts(dbProducts);
    setCategories(['All', ...dbCategories]);
  };

  useEffect(() => {
    fetchDatabase();
    window.addEventListener('storage', fetchDatabase);
    return () => window.removeEventListener('storage', fetchDatabase);
  }, []);

  const carouselSlides = [
    { id: 1, title: 'The BEST GNSS Module', subtitle: 'Now comes at the SMALLEST form', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80', bg: 'from-[#4c1d95] to-[#3b0764]' },
    { id: 2, title: 'Next-Gen Robotics', subtitle: 'Build the future of automation', img: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&q=80', bg: 'from-[#065f46] to-[#022c22]' },
    { id: 3, title: 'Smart Home Hubs', subtitle: 'Seamless wireless integration', img: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=500&q=80', bg: 'from-[#0f172a] to-[#020617]' }
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev === carouselSlides.length - 1 ? 0 : prev + 1)), 4000);
    return () => clearInterval(timer);
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesCat = activeCategory === 'All' || p.category === activeCategory;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(searchLower) || p.category.toLowerCase().includes(searchLower);
    return matchesCat && matchesSearch;
  });

  const newlyAddedProducts = [...products].sort((a, b) => b.id - a.id).slice(0, 5);
  
  const activeCategoriesWithProducts = categories.filter(c => c !== 'All' && products.some(p => p.category === c));

  const popularCategoryData = [
    { name: 'Resistors', count: '140 products', img: 'https://images.unsplash.com/photo-1608564697071-0f95109bc588?w=300&q=80' },
    { name: 'Capacitors', count: '85 products', img: 'https://images.unsplash.com/photo-1580983584897-40f413ee0c05?w=300&q=80' },
    { name: 'ICs & Chips', count: '210 products', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&q=80' },
    { name: 'Robotics', count: '38 products', img: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&q=80' },
    { name: 'Microcontrollers', count: '89 products', img: 'https://images.unsplash.com/photo-1517077304055-6e89abf0ceb6?w=300&q=80' },
    { name: 'Sensors', count: '64 products', img: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=300&q=80' },
    { name: 'Tools', count: '22 products', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=300&q=80' },
  ];

  // --- CATALOG-FOCUSED CARD STYLES ---

  // Style 1: Exact Reference Style (Catalog Version - "See Details")
  const renderCardStyleEcommerce = (product, idx) => (
    <div key={product.id} className="bg-white border border-slate-100 rounded-xl flex flex-col hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 relative group overflow-hidden">
      <div className="absolute top-3 left-3 z-10">
        {idx % 2 === 0 && <span className="bg-[#2ed573] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">NEW</span>}
      </div>
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-1 rounded-lg shadow-md border border-slate-100">
         <button className="text-slate-400 hover:text-slate-800 transition-colors p-1.5"><Shuffle size={14}/></button>
         <button className="text-slate-400 hover:text-slate-800 transition-colors p-1.5"><Search size={14}/></button>
         <button className="text-slate-400 hover:text-rose-500 transition-colors p-1.5"><Heart size={14}/></button>
      </div>
      <Link to={product.productUrl || '#'} target="_blank" rel="noopener noreferrer" className="relative w-full aspect-square bg-white flex items-center justify-center p-6">
        <img src={product.image} className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" alt={product.name} />
      </Link>
      <div className="px-5 pt-2 pb-4 flex flex-col flex-grow bg-white text-left border-t border-slate-50">
        <Link to={product.productUrl || '#'} target="_blank" rel="noopener noreferrer" className="font-black text-slate-800 text-[14px] leading-snug mb-1 line-clamp-2 hover:text-[#2a64f6] transition-colors">
          {product.name}
        </Link>
        <p className="text-[11px] text-slate-400 mb-2 line-clamp-1">{product.category}</p>
        <div className="flex items-center gap-0.5 mb-2">
          {[...Array(5)].map((_, i) => (
             <svg key={i} className="w-3 h-3 text-slate-200" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
          ))}
        </div>
        <p className="text-[12px] text-[#2a64f6] font-bold flex items-center gap-1 mb-3">✓ In stock</p>
        <div className="mt-auto mb-4">
          <p className="font-black text-[#45c4f0] text-[17px]">{product.price}</p>
          <p className="text-[11px] text-slate-400 -mt-1">(inc. GST)</p>
        </div>
      </div>
      {/* Repurposed Button for Catalog Discovery */}
      <a href={product.productUrl || '#'} target="_blank" rel="noopener noreferrer" className="w-full bg-[#2a64f6] text-white text-[14px] font-bold py-3 hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2">
        See Details <ExternalLink size={16} />
      </a>
    </div>
  );

  // Style 2: Clean Shaded Tech Card (Catalog Version)
  const renderCardStyleTwo = (product, idx) => (
    <div key={product.id} className="bg-[#f8fafc] border border-slate-200 rounded-2xl flex flex-col hover:shadow-lg transition-all duration-300 relative group overflow-hidden">
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {idx % 3 === 0 && <span className="bg-[#ff4757] text-white text-[12px] font-black px-3 py-1 rounded shadow-sm">HOT</span>}
      </div>
      <Link to={product.productUrl || '#'} target="_blank" rel="noopener noreferrer" className="relative w-full aspect-square bg-white shrink-0 overflow-hidden flex items-center justify-center p-6 border-b border-slate-100">
        <img src={product.image} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500" alt={product.name} />
      </Link>
      <div className="px-6 py-5 flex flex-col flex-grow">
        <Link to={product.productUrl || '#'} target="_blank" rel="noopener noreferrer" className="font-extrabold text-slate-900 text-[16px] leading-snug mb-1 line-clamp-2 hover:text-[#45c4f0] transition-colors">
          {product.name}
        </Link>
        <p className="text-[13px] font-semibold text-slate-500 mb-3 line-clamp-1">{product.category}</p>
        <div className="mt-auto flex items-center justify-between">
          <p className="font-black text-slate-900 text-xl">{product.price}</p>
          <a href={product.productUrl || '#'} target="_blank" rel="noopener noreferrer" className="bg-[#45c4f0] text-white p-2 rounded-full shadow-sm hover:bg-[#2a64f6] transition-colors cursor-pointer"><ArrowRight size={16} /></a>
        </div>
      </div>
    </div>
  );

  // Style 3: Neo-brutalism Grid Card (Catalog Version)
  const renderCardStyleThree = (product, idx) => (
    <div key={product.id} className="bg-white border-2 border-slate-200 rounded-xl flex flex-col hover:border-[#45c4f0] hover:-translate-y-1 shadow-[4px_4px_0px_#e2e8f0] hover:shadow-[4px_4px_0px_#45c4f0] transition-all duration-300 relative group overflow-hidden">
      <div className="absolute top-3 left-3 z-10 bg-slate-900 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider line-clamp-1 max-w-[80%]">{product.category}</div>
      <Link to={product.productUrl || '#'} target="_blank" rel="noopener noreferrer" className="relative w-full aspect-square bg-slate-50 shrink-0 overflow-hidden flex items-center justify-center p-6 border-b-2 border-slate-200">
        <img src={product.image} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500 mix-blend-multiply" alt={product.name} />
      </Link>
      <div className="p-5 flex flex-col flex-grow">
        <Link to={product.productUrl || '#'} target="_blank" rel="noopener noreferrer" className="font-black text-slate-900 text-[16px] leading-snug mb-4 line-clamp-2">
          {product.name}
        </Link>
        <div className="mt-auto flex items-center justify-between border-t-2 border-dashed border-slate-200 pt-3">
          <p className="font-black text-[#2a64f6] text-lg">{product.price}</p>
          <a href={product.productUrl || '#'} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-rose-500 transition-colors"><ExternalLink size={20}/></a>
        </div>
      </div>
    </div>
  );

  // Style 4: Premium Dark Mode Card (Catalog Version)
  const renderCardStyleFour = (product, idx) => (
    <div key={product.id} className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col hover:shadow-[0_0_30px_rgba(69,196,240,0.2)] hover:border-[#45c4f0] transition-all duration-300 relative group overflow-hidden">
      <Link to={product.productUrl || '#'} target="_blank" rel="noopener noreferrer" className="relative w-full aspect-square bg-slate-800/50 shrink-0 overflow-hidden flex items-center justify-center p-8">
        <img src={product.image} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-700 drop-shadow-2xl" alt={product.name} />
      </Link>
      <div className="px-6 py-5 flex flex-col flex-grow z-10">
        <p className="text-[11px] font-bold text-[#45c4f0] mb-1 uppercase tracking-widest line-clamp-1">{product.category}</p>
        <Link to={product.productUrl || '#'} target="_blank" rel="noopener noreferrer" className="font-bold text-white text-[15px] leading-snug mb-3 line-clamp-2">
          {product.name}
        </Link>
        <div className="mt-auto flex items-center justify-between">
          <p className="font-black text-white text-lg">{product.price}</p>
          <a href={product.productUrl || '#'} target="_blank" rel="noopener noreferrer" className="bg-white text-slate-900 text-[11px] font-black px-4 py-2 rounded hover:bg-[#45c4f0] hover:text-white transition-colors">DETAILS</a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-nunito text-slate-800 pb-20 relative">
      
{/* WhatsApp Button */}
      <a href="https://wa.me/923214567" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 group flex items-center justify-center w-[64px] h-[64px]">
        <div className="absolute inset-0 bg-slate-200 rounded-full translate-y-1.5 translate-x-1.5 transition-transform duration-300 group-hover:translate-y-2.5 group-hover:translate-x-2.5 shadow-sm"></div>
        <div className="relative bg-[#25D366] text-white w-full h-full rounded-full shadow-md group-hover:-translate-y-1 group-hover:-translate-x-1 transition-transform duration-300 flex items-center justify-center">
          {/* New Full-Bleed SVG Icon */}
          <svg viewBox="0 0 24 24" className="w-[42px] h-[42px] fill-current -ml-0.5 -mt-0.5">
             <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </div>
      </a>

      <div className="max-w-[1400px] mx-auto px-4 py-6">
        
        {isNewView ? (
          <div className="animate-fade-in-up">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
              <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                <span className="bg-rose-500 text-white text-sm px-3 py-1 rounded-full animate-pulse">NEW</span>
                Freshly Arrived Products
              </h1>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {newlyAddedProducts.map((p, i) => renderCardStyleEcommerce(p, i))}
            </div>
          </div>
        ) : activeCategory === 'All' && !searchQuery ? (
          
          <div className="space-y-12 animate-fade-in-up">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-sm">
                {carouselSlides.map((slide, index) => (
                  <Link 
                    key={slide.id} 
                    to="/?category=Microcontrollers" 
                    className={`absolute inset-0 w-full h-full bg-gradient-to-br ${slide.bg} group flex items-center justify-center p-8 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                  >
                    <img src={slide.img} alt={slide.title} className="h-[250px] w-auto object-contain z-10 group-hover:scale-105 transition-transform duration-500 drop-shadow-2xl opacity-90 mix-blend-screen" />
                    <div className="absolute bottom-10 left-0 w-full text-center z-20">
                      <h2 className="text-white text-3xl font-black mb-1 drop-shadow-md">{slide.title}</h2>
                      <p className="text-white/80 text-sm font-bold tracking-widest uppercase">{slide.subtitle}</p>
                    </div>
                  </Link>
                ))}
                <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2 z-20">
                  {carouselSlides.map((_, i) => (
                    <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-6 bg-white' : 'w-2 bg-white/40'}`}></div>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col gap-4 h-[400px]">
                <Link to="/?category=Kits" className="relative block w-full h-[230px] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition bg-gradient-to-r from-[#7f1d1d] to-[#991b1b] group p-6 flex items-center">
                  <div className="z-20 w-1/2">
                    <h2 className="text-yellow-400 text-4xl font-black mb-1 leading-none">Cardputer Zero</h2>
                    <p className="text-white text-sm font-bold mb-4">A True Handheld Computer</p>
                    <p className="text-white underline text-xs font-bold hover:text-yellow-400 transition-colors">Click & Watch Our New YouTube Video</p>
                  </div>
                  <img src="https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=500&q=80" alt="Handheld" className="absolute right-0 bottom-0 h-full w-auto object-cover opacity-60 mix-blend-screen group-hover:scale-105 transition-transform duration-500" />
                </Link>

                <div className="grid grid-cols-2 gap-4 h-[154px]">
                  <Link to="/?category=IoT & Wireless" className="relative block w-full h-full rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition bg-[#1da1f2] p-5 flex flex-col justify-between group">
                    <div className="z-20">
                      <h3 className="text-white font-black text-xl mb-1">AI Pin</h3>
                      <p className="text-blue-100 text-xs font-bold">Powered by XIAOZHI</p>
                    </div>
                    <button className="bg-white text-[#1da1f2] text-xs font-black px-5 py-2 rounded-lg w-max hover:bg-slate-50 shadow-sm z-20 transition-transform group-hover:-translate-y-0.5">Explore</button>
                    <img src="https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=200&q=80" alt="AI Pin" className="absolute -right-4 -bottom-4 h-[120px] w-[120px] object-contain opacity-50 mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                  </Link>
                  
                  <Link to="/?category=Microcontrollers" className="relative block w-full h-full rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition bg-[#fbc531] p-5 flex flex-col justify-between group">
                    <div className="z-20">
                      <h3 className="text-white font-black text-xl mb-1">ESP32-S3 Based</h3>
                      <p className="text-yellow-100 text-xs font-bold">Camera Board</p>
                    </div>
                    <button className="bg-white text-[#fbc531] text-xs font-black px-5 py-2 rounded-lg w-max hover:bg-slate-50 shadow-sm z-20 transition-transform group-hover:-translate-y-0.5">Explore</button>
                    <img src="https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=200&q=80" alt="ESP32" className="absolute -right-2 -bottom-2 h-[100px] w-[100px] object-contain opacity-50 mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <h2 className="text-[22px] font-black text-slate-800 mb-6">Popular Categories</h2>
              <div className="flex overflow-x-auto pb-4 gap-5 custom-scrollbar no-scrollbar">
                {popularCategoryData.map((cat) => (
                  <Link to={`/?category=${encodeURIComponent(cat.name)}`} key={cat.name} className="bg-white rounded-2xl p-5 text-center hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all flex flex-col items-center justify-center gap-3 border border-slate-100 min-w-[160px] shrink-0">
                    <div className="w-16 h-16 bg-[#f8fafc] rounded-xl flex items-center justify-center overflow-hidden mb-1 border border-slate-100">
                      <img src={cat.img} alt={cat.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-[15px] text-slate-900 line-clamp-1">{cat.name}</span>
                      <span className="text-[12px] font-bold text-slate-400 mt-1">{cat.count}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {newlyAddedProducts.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-2">
                  <h2 className="text-[22px] font-black text-slate-800">Freshly Added</h2>
                  <Link to="/?view=new" className="text-[14px] font-bold text-[#45c4f0] bg-[#eef6ff] px-5 py-2 rounded-full hover:bg-[#dbeafe] transition-colors flex items-center gap-1">
                    See All <ArrowRight size={14}/>
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                  {newlyAddedProducts.map((p, i) => renderCardStyleEcommerce(p, i))}
                </div>
              </div>
            )}

            <div className="pt-6 space-y-16">
              {activeCategoriesWithProducts.map((cat, index) => {
                const catProducts = products.filter(p => p.category === cat).slice(0, 5); 
                const stylePattern = index % 4;
                
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-2">
                      <h2 className="text-[22px] font-black text-slate-800">{cat}</h2>
                      <Link to={`/?category=${encodeURIComponent(cat)}`} className="text-[14px] font-bold text-slate-500 bg-slate-50 px-5 py-2 rounded-full hover:bg-slate-100 transition-colors">
                        View Catalog
                      </Link>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                      {catProducts.map((p, i) => {
                        if (stylePattern === 0) return renderCardStyleEcommerce(p, i);
                        if (stylePattern === 1) return renderCardStyleTwo(p, i);
                        if (stylePattern === 2) return renderCardStyleThree(p, i);
                        return renderCardStyleFour(p, i);
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        ) : (
          <div className="animate-fade-in-up">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
              <h1 className="text-3xl font-black text-slate-900">
                {searchQuery ? `Search Results for "${searchQuery}"` : activeCategory}
              </h1>
              <div className="text-[15px] font-bold text-slate-600 bg-slate-100 px-5 py-2 rounded-full border border-slate-200">
                Showing {filteredProducts.length} results
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredProducts.map((p, i) => renderCardStyleEcommerce(p, i))}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-24 bg-[#f8fafc] rounded-3xl border border-slate-200 mt-8">
                <p className="text-2xl font-black text-slate-900 mb-3">No products found.</p>
                <p className="text-slate-600 text-lg font-medium">Try checking a different category or refining your search.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}