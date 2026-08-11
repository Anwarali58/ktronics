import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Heart, ArrowRight, Search, ExternalLink, ShoppingCart, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

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

  const categoryScrollRef = useRef(null);
  const productRefs = useRef({}); 

  const scrollContainer = (node, direction) => {
    if (node) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      node.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const fetchDatabase = () => {
    const massiveDefaultCategoriesDetails = [
      { name: 'Microcontrollers', image: 'https://images.unsplash.com/photo-1517077304055-6e89abf0ceb6?w=400&q=80' },
      { name: 'Sensors', image: 'https://images.unsplash.com/photo-1620288627228-769a7c858f96?w=400&q=80' },
      { name: 'Robotics', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&q=80' },
      { name: 'Resistors', image: 'https://images.unsplash.com/photo-1608564697071-0f95109bc588?w=400&q=80' },
      { name: 'Capacitors', image: 'https://images.unsplash.com/photo-1580983584897-40f413ee0c05?w=400&q=80' },
      { name: 'ICs & Chips', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80' },
      { name: 'Displays', image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=400&q=80' },
      { name: 'Tools', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&q=80' },
      { name: 'Breadboards', image: 'https://images.unsplash.com/photo-1620288627228-769a7c858f96?w=400&q=80' }
    ];

    // MASSIVELY EXPANDED DEFAULT INVENTORY
    const massiveDefaultProducts = [
      // Microcontrollers
      { id: 101, name: 'Arduino Uno R3 Compatible Board', category: 'Microcontrollers', price: 'Rs. 1,200.00', image: 'https://images.unsplash.com/photo-1517077304055-6e89abf0ceb6?w=400&q=80', description: 'The absolute standard for beginners entering microcontroller programming.' },
      { id: 102, name: 'ESP32 Development Board Type-C', category: 'Microcontrollers', price: 'Rs. 950.00', image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&q=80', description: 'Dual-core processor equipped with built-in Wi-Fi and Bluetooth. Type-C variant.' },
      { id: 103, name: 'Raspberry Pi 4 Model B (4GB)', category: 'Microcontrollers', price: 'Rs. 14,500.00', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80', description: 'Powerful single-board computer for heavy IoT and processing tasks.' },
      { id: 104, name: 'NodeMCU ESP8266 Wi-Fi Board', category: 'Microcontrollers', price: 'Rs. 650.00', image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=400&q=80', description: 'Highly popular Wi-Fi enabled chip for home automation projects.' },
      { id: 105, name: 'Arduino Mega 2560 R3', category: 'Microcontrollers', price: 'Rs. 2,800.00', image: 'https://images.unsplash.com/photo-1517077304055-6e89abf0ceb6?w=400&q=80', description: 'For projects that require a massive amount of I/O pins.' },
      
      // Sensors
      { id: 201, name: 'Ultrasonic Sensor HC-SR04', category: 'Sensors', price: 'Rs. 120.00', image: 'https://images.unsplash.com/photo-1620288627228-769a7c858f96?w=400&q=80', description: 'Accurate distance measuring sensor for obstacle avoidance robotics.' },
      { id: 202, name: 'PIR Motion Sensor (HC-SR501)', category: 'Sensors', price: 'Rs. 150.00', image: 'https://images.unsplash.com/photo-1580983584897-40f413ee0c05?w=400&q=80', description: 'Highly sensitive infrared motion detector for security systems.' },
      { id: 203, name: 'DHT11 Temperature & Humidity', category: 'Sensors', price: 'Rs. 200.00', image: 'https://images.unsplash.com/photo-1608564697071-0f95109bc588?w=400&q=80', description: 'Basic digital temperature and humidity sensor.' },
      { id: 204, name: 'Soil Moisture Sensor Module', category: 'Sensors', price: 'Rs. 110.00', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80', description: 'Perfect for automated plant watering systems.' },
      { id: 205, name: 'MPU6050 Gyroscope & Accelerometer', category: 'Sensors', price: 'Rs. 350.00', image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=400&q=80', description: '6-axis motion tracking module for drones and balancing robots.' },

      // Robotics
      { id: 301, name: 'DIY Drone Frame Kit 250mm', category: 'Robotics', price: 'Rs. 2,500.00', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&q=80', description: 'Carbon fiber drone frame for agile racing.' },
      { id: 302, name: 'SG90 Micro Servo Motor 9g', category: 'Robotics', price: 'Rs. 250.00', image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=400&q=80', description: 'Lightweight and highly responsive micro servo.' },
      { id: 303, name: 'MG996R High Torque Metal Gear Servo', category: 'Robotics', price: 'Rs. 950.00', image: 'https://images.unsplash.com/photo-1620288627228-769a7c858f96?w=400&q=80', description: 'Heavy duty metal gear servo for robotic arms.' },
      { id: 304, name: 'L298N Motor Driver Module', category: 'Robotics', price: 'Rs. 350.00', image: 'https://images.unsplash.com/photo-1517077304055-6e89abf0ceb6?w=400&q=80', description: 'Drive two DC motors or one stepper motor easily.' },
      { id: 305, name: '4WD Smart Robot Car Chassis', category: 'Robotics', price: 'Rs. 1,400.00', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&q=80', description: 'Complete chassis kit with 4 wheels and motors.' },

      // Displays
      { id: 401, name: '16x2 LCD Display with I2C Module', category: 'Displays', price: 'Rs. 450.00', image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=400&q=80', description: 'Standard blue/green LCD screen requires only 4 pins.' },
      { id: 402, name: '0.96 inch OLED Display I2C', category: 'Displays', price: 'Rs. 550.00', image: 'https://images.unsplash.com/photo-1608564697071-0f95109bc588?w=400&q=80', description: 'Crisp and clear mini OLED display.' },
      { id: 403, name: 'Nextion 2.4" HMI Touch Display', category: 'Displays', price: 'Rs. 3,500.00', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80', description: 'Advanced touch screen display for custom user interfaces.' },

      // ICs & Chips
      { id: 501, name: 'NE555 Timer IC (DIP-8)', category: 'ICs & Chips', price: 'Rs. 15.00', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80', description: 'The classic 555 timer chip. Create oscillators, delays, and PWM signals.' },
      { id: 502, name: 'LM358 Operational Amplifier', category: 'ICs & Chips', price: 'Rs. 20.00', image: 'https://images.unsplash.com/photo-1608564697071-0f95109bc588?w=400&q=80', description: 'Dual low power operational amplifier.' },
      { id: 503, name: 'ATmega328P-PU with Bootloader', category: 'ICs & Chips', price: 'Rs. 450.00', image: 'https://images.unsplash.com/photo-1517077304055-6e89abf0ceb6?w=400&q=80', description: 'The standalone brain of the Arduino Uno.' },

      // Resistors, Capacitors & Breadboards
      { id: 601, name: '10k ohm, 1/4 Watt Resistor (Pack of 10)', category: 'Resistors', price: 'Rs. 10.00', image: 'https://images.unsplash.com/photo-1580983584897-40f413ee0c05?w=400&q=80', description: 'Essential for pull-up and pull-down configurations in digital circuits.' },
      { id: 602, name: '1000uF 25V Electrolytic Capacitor', category: 'Capacitors', price: 'Rs. 30.00', image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=400&q=80', description: 'Bulk decoupling and power supply smoothing capacitors.' },
      { id: 603, name: '400 Tie Point Solderless Breadboard', category: 'Breadboards', price: 'Rs. 180.00', image: 'https://images.unsplash.com/photo-1620288627228-769a7c858f96?w=400&q=80', description: 'Standard half-size breadboard for prototyping.' },
      { id: 604, name: '830 Tie Point Solderless Breadboard', category: 'Breadboards', price: 'Rs. 300.00', image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=400&q=80', description: 'Full-size breadboard with power rails.' },

      // Tools
      { id: 701, name: 'Digital Multimeter (DT-830B)', category: 'Tools', price: 'Rs. 850.00', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&q=80', description: 'Essential diagnostic tool for voltage, current, and continuity.' },
      { id: 702, name: '60W Adjustable Soldering Iron', category: 'Tools', price: 'Rs. 750.00', image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=400&q=80', description: 'Temperature controlled soldering iron for precision work.' },
      { id: 703, name: 'Jumper Wires (M-M, M-F, F-F) 40pcs', category: 'Tools', price: 'Rs. 150.00', image: 'https://images.unsplash.com/photo-1517077304055-6e89abf0ceb6?w=400&q=80', description: 'Dupont cables for breadboard connections.' }
    ];

    let dbProducts = JSON.parse(localStorage.getItem('ktronic_products'));
    let dbCategoryDetails = JSON.parse(localStorage.getItem('ktronic_category_details'));
    let hasSeeded = localStorage.getItem('ktronic_seeded');

    if (!hasSeeded || !dbProducts || !dbCategoryDetails) {
      localStorage.setItem('ktronic_products', JSON.stringify(massiveDefaultProducts));
      localStorage.setItem('ktronic_category_details', JSON.stringify(massiveDefaultCategoriesDetails));
      localStorage.setItem('ktronic_categories', JSON.stringify(massiveDefaultCategoriesDetails.map(c => c.name)));
      localStorage.setItem('ktronic_seeded', 'true');
      dbProducts = massiveDefaultProducts;
      dbCategoryDetails = massiveDefaultCategoriesDetails;
    }

    // Auto-fix currency symbols on load
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
    const cart = JSON.parse(localStorage.getItem('ktronic_cart')) || [];
    cart.push(product);
    localStorage.setItem('ktronic_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated')); 
    alert(`${product.name} added to cart!`);
  };

  const handleAddToWishlist = (e, product) => {
    if (e) e.stopPropagation();
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

  const newlyAddedProducts = [...products].sort((a, b) => b.id - a.id).slice(0, 8);
  const activeCategoriesWithProducts = categories.filter(c => c !== 'All' && products.some(p => p.category === c));

  // --- PERFECT FIXED SIZED CARDS ---
  const renderCardStyleEcommerce = (product, idx) => (
    <div key={product.id} onClick={() => setSelectedProduct(product)} className="w-[280px] h-[390px] shrink-0 bg-white/90 backdrop-blur-xl border border-white/60 shadow-sm rounded-[24px] flex flex-col hover:border-[#45c4f0]/60 hover:shadow-[0_20px_40px_-10px_rgba(42,100,246,0.15)] transition-all duration-300 relative group overflow-hidden cursor-pointer snap-start">
      
      <div className="absolute top-4 left-4 z-10">
        {idx % 2 === 0 && <span className="bg-gradient-to-r from-[#2ed573] to-[#27ae60] text-white text-[10px] font-black px-3 py-1 rounded-full shadow-sm">NEW</span>}
      </div>

      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out">
         <button className="bg-white/90 backdrop-blur text-slate-500 hover:text-[#2a64f6] hover:bg-white p-2.5 rounded-full shadow-md transition-colors" onClick={(e) => handleAddToCart(e, product)}>
           <ShoppingCart size={16} strokeWidth={2.5}/>
         </button>
         <button className="bg-white/90 backdrop-blur text-slate-500 hover:text-rose-500 hover:bg-white p-2.5 rounded-full shadow-md transition-colors" onClick={(e) => handleAddToWishlist(e, product)}>
           <Heart size={16} strokeWidth={2.5}/>
         </button>
      </div>

      {/* Full width Fixed Image Box */}
      <div className="w-full h-[220px] bg-[#f8fafc] flex items-center justify-center overflow-hidden border-b border-slate-100/50">
        <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" alt={product.name} />
      </div>

      <div className="p-5 flex flex-col flex-grow text-left">
        <p className="text-[10px] font-black text-[#45c4f0] uppercase tracking-widest mb-1 line-clamp-1">{product.category}</p>
        <span className="font-black text-slate-800 text-[16px] leading-snug mb-3 line-clamp-2 group-hover:text-[#2a64f6] transition-colors">{product.name}</span>
        
        <div className="mt-auto flex items-end justify-between">
          <p className="font-black text-slate-900 text-[20px] leading-none tracking-tight">{product.price}</p>
          <p className="text-[10px] font-black text-[#2ed573] bg-[#2ed573]/10 px-2.5 py-1 rounded-md">IN STOCK</p>
        </div>
      </div>
    </div>
  );

  if (selectedProduct) {
    return (
      <div className="min-h-screen bg-transparent font-nunito pb-20 animate-fade-in-up relative z-10">
        <div 
          className="fixed inset-0 z-[-2] opacity-[0.04] pointer-events-none mix-blend-multiply"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518770660439-4636190af475?w=2000&q=80')", backgroundAttachment: "fixed", backgroundSize: "cover", backgroundPosition: "center" }}
        ></div>

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

  return (
    <div className="min-h-screen font-nunito text-slate-800 pb-20 relative bg-[#f4f7f9] overflow-hidden z-10">
      
      {/* Background Orbs */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none mix-blend-normal">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#45c4f0]/20 rounded-full blur-[120px]"></div>
          <div className="absolute top-[40%] right-[-10%] w-[30%] h-[50%] bg-[#2a64f6]/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-8 relative z-10">
        
        {isNewView ? (
          <div className="animate-fade-in-up">
            <h1 className="text-3xl font-black mb-8">New Arrivals</h1>
            <div className="flex flex-wrap gap-6 justify-center">
              {newlyAddedProducts.map((p, i) => renderCardStyleEcommerce(p, i))}
            </div>
          </div>
        ) : activeCategory === 'All' && !searchQuery ? (
          <div className="space-y-16 animate-fade-in-up">
            
            {/* RESTORED HERO SECTION */}
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

            {/* Scrollable Categories List */}
            {categoryDetails.length > 0 && (
              <div className="pt-4 relative group/cat">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#2a64f6] to-[#45c4f0] animate-gradient-text">Browse Categories</h2>
                  <div className="flex gap-2">
                    <button onClick={() => scrollContainer(categoryScrollRef.current, 'left')} className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-sm hover:text-[#45c4f0] hover:shadow-md transition-all"><ChevronLeft size={20}/></button>
                    <button onClick={() => scrollContainer(categoryScrollRef.current, 'right')} className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-sm hover:text-[#45c4f0] hover:shadow-md transition-all"><ChevronRight size={20}/></button>
                  </div>
                </div>
                
                <div ref={categoryScrollRef} className="flex gap-6 overflow-x-auto snap-x custom-scrollbar pb-4 -mx-4 px-4 scroll-smooth">
                  {categoryDetails.map((cat) => {
                    const count = products.filter(p => p.category === cat.name).length;
                    return (
                      <Link to={`/?category=${encodeURIComponent(cat.name)}`} key={cat.name} className="w-[180px] shrink-0 snap-start bg-white/90 backdrop-blur-md rounded-[24px] p-5 text-center hover:-translate-y-2 transition-transform border border-white/50 shadow-sm flex flex-col items-center cursor-pointer">
                        <div className="w-20 h-20 rounded-[20px] overflow-hidden mb-4 shadow-inner bg-slate-50 flex items-center justify-center">
                          {cat.image ? <img src={cat.image} className="w-full h-full object-cover" alt={cat.name}/> : <span className="text-slate-400 font-black text-2xl">{cat.name.charAt(0)}</span>}
                        </div>
                        <span className="font-black text-[15px] text-slate-900 line-clamp-1">{cat.name}</span>
                        <span className="text-[12px] font-bold text-slate-400 uppercase">{count} Items</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Scrollable Category Showcases */}
            <div className="pt-4 space-y-16">
              {activeCategoriesWithProducts.map((cat) => {
                const catProducts = products.filter(p => p.category === cat); 
                return (
                  <div key={cat} className="relative group/showcase">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#2a64f6] to-[#45c4f0] animate-gradient-text tracking-tight">{cat} Essentials</h2>
                      <div className="flex gap-2 opacity-0 group-hover/showcase:opacity-100 transition-opacity">
                        <button onClick={() => scrollContainer(productRefs.current[cat], 'left')} className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-sm hover:text-[#45c4f0] hover:shadow-md transition-all"><ChevronLeft size={20}/></button>
                        <button onClick={() => scrollContainer(productRefs.current[cat], 'right')} className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-sm hover:text-[#45c4f0] hover:shadow-md transition-all"><ChevronRight size={20}/></button>
                      </div>
                    </div>
                    
                    {/* Horizontal Product Scroll */}
                    <div ref={el => productRefs.current[cat] = el} className="flex gap-6 overflow-x-auto snap-x custom-scrollbar pb-8 -mx-4 px-4 scroll-smooth">
                      {catProducts.map((p, i) => renderCardStyleEcommerce(p, i))}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        ) : (
          <div className="animate-fade-in-up">
            <h1 className="text-3xl font-black mb-8">{activeCategory}</h1>
            <div className="flex flex-wrap gap-6 justify-center">
              {filteredProducts.map((p, i) => renderCardStyleEcommerce(p, i))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}