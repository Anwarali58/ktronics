import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Heart, ArrowRight, Search, ExternalLink, ShoppingCart, ChevronLeft, CheckCircle2 } from 'lucide-react';

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryDetails, setCategoryDetails] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null); 
  
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const activeCategory = searchParams.get('category') || 'All';
  const isNewView = searchParams.get('view') === 'new';

  const fetchDatabase = () => {
    // --- ONE-TIME DATABASE SEED ---
    const massiveDefaultCategoriesDetails = [
      { name: 'Microcontrollers', image: 'https://images.unsplash.com/photo-1517077304055-6e89abf0ceb6?w=400&q=80' },
      { name: 'Sensors', image: 'https://images.unsplash.com/photo-1620288627228-769a7c858f96?w=400&q=80' },
      { name: 'Robotics', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&q=80' },
      { name: 'Resistors', image: 'https://images.unsplash.com/photo-1608564697071-0f95109bc588?w=400&q=80' },
      { name: 'Capacitors', image: 'https://images.unsplash.com/photo-1580983584897-40f413ee0c05?w=400&q=80' },
      { name: 'ICs & Chips', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80' }
    ];

    const massiveDefaultProducts = [
      { id: 101, name: '100 ohm, 1/4 Watt Resistor (Pack of 10)', category: 'Resistors', price: 'Rs. 10.00', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80', description: 'High precision 1/4 Watt carbon film resistors.' },
      { id: 102, name: '10k ohm, 1/4 Watt Resistor (Pack of 10)', category: 'Resistors', price: 'Rs. 10.00', image: 'https://images.unsplash.com/photo-1608564697071-0f95109bc588?w=400&q=80', description: 'Essential for pull-up and pull-down configurations in digital circuits.' },
      { id: 106, name: '1000uF 25V Electrolytic Capacitor (Pack of 5)', category: 'Capacitors', price: 'Rs. 30.00', image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=400&q=80', description: 'Bulk decoupling and power supply smoothing capacitors.' },
      { id: 111, name: 'NE555 Timer IC (DIP-8)', category: 'ICs & Chips', price: 'Rs. 12.00', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80', description: 'The classic 555 timer chip. Create oscillators, delays, and PWM signals.' },
      { id: 116, name: 'Arduino Uno R3 Compatible Board', category: 'Microcontrollers', price: 'Rs. 1,200.00', image: 'https://images.unsplash.com/photo-1517077304055-6e89abf0ceb6?w=400&q=80', description: 'The absolute standard for beginners entering microcontroller programming.' },
      { id: 118, name: 'ESP32 Development Board Type-C', category: 'Microcontrollers', price: 'Rs. 450.00', image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&q=80', description: 'Dual-core processor equipped with built-in Wi-Fi and Bluetooth. Type-C variant.' },
      { id: 119, name: 'DIY Drone Frame Kit 250mm', category: 'Robotics', price: 'Rs. 2,500.00', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&q=80', description: 'Carbon fiber drone frame for agile racing or cinematic builds.' },
      { id: 120, name: 'Ultrasonic Sensor HC-SR04', category: 'Sensors', price: 'Rs. 120.00', image: 'https://images.unsplash.com/photo-1620288627228-769a7c858f96?w=400&q=80', description: 'Accurate distance measuring sensor for obstacle avoidance robotics.' }
    ];

    let dbProducts = JSON.parse(localStorage.getItem('ktronic_products'));
    let dbCategoryDetails = JSON.parse(localStorage.getItem('ktronic_category_details'));
    let hasSeeded = localStorage.getItem('ktronic_seeded');

    // ONLY seed the default data if the site has never been loaded before!
    // This allows the admin to freely delete things without them reappearing.
    if (!hasSeeded || !dbProducts || !dbCategoryDetails) {
      localStorage.setItem('ktronic_products', JSON.stringify(massiveDefaultProducts));
      localStorage.setItem('ktronic_category_details', JSON.stringify(massiveDefaultCategoriesDetails));
      localStorage.setItem('ktronic_categories', JSON.stringify(massiveDefaultCategoriesDetails.map(c => c.name)));
      localStorage.setItem('ktronic_seeded', 'true');
      dbProducts = massiveDefaultProducts;
      dbCategoryDetails = massiveDefaultCategoriesDetails;
    }

    // Auto-fix currency symbols on load (forces old '₹' to 'Rs.')
    let needsUpdate = false;
    dbProducts = dbProducts.map(p => {
      if (p.price && p.price.includes('₹')) {
        needsUpdate = true;
        return { ...p, price: p.price.replace('₹', 'Rs. ') };
      }
      return p;
    });
    
    if (needsUpdate) {
      localStorage.setItem('ktronic_products', JSON.stringify(dbProducts));
      window.dispatchEvent(new Event('cartUpdated')); 
    }

    setProducts(dbProducts);
    setCategoryDetails(dbCategoryDetails);
    setCategories(['All', ...dbCategoryDetails.map(c => c.name)]);
  };

  useEffect(() => {
    fetchDatabase();
    window.addEventListener('storage', fetchDatabase);
    
    const handleOpenDetail = (e) => {
      setSelectedProduct(e.detail);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('openProductDetail', handleOpenDetail);

    return () => {
      window.removeEventListener('storage', fetchDatabase);
      window.removeEventListener('openProductDetail', handleOpenDetail);
    };
  }, []);

  const handleAddToCart = (e, product) => {
    if (e) e.stopPropagation();
    const user = localStorage.getItem('currentUser');
    if (!user) {
      window.dispatchEvent(new Event('openLogin'));
      return;
    }
    const cart = JSON.parse(localStorage.getItem('ktronic_cart')) || [];
    cart.push(product);
    localStorage.setItem('ktronic_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated')); 
    alert(`${product.name} added to cart!`);
  };

  const handleAddToWishlist = (e, product) => {
    if (e) e.stopPropagation();
    const user = localStorage.getItem('currentUser');
    if (!user) {
      window.dispatchEvent(new Event('openLogin'));
      return;
    }
    const wishlist = JSON.parse(localStorage.getItem('ktronic_wishlist')) || [];
    if (!wishlist.some(item => item.id === product.id)) {
      wishlist.push(product);
      localStorage.setItem('ktronic_wishlist', JSON.stringify(wishlist));
      window.dispatchEvent(new Event('wishlistUpdated')); 
      alert(`${product.name} saved to wishlist!`);
    } else {
      alert(`Already in your wishlist!`);
    }
  };

  const carouselSlides = [
    { id: 1, title: 'The BEST GNSS Module', subtitle: 'Now comes at the SMALLEST form', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80', bg: 'from-[#4c1d95] to-[#3b0764]' },
    { id: 2, title: 'Next-Gen Robotics', subtitle: 'Build the future of automation', img: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&q=80', bg: 'from-[#065f46] to-[#022c22]' },
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
  
  // Calculate which dynamic categories actually have products inside them right now
  const activeCategoriesWithProducts = categories.filter(c => c !== 'All' && products.some(p => p.category === c));

  // ==========================================
  // PREMIUM REDESIGNED CARD UI (GLASSMORPHISM)
  // ==========================================
  const renderCardStyleEcommerce = (product, idx) => (
    <div key={product.id} onClick={() => setSelectedProduct(product)} className="bg-white/80 backdrop-blur-md border border-white/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-3xl flex flex-col hover:border-[#45c4f0]/50 hover:shadow-[0_12px_40px_-10px_rgba(42,100,246,0.2)] transition-all duration-300 relative group overflow-hidden cursor-pointer">
      
      <div className="absolute top-3 left-3 z-10">
        {idx % 2 === 0 && <span className="bg-gradient-to-r from-[#2ed573] to-[#27ae60] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">NEW</span>}
      </div>

      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out">
         <button className="bg-white text-slate-400 hover:text-[#2a64f6] hover:bg-[#eef6ff] transition-colors p-2.5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)]" onClick={(e) => handleAddToCart(e, product)}>
           <ShoppingCart size={16} strokeWidth={2.5}/>
         </button>
         <button className="bg-white text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors p-2.5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)]" onClick={(e) => handleAddToWishlist(e, product)}>
           <Heart size={16} strokeWidth={2.5}/>
         </button>
      </div>

      <div className="relative w-full aspect-square bg-[#f4f7f9] flex items-center justify-center p-6 mb-2 border-b border-slate-100/50">
        <img src={product.image} className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 ease-out drop-shadow-sm" alt={product.name} />
      </div>

      <div className="px-5 pt-3 pb-5 flex flex-col flex-grow text-left">
        <p className="text-[10px] font-black text-[#45c4f0] uppercase tracking-widest mb-1.5 line-clamp-1">{product.category}</p>
        <span className="font-black text-slate-800 text-[16px] leading-snug mb-4 line-clamp-2 group-hover:text-[#2a64f6] transition-colors">{product.name}</span>
        
        <div className="mt-auto flex items-end justify-between">
          <div>
            <p className="text-[11px] text-slate-400 font-bold mb-0.5">Price</p>
            <p className="font-black text-slate-900 text-[20px] leading-none tracking-tight">{product.price}</p>
          </div>
          <p className="text-[10px] font-black text-[#2ed573] bg-[#2ed573]/10 px-2.5 py-1 rounded-md">IN STOCK</p>
        </div>
      </div>
    </div>
  );

  // --- DETAIL VIEW ---
  if (selectedProduct) {
    return (
      <div className="min-h-screen bg-transparent font-nunito pb-20 animate-fade-in-up relative">
        <div className="max-w-[1300px] mx-auto px-6 lg:px-12 py-8 mt-6">
          <button onClick={() => setSelectedProduct(null)} className="flex items-center gap-2 text-slate-500 hover:text-[#45c4f0] font-bold mb-8 transition-colors bg-white/80 backdrop-blur-md border border-slate-200 px-5 py-2.5 rounded-full w-max shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <ChevronLeft size={18} /> Back to Catalog
          </button>
          
          <div className="flex flex-col md:flex-row gap-10 lg:gap-16 bg-white/90 backdrop-blur-xl p-8 lg:p-12 rounded-[40px] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-white">
            <div className="w-full md:w-1/2 bg-[#f4f7f9] rounded-3xl p-8 flex items-center justify-center border border-slate-100 min-h-[400px]">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="max-w-full max-h-[500px] object-contain mix-blend-multiply drop-shadow-xl" />
            </div>
            
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              <span className="bg-[#2a64f6]/10 text-[#2a64f6] px-4 py-1.5 rounded-full font-black text-sm w-max mb-5 tracking-wide uppercase">{selectedProduct.category}</span>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 leading-tight">{selectedProduct.name}</h1>
              
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                ))}
                <span className="text-slate-400 text-sm ml-2 font-bold">(Verified Quality)</span>
              </div>

              <p className="text-4xl font-black text-slate-900 mb-2">{selectedProduct.price}</p>
              <p className="text-sm text-[#2ed573] font-bold mb-6 flex items-center gap-1.5"><CheckCircle2 size={16}/> In Stock & Ready to Ship</p>
              
              <p className="text-slate-600 font-medium text-[17px] leading-relaxed mb-8">
                {selectedProduct.description || "Premium quality electronic component designed for high reliability and performance in your next DIY or professional tech project. Fully tested and guaranteed to meet standard specifications."}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <button onClick={(e) => handleAddToCart(e, selectedProduct)} className="flex-1 min-w-[200px] bg-[#2a64f6] hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-[0_4px_14px_rgba(42,100,246,0.3)] transition-all hover:-translate-y-0.5 flex justify-center items-center gap-2 text-lg">
                  <ShoppingCart size={22} /> Add to Cart
                </button>
                <a href={selectedProduct.productUrl || '#'} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-[200px] bg-[#45c4f0] hover:bg-[#3ab0d9] text-white font-black py-4 rounded-xl shadow-[0_4px_14px_rgba(69,196,240,0.3)] transition-all hover:-translate-y-0.5 flex justify-center items-center gap-2 text-lg">
                  Buy Now <ExternalLink size={20} />
                </a>
                <button onClick={(e) => handleAddToWishlist(e, selectedProduct)} className="w-16 h-16 bg-rose-50 border border-rose-100 hover:bg-rose-500 hover:border-rose-500 hover:text-white text-rose-500 rounded-xl flex items-center justify-center transition-all shrink-0 shadow-sm">
                  <Heart size={26} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- CATALOG VIEW ---
  return (
    <div className="min-h-screen font-nunito text-slate-800 pb-20 relative bg-[#ebf0f5]">
      
      {/* Dynamic Floating Background Orbs */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gradient-to-br from-[#45c4f0]/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-[40%] right-[-10%] w-[30%] h-[50%] bg-gradient-to-tl from-[#2a64f6]/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[30%] bg-gradient-to-t from-purple-500/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Pulsing & Bouncing WhatsApp Button */}
      <a href="https://wa.me/923111486790" target="_blank" rel="noopener noreferrer" className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 group flex items-center justify-center w-[54px] h-[54px] sm:w-[64px] sm:h-[64px] animate-bounce hover:animate-none">
        <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-60 group-hover:opacity-0 transition-opacity"></div>
        <div className="absolute inset-0 bg-slate-200 rounded-full translate-y-1 translate-x-1 sm:translate-y-1.5 sm:translate-x-1.5 group-hover:translate-y-2.5 group-hover:translate-x-2.5 transition-transform duration-300 shadow-sm"></div>
        <div className="relative bg-[#25D366] text-white w-full h-full rounded-full shadow-lg group-hover:-translate-y-1 group-hover:-translate-x-1 transition-transform duration-300 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-[32px] h-[32px] sm:w-[42px] sm:h-[42px] fill-current -ml-0.5 -mt-0.5">
             <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </div>
      </a>

      <div className="max-w-[1300px] mx-auto px-6 lg:px-12 py-8">
        
        {isNewView ? (
          <div className="animate-fade-in-up">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl sm:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#2a64f6] to-[#45c4f0] animate-gradient-text flex items-center gap-3">
                <span className="bg-rose-500 text-white text-[11px] px-3 py-1 rounded-full animate-pulse tracking-wider">NEW ARRIVALS</span> Freshly Added
              </h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
              {newlyAddedProducts.map((p, i) => renderCardStyleEcommerce(p, i))}
            </div>
          </div>
        ) : activeCategory === 'All' && !searchQuery ? (
          <div className="space-y-16 animate-fade-in-up">
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="relative w-full h-[300px] sm:h-[400px] rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                {carouselSlides.map((slide, index) => (
                  <Link key={slide.id} to="/?category=Microcontrollers" className={`absolute inset-0 w-full h-full bg-gradient-to-br ${slide.bg} group flex items-center justify-center p-8 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                    <img src={slide.img} alt={slide.title} className="h-[200px] sm:h-[250px] w-auto object-contain z-10 group-hover:scale-105 transition-transform duration-500 drop-shadow-2xl opacity-90 mix-blend-screen" />
                    <div className="absolute bottom-6 sm:bottom-10 left-0 w-full text-center z-20">
                      <h2 className="text-white text-2xl sm:text-4xl font-black mb-2 drop-shadow-md tracking-tight">{slide.title}</h2>
                      <p className="text-white/80 text-xs sm:text-sm font-bold tracking-widest uppercase">{slide.subtitle}</p>
                    </div>
                  </Link>
                ))}
                <div className="absolute bottom-6 left-0 w-full flex justify-center gap-3 z-20">
                  {carouselSlides.map((_, i) => <div key={i} className={`h-2.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-8 bg-white shadow-md' : 'w-2.5 bg-white/40'}`}></div>)}
                </div>
              </div>
              
              <div className="flex flex-col gap-6 h-[400px]">
                <Link to="/?category=Kits" className="relative block w-full h-[230px] rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)] transition-all bg-gradient-to-r from-[#7f1d1d] to-[#991b1b] group p-8 flex items-center">
                  <div className="z-20 w-3/4 sm:w-1/2">
                    <h2 className="text-yellow-400 text-3xl sm:text-4xl font-black mb-2 leading-tight">Cardputer Zero</h2>
                    <p className="text-white text-[15px] font-bold mb-5">A True Handheld Computer</p>
                    <p className="text-white underline text-xs font-black tracking-widest uppercase hover:text-yellow-400 transition-colors">Click & Watch Our Video</p>
                  </div>
                  <img src="https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=500&q=80" alt="Handheld" className="absolute right-0 bottom-0 h-full w-auto object-cover opacity-60 mix-blend-screen group-hover:scale-105 transition-transform duration-500" />
                </Link>

                <div className="grid grid-cols-2 gap-6 h-[146px]">
                  <Link to="/?category=IoT" className="relative block w-full h-full rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-lg transition-all bg-[#1da1f2] p-5 sm:p-6 flex flex-col justify-between group">
                    <div className="z-20"><h3 className="text-white font-black text-lg sm:text-2xl mb-1 tracking-tight">AI Pin</h3><p className="text-blue-100 text-[10px] sm:text-xs font-black uppercase tracking-wider">Powered by XIAOZHI</p></div>
                    <button className="bg-white text-[#1da1f2] text-[11px] font-black px-4 sm:px-5 py-2 rounded-xl w-max hover:bg-slate-50 shadow-sm z-20 transition-transform group-hover:-translate-y-0.5">EXPLORE</button>
                    <img src="https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=200&q=80" alt="AI Pin" className="absolute -right-4 -bottom-4 h-[100px] sm:h-[130px] w-[100px] sm:w-[130px] object-contain opacity-50 mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                  </Link>
                  <Link to="/?category=Microcontrollers" className="relative block w-full h-full rounded-[32px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-lg transition-all bg-[#fbc531] p-5 sm:p-6 flex flex-col justify-between group">
                    <div className="z-20"><h3 className="text-white font-black text-lg sm:text-2xl mb-1 tracking-tight">ESP32-S3</h3><p className="text-yellow-100 text-[10px] sm:text-xs font-black uppercase tracking-wider">Camera Board</p></div>
                    <button className="bg-white text-[#fbc531] text-[11px] font-black px-4 sm:px-5 py-2 rounded-xl w-max hover:bg-slate-50 shadow-sm z-20 transition-transform group-hover:-translate-y-0.5">EXPLORE</button>
                    <img src="https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=200&q=80" alt="ESP32" className="absolute -right-2 -bottom-2 h-[80px] sm:h-[110px] w-[80px] sm:w-[110px] object-contain opacity-50 mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                  </Link>
                </div>
              </div>
            </div>

            {/* DYNAMIC CATEGORY SHOWCASE */}
            {categoryDetails.length > 0 && (
              <div className="pt-4">
                <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#2a64f6] to-[#45c4f0] animate-gradient-text mb-8 tracking-tight">Browse Categories</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
                  {categoryDetails.slice(0, 6).map((cat) => {
                    const count = products.filter(p => p.category === cat.name).length;
                    return (
                      <Link to={`/?category=${encodeURIComponent(cat.name)}`} key={cat.name} className="bg-white/80 backdrop-blur-md rounded-[24px] p-5 text-center hover:shadow-[0_12px_40px_rgba(42,100,246,0.15)] hover:border-[#45c4f0]/50 hover:-translate-y-1 transition-all flex flex-col items-center justify-center gap-4 border border-white/50 shadow-sm">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[20px] overflow-hidden mb-1 shadow-inner bg-slate-50 flex items-center justify-center">
                          {cat.image ? <img src={cat.image} className="w-full h-full object-cover" alt={cat.name}/> : <span className="text-slate-400 font-black text-2xl">{cat.name.charAt(0)}</span>}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-[15px] text-slate-900 line-clamp-1">{cat.name}</span>
                          <span className="text-[12px] font-bold text-slate-400 mt-1 uppercase tracking-wider">{count} Products</span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {newlyAddedProducts.length > 0 && (
              <div className="pt-4">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#2a64f6] to-[#45c4f0] animate-gradient-text tracking-tight">Freshly Added</h2>
                  <Link to="/?view=new" className="text-[13px] sm:text-[14px] font-bold text-[#45c4f0] bg-white border border-slate-200 px-5 py-2.5 rounded-full hover:shadow-md transition-all flex items-center gap-1.5 shadow-sm">View All <ArrowRight size={14}/></Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {newlyAddedProducts.map((p, i) => renderCardStyleEcommerce(p, i))}
                </div>
              </div>
            )}

            <div className="pt-4 space-y-16">
              {activeCategoriesWithProducts.map((cat) => {
                const catProducts = products.filter(p => p.category === cat).slice(0, 4); 
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#2a64f6] to-[#45c4f0] animate-gradient-text tracking-tight">{cat} Essentials</h2>
                      <Link to={`/?category=${encodeURIComponent(cat)}`} className="text-[13px] sm:text-[14px] font-bold text-slate-500 bg-white border border-slate-200 px-5 py-2.5 rounded-full hover:shadow-md transition-all shadow-sm">Explore Catalog</Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {catProducts.map((p, i) => renderCardStyleEcommerce(p, i))}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        ) : (
          <div className="animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#2a64f6] to-[#45c4f0] animate-gradient-text tracking-tight">{searchQuery ? `Search Results for "${searchQuery}"` : activeCategory}</h1>
              <div className="text-[14px] sm:text-[15px] font-bold text-[#2a64f6] bg-[#eef6ff] px-5 py-2.5 rounded-full w-max shadow-sm tracking-wide border border-[#2a64f6]/20">Showing {filteredProducts.length} results</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((p, i) => renderCardStyleEcommerce(p, i))}
            </div>
            {filteredProducts.length === 0 && (
              <div className="text-center py-16 sm:py-24 bg-white/50 backdrop-blur-md rounded-[32px] border border-white mt-8 shadow-sm">
                <p className="text-xl sm:text-2xl font-black text-slate-900 mb-3">No products found.</p>
                <p className="text-slate-500 text-base sm:text-lg font-bold px-4">Try checking a different category or refining your search.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}