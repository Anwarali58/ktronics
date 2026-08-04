import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User, HeadphonesIcon, Menu, ChevronRight, X, Mail, Trash2 } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [categories, setCategories] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeHoverCategory, setActiveHoverCategory] = useState(null);
  
  // Auth State
  const [currentUser, setCurrentUser] = useState(localStorage.getItem('currentUser'));
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  // Dynamic Cart and Wishlist States
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [cartTotal, setCartTotal] = useState("0.00");
  
  // Drawer States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const updateCartAndWishlist = () => {
    const cart = JSON.parse(localStorage.getItem('ktronic_cart')) || [];
    const wishlist = JSON.parse(localStorage.getItem('ktronic_wishlist')) || [];
    
    setCartItems(cart);
    setWishlistItems(wishlist);

    const total = cart.reduce((sum, item) => {
      const numericPrice = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
      return sum + (isNaN(numericPrice) ? 0 : numericPrice);
    }, 0);
    setCartTotal(total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  };

  useEffect(() => {
    const dbCategories = JSON.parse(localStorage.getItem('ktronic_categories')) || [
      'Microcontrollers', 'Robotics', 'Electronic Modules', 
      'Displays', 'Battery & Charger', 'Kits', 'IoT & Wireless Boards', 'Tools', 'Sensors'
    ];
    setCategories(dbCategories);
    updateCartAndWishlist();

    window.addEventListener('cartUpdated', updateCartAndWishlist);
    window.addEventListener('wishlistUpdated', updateCartAndWishlist);
    
    return () => {
      window.removeEventListener('cartUpdated', updateCartAndWishlist);
      window.removeEventListener('wishlistUpdated', updateCartAndWishlist);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) navigate(`/?search=${encodeURIComponent(searchInput)}`);
    else navigate(`/`);
    setIsMobileMenuOpen(false);
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    const emailInput = e.target.querySelector('input[type="email"]').value;
    localStorage.setItem('currentUser', emailInput);
    setCurrentUser(emailInput);
    setIsLoginModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setIsMobileMenuOpen(false);
  };

  const removeFromCart = (index) => {
    const updated = [...cartItems];
    updated.splice(index, 1);
    localStorage.setItem('ktronic_cart', JSON.stringify(updated));
    updateCartAndWishlist();
  };

  const removeFromWishlist = (index) => {
    const updated = [...wishlistItems];
    updated.splice(index, 1);
    localStorage.setItem('ktronic_wishlist', JSON.stringify(updated));
    updateCartAndWishlist();
  };

  const subCategories = ['Bluetooth', 'GPS/GNSS', 'GSM, GPRS, 4G', 'nRF'];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@500;700;800;900&display=swap');
        .font-nunito { font-family: 'Nunito', sans-serif; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>

      {/* --- OVERLAYS & MODALS --- */}
      {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[90] transition-opacity" onClick={() => setIsSidebarOpen(false)} />}
      
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-fade-in-up">
            <button onClick={() => setIsLoginModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 bg-slate-50 p-2 rounded-full"><X size={20}/></button>
            <h2 className="text-3xl font-black text-slate-900 mb-2">{isSignUpMode ? 'Create Account' : 'Welcome Back'}</h2>
            <p className="text-slate-500 font-bold mb-8">
              {isSignUpMode ? 'Sign up to manage your orders, wishlist, and cart.' : 'Log in to access your account and saved items.'}
            </p>
            
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {isSignUpMode && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name</label>
                  <input type="text" required placeholder="John Doe" className="w-full border-2 border-slate-100 bg-slate-50 rounded-xl px-4 py-3 outline-none focus:border-[#45c4f0] font-semibold" />
                </div>
              )}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
                <input type="email" required placeholder="name@email.com" className="w-full border-2 border-slate-100 bg-slate-50 rounded-xl px-4 py-3 outline-none focus:border-[#45c4f0] font-semibold" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
                <input type="password" required placeholder="••••••••" className="w-full border-2 border-slate-100 bg-slate-50 rounded-xl px-4 py-3 outline-none focus:border-[#45c4f0] font-semibold" />
              </div>
              <button type="submit" className="w-full bg-[#2a64f6] hover:bg-blue-700 text-white font-black py-4 rounded-xl mt-4 transition-colors">
                {isSignUpMode ? 'Create Account' : 'Sign In'}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <button onClick={() => setIsSignUpMode(!isSignUpMode)} className="text-[14px] font-bold text-slate-500 hover:text-[#2a64f6] transition-colors">
                {isSignUpMode ? 'Already have an account? Log In' : "Don't have an account? Create one"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Slide-Out Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end font-nunito">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-2xl font-black flex items-center gap-2"><ShoppingCart className="text-[#2a64f6]"/> Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-slate-800"><X size={24}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {cartItems.length === 0 ? (
                <div className="text-center text-slate-500 font-bold mt-10">Your cart is empty.</div>
              ) : (
                cartItems.map((item, idx) => (
                  <div key={idx} className="flex gap-4 border border-slate-100 p-3 rounded-xl items-center relative group">
                    <img src={item.image} className="w-16 h-16 object-contain bg-slate-50 rounded-lg p-1" alt={item.name} />
                    <div className="flex-1">
                      <h4 className="text-[14px] font-bold leading-tight line-clamp-2">{item.name}</h4>
                      <p className="text-[#2a64f6] font-black mt-1">{item.price}</p>
                    </div>
                    <button onClick={() => removeFromCart(idx)} className="text-rose-500 p-2 bg-rose-50 rounded-lg hover:bg-rose-500 hover:text-white transition-colors"><Trash2 size={16}/></button>
                  </div>
                ))
              )}
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-slate-600">Total Price</span>
                <span className="text-2xl font-black text-slate-900">₹{cartTotal}</span>
              </div>
              <button className="w-full bg-[#2ed573] hover:bg-green-600 text-white font-black py-4 rounded-xl transition-colors">Proceed to Checkout</button>
            </div>
          </div>
        </div>
      )}

      {/* Wishlist Slide-Out Drawer */}
      {isWishlistOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end font-nunito">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsWishlistOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-2xl font-black flex items-center gap-2"><Heart className="text-rose-500"/> Saved Items</h2>
              <button onClick={() => setIsWishlistOpen(false)} className="text-slate-400 hover:text-slate-800"><X size={24}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {wishlistItems.length === 0 ? (
                <div className="text-center text-slate-500 font-bold mt-10">Your wishlist is empty.</div>
              ) : (
                wishlistItems.map((item, idx) => (
                  <div key={idx} className="flex gap-4 border border-slate-100 p-3 rounded-xl items-center relative">
                    <img src={item.image} className="w-16 h-16 object-contain bg-slate-50 rounded-lg p-1" alt={item.name} />
                    <div className="flex-1">
                      <h4 className="text-[14px] font-bold leading-tight line-clamp-2">{item.name}</h4>
                      <p className="text-[#2a64f6] font-black mt-1">{item.price}</p>
                    </div>
                    <button onClick={() => removeFromWishlist(idx)} className="text-slate-400 p-2 hover:bg-slate-100 rounded-lg transition-colors"><Trash2 size={16}/></button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN HEADER --- */}

      <div className={`fixed top-32 left-0 z-40 bg-[#45c4f0] text-white p-3 rounded-r-full cursor-pointer shadow-lg transition-transform duration-300 ${isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}`} onMouseEnter={() => setIsSidebarOpen(true)} onClick={() => setIsSidebarOpen(true)}>
        <Menu size={24} />
      </div>

      <div className={`fixed top-0 left-0 h-full w-[85%] sm:w-[300px] bg-white shadow-[0_0_50px_rgba(0,0,0,0.2)] z-[100] transform transition-transform duration-300 ease-in-out font-nunito ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`} onMouseLeave={() => { setIsSidebarOpen(false); setActiveHoverCategory(null); }}>
        <div className="bg-[#45c4f0] text-white px-6 py-5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 font-black text-xl"><Menu size={24} strokeWidth={2.5} /> Categories</div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden bg-white/20 p-1.5 rounded-lg"><X size={20}/></button>
        </div>
        <ul className="py-2 h-[calc(100vh-80px)] overflow-y-auto custom-scrollbar">
          {categories.map((cat) => (
            <li key={cat} className="relative group/item" onMouseEnter={() => setActiveHoverCategory(cat)} onMouseLeave={() => setActiveHoverCategory(null)}>
              <Link to={`/?category=${encodeURIComponent(cat)}`} onClick={() => setIsSidebarOpen(false)} className={`w-full flex items-center justify-between px-6 py-3 text-[15px] font-bold transition-colors ${activeHoverCategory === cat ? 'text-[#45c4f0]' : 'text-slate-700'}`}>
                {cat} <ChevronRight size={16} className={`transition-opacity hidden sm:block ${activeHoverCategory === cat ? 'opacity-100 text-[#45c4f0]' : 'opacity-0'}`} />
              </Link>
              {activeHoverCategory === cat && (
                <div className="hidden sm:block absolute top-0 left-[295px] w-[220px] bg-white shadow-2xl border border-slate-100 rounded-xl py-2 z-[100]">
                  {subCategories.map(sub => (
                    <Link key={sub} to={`/?search=${encodeURIComponent(sub)}`} className="block px-6 py-2.5 text-[15px] font-bold text-slate-600 hover:text-[#45c4f0] hover:bg-slate-50 transition-colors">{sub}</Link>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <header className="w-full bg-white shadow-sm flex flex-col font-nunito relative z-30">
        
        {/* TOP TIER: Expanded Full Width */}
        <div className="max-w-[1500px] w-full mx-auto px-4 sm:px-6 py-4 flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6">
          <div className="flex items-center justify-between w-full lg:w-auto">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="h-10 w-10 bg-[#45c4f0] rounded flex items-center justify-center"><span className="text-white font-black text-2xl">K</span></div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-[#45c4f0] leading-none tracking-tight">Ktronics</span>
                <span className="text-[10px] text-slate-400 font-bold tracking-widest">EXPLORE • LEARN • BUILD</span>
              </div>
            </Link>
            
            <div className="flex items-center gap-3 lg:hidden">
              <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-slate-600">
                <ShoppingCart size={24} />
                <span className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">{cartItems.length}</span>
              </button>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600 bg-slate-50 rounded-lg border border-slate-200">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          <form onSubmit={handleSearch} className="flex-1 w-full max-w-2xl relative order-3 lg:order-2">
            <input type="text" placeholder="Search for products" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="w-full border-2 border-slate-100 bg-white rounded-full py-2.5 pl-6 pr-14 outline-none focus:border-[#45c4f0] transition-all text-[15px] font-bold text-slate-700" />
            <button type="submit" className="absolute right-1.5 top-1.5 bg-[#45c4f0] hover:bg-[#3ab0d9] text-white p-2 rounded-full transition-colors"><Search size={18} /></button>
          </form>

          {/* Fully visible Phone and Contact Details */}
          <div className="hidden lg:flex items-center gap-8 shrink-0 order-2 lg:order-3">
            <a href="tel:+92423214567" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <HeadphonesIcon size={28} className="text-slate-700 stroke-1" />
              <div className="flex flex-col"><span className="text-[13px] font-bold text-slate-700">Customer Support</span><span className="text-[15px] font-black text-[#2a64f6]">+92 (42) 321-4567</span></div>
            </a>
            <a href="mailto:support@ktronics.org" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Mail size={28} className="text-slate-700 stroke-1" />
              <div className="flex flex-col"><span className="text-[13px] font-bold text-slate-700">Email Us</span><span className="text-[15px] font-black text-[#2a64f6]">support@ktronics.org</span></div>
            </a>
          </div>
        </div>

        {/* BOTTOM TIER: Boxed Layout with Full width Navigation Distribution */}
        <div className="hidden lg:block bg-[#f8fafc] border-t border-[#e2e8f0]">
          <div className="max-w-[1300px] mx-auto px-6 lg:px-12 flex items-center justify-between h-[64px] overflow-visible no-scrollbar">
            
            <div className="h-full flex items-center cursor-pointer group mr-6 shrink-0" onClick={() => setIsSidebarOpen(true)}>
              <div className="flex items-center bg-white rounded-full pr-5 pl-1 py-1 shadow-sm border border-slate-200 group-hover:shadow-md transition-all">
                <div className="bg-[#2a64f6] text-white p-2 rounded-full flex items-center justify-center"><Menu size={20} strokeWidth={2.5} /></div>
                <span className="font-bold text-slate-800 text-[15px] ml-3">All Categories</span>
              </div>
            </div>

            {/* Nav List: Distributed completely full-width across the available space */}
            <nav className="flex items-center justify-between xl:justify-center xl:gap-10 w-full flex-1 px-4">
              <Link to="/" className="text-[15px] font-bold text-slate-700 hover:text-[#45c4f0] transition-colors whitespace-nowrap">Home</Link>
              <Link to="/?category=Microcontrollers" className="text-[15px] font-bold text-slate-700 hover:text-[#45c4f0] transition-colors whitespace-nowrap">Microcontrollers</Link>
              
              <div className="relative group h-full flex items-center py-5 -my-5">
                <Link to="/?category=Projects" className="text-[15px] font-bold text-slate-700 hover:text-[#45c4f0] transition-colors whitespace-nowrap flex items-center gap-1">
                  Projects <ChevronRight size={14} className="rotate-90 group-hover:-rotate-90 transition-transform" />
                </Link>
                <div className="absolute top-[100%] left-1/2 -translate-x-1/2 mt-0 w-56 bg-white shadow-xl border border-slate-100 rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link to="/?search=Arduino" className="block px-6 py-2.5 text-[14px] font-bold text-slate-600 hover:text-[#45c4f0] hover:bg-slate-50 transition-colors">Arduino Projects</Link>
                  <Link to="/?search=IoT" className="block px-6 py-2.5 text-[14px] font-bold text-slate-600 hover:text-[#45c4f0] hover:bg-slate-50 transition-colors">IoT Automations</Link>
                  <Link to="/?search=Robotics" className="block px-6 py-2.5 text-[14px] font-bold text-slate-600 hover:text-[#45c4f0] hover:bg-slate-50 transition-colors">Robotics Builds</Link>
                </div>
              </div>

              <Link to="/?view=new" className="text-[15px] font-bold text-slate-700 hover:text-[#45c4f0] transition-colors whitespace-nowrap flex items-center gap-1.5">
                Newly Added <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm animate-pulse">NEW</span>
              </Link>
              <Link to="/blog" className="text-[15px] font-bold text-slate-700 hover:text-[#45c4f0] transition-colors whitespace-nowrap">Blog</Link>
              <Link to="/contact" className="text-[15px] font-bold text-slate-700 hover:text-[#45c4f0] transition-colors whitespace-nowrap">Contact Us</Link>
            </nav>

            <div className="flex items-center gap-4 shrink-0 ml-4 pl-6 border-l border-slate-200">
              {currentUser ? (
                <button onClick={handleLogout} className="h-10 px-4 bg-white rounded-full border border-slate-200 flex items-center gap-2 text-slate-600 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200 transition-colors shadow-sm">
                  <User size={16}/> <span className="font-bold text-sm">Log Out</span>
                </button>
              ) : (
                <button onClick={() => {setIsSignUpMode(false); setIsLoginModalOpen(true);}} className="h-10 px-4 bg-white rounded-full border border-slate-200 flex items-center gap-2 text-slate-600 hover:text-[#45c4f0] hover:border-[#45c4f0] transition-colors shadow-sm">
                  <User size={16}/> <span className="font-bold text-sm">Log In</span>
                </button>
              )}
              
              <button onClick={() => setIsWishlistOpen(true)} className="w-10 h-10 bg-white rounded-full border border-slate-200 flex items-center justify-center text-rose-500 hover:text-white hover:bg-rose-500 transition-colors relative shadow-sm cursor-pointer">
                <Heart size={18}/>
                <span className="absolute -top-1 -right-1 bg-rose-100 text-rose-600 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">{wishlistItems.length}</span>
              </button>
              
              <button onClick={() => setIsCartOpen(true)} className="h-10 px-4 bg-white rounded-full flex items-center gap-2 text-slate-700 hover:bg-[#e0f7fa] transition-colors border border-slate-200 relative group cursor-pointer shadow-sm">
                <div className="bg-[#45c4f0] text-white p-1.5 rounded-full relative">
                  <ShoppingCart size={14}/>
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">{cartItems.length}</span>
                </div>
                <span className="text-[15px] font-black">₹{cartTotal}</span>
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 p-4 absolute top-[100%] left-0 w-full shadow-[0_10px_25px_rgba(0,0,0,0.1)]">
            <nav className="flex flex-col gap-2">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="p-3 font-bold text-slate-700 hover:bg-slate-50 rounded-xl">Home</Link>
              <Link to="/?category=Microcontrollers" onClick={() => setIsMobileMenuOpen(false)} className="p-3 font-bold text-slate-700 hover:bg-slate-50 rounded-xl">Microcontrollers</Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="p-3 font-bold text-slate-700 hover:bg-slate-50 rounded-xl">Contact Us</Link>
              <Link to="/?view=new" onClick={() => setIsMobileMenuOpen(false)} className="p-3 font-bold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2">Newly Added <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full">NEW</span></Link>
              
              {currentUser ? (
                <button onClick={handleLogout} className="p-3 font-bold text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl text-center mt-2 w-full text-left">Log Out</button>
              ) : (
                <button onClick={() => {setIsMobileMenuOpen(false); setIsSignUpMode(false); setIsLoginModalOpen(true);}} className="p-3 font-bold text-white bg-[#45c4f0] rounded-xl text-center mt-2 w-full">Log In / Register</button>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}