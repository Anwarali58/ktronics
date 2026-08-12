import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User, HeadphonesIcon, Menu, ChevronRight, X, Mail, Trash2, Lock, Eye, EyeOff, CheckCircle2, ArrowRight, LogOut } from 'lucide-react';
import { supabase } from './supabaseClient'; 

export default function Header() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [categories, setCategories] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeHoverCategory, setActiveHoverCategory] = useState(null);
  
  // Dynamic Site Settings
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'Ktronics',
    siteLogo: '',
    phone: '+92 311 1486790',
    email: 'support@ktronics.tech'
  });

  // Authentication States
  const [currentUser, setCurrentUser] = useState(localStorage.getItem('currentUser'));
  const [currentUserName, setCurrentUserName] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(sessionStorage.getItem('ktronic_admin_auth') === 'true');

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Cart & Wishlist States
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [cartTotal, setCartTotal] = useState("0.00");
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Fetch Live Data from Supabase
  const fetchLiveData = async () => {
    const { data: settingsData } = await supabase.from('site_settings').select('*').eq('id', 1).single();
    if (settingsData) {
      setSiteSettings({
        siteName: settingsData.site_name || 'Ktronics',
        siteLogo: settingsData.site_logo || '',
        phone: settingsData.phone || '+92 311 1486790',
        email: settingsData.email || 'support@ktronics.tech'
      });
    }

    const { data: catData } = await supabase.from('categories').select('*');
    if (catData) setCategories(catData.map(c => c.name));

    const cart = JSON.parse(localStorage.getItem('ktronic_cart')) || [];
    const wishlist = JSON.parse(localStorage.getItem('ktronic_wishlist')) || [];
    setCartItems(cart);
    setWishlistItems(wishlist);

    const total = cart.reduce((sum, item) => {
      const numericPrice = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
      return sum + (isNaN(numericPrice) ? 0 : numericPrice);
    }, 0);
    setCartTotal(total.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    
    // Check Auth details
    const email = localStorage.getItem('currentUser');
    if (email) {
      const usersDB = JSON.parse(localStorage.getItem('ktronic_users')) || [];
      const user = usersDB.find(u => u.email === email);
      setCurrentUserName(user ? user.name : email.split('@')[0]);
    }
  };

  useEffect(() => {
    fetchLiveData();
    window.addEventListener('storage', fetchLiveData); 
    window.addEventListener('cartUpdated', fetchLiveData);
    window.addEventListener('wishlistUpdated', fetchLiveData);
    window.addEventListener('settingsUpdated', fetchLiveData);
    
    const handleOpenLogin = () => setIsLoginModalOpen(true);
    window.addEventListener('openLogin', handleOpenLogin);

    // Sync Auth States automatically (fixes the Admin logout not updating the button bug)
    const authSyncInterval = setInterval(() => {
      setIsAdminLoggedIn(sessionStorage.getItem('ktronic_admin_auth') === 'true');
      const email = localStorage.getItem('currentUser');
      if (email !== currentUser) {
        setCurrentUser(email);
        if (!email) setCurrentUserName('');
      }
    }, 500);

    return () => {
      window.removeEventListener('storage', fetchLiveData);
      window.removeEventListener('cartUpdated', fetchLiveData);
      window.removeEventListener('wishlistUpdated', fetchLiveData);
      window.removeEventListener('settingsUpdated', fetchLiveData);
      window.removeEventListener('openLogin', handleOpenLogin);
      clearInterval(authSyncInterval);
    };
  }, [currentUser]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) navigate(`/?search=${encodeURIComponent(searchInput)}`);
    else navigate(`/`);
    setIsMobileMenuOpen(false);
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    const emailInput = e.target.elements.email.value;
    const passwordInput = e.target.elements.password.value;
    const usersDB = JSON.parse(localStorage.getItem('ktronic_users')) || [];

    if (isSignUpMode) {
      const nameInput = e.target.elements.fullName.value;
      if (usersDB.find(u => u.email === emailInput)) return setAuthError('Account already exists.');
      if (passwordInput.length < 6) return setAuthError('Password min 6 chars.');
      usersDB.push({ email: emailInput, password: passwordInput, name: nameInput });
      localStorage.setItem('ktronic_users', JSON.stringify(usersDB));
      e.target.reset();
      setIsSignUpMode(false);
      setAuthSuccess('Account created successfully! Please log in below.');
    } else {
      const user = usersDB.find(u => u.email === emailInput);
      if (!user) return setAuthError('No account found. Create an account first.');
      if (user.password !== passwordInput) return setAuthError('Incorrect password.');
      
      localStorage.setItem('currentUser', emailInput);
      setCurrentUser(emailInput);
      setCurrentUserName(user.name);
      setIsLoginModalOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setCurrentUserName('');
    setIsMobileMenuOpen(false);
  };

  const removeFromCart = (e, index) => {
    e.stopPropagation(); 
    const updated = [...cartItems];
    updated.splice(index, 1);
    localStorage.setItem('ktronic_cart', JSON.stringify(updated));
    fetchLiveData();
  };

  const removeFromWishlist = (e, index) => {
    e.stopPropagation();
    const updated = [...wishlistItems];
    updated.splice(index, 1);
    localStorage.setItem('ktronic_wishlist', JSON.stringify(updated));
    fetchLiveData();
  };

  const handleProceedToItemDetail = (item) => {
    setIsCartOpen(false);
    setIsWishlistOpen(false);
    window.dispatchEvent(new CustomEvent('openProductDetail', { detail: item }));
  };

  // --- DYNAMIC MULTI-DROPDOWN LOGIC ---
  const displayCategories = categories.filter(c => c !== 'Hero Banners');
  
  // 1. Map out the Projects Dropdown Categories
  let projectSubCategories = displayCategories.filter(c => 
    ['iot', 'arduino', 'drone', 'robotics', 'projects'].some(keyword => c.toLowerCase().includes(keyword))
  );

  // Remaining categories after Projects takes its pick
  let remainingForExplore = displayCategories.filter(c => !projectSubCategories.includes(c));

  // Fill Projects dropdown to exactly 4 if it's lacking
  if (projectSubCategories.length < 4) {
    const missingCount = 4 - projectSubCategories.length;
    projectSubCategories = [...projectSubCategories, ...remainingForExplore.slice(0, missingCount)];
    remainingForExplore = remainingForExplore.slice(missingCount);
  }
  const dynamicProjectCategories = projectSubCategories.slice(0, 4); 

  // 2. Map out the Explore Dropdown Categories from whatever is left
  const dynamicExploreCategories = remainingForExplore.slice(0, 4);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@500;700;800;900&display=swap');
        .font-nunito { font-family: 'Nunito', sans-serif; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        @keyframes gradient-shimmer { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-gradient-text { background-size: 200% auto; animation: gradient-shimmer 3s linear infinite; }
      `}</style>

      {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[90] transition-opacity" onClick={() => setIsSidebarOpen(false)} />}
      
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[110] flex items-center justify-center p-4 font-nunito">
          <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-[32px] shadow-2xl w-full max-w-[900px] relative animate-fade-in-up flex overflow-hidden">
            <div className="hidden md:flex w-1/2 bg-gradient-to-br from-[#2a64f6] to-[#45c4f0] p-10 flex-col justify-between relative overflow-hidden">
               <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
               <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
               <div className="relative z-10">
                 {siteSettings.siteLogo ? (
                   <img src={siteSettings.siteLogo} alt={siteSettings.siteName} className="h-14 w-auto max-w-[200px] object-contain mb-8 shadow-sm bg-white p-2 rounded-2xl shrink-0" />
                 ) : (
                   <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                     <span className="text-[#2a64f6] font-black text-3xl">{siteSettings.siteName.charAt(0)}</span>
                   </div>
                 )}
                 <h2 className="text-4xl font-black text-white leading-tight mb-4 tracking-tight">
                   {isSignUpMode ? 'Join the Innovation.' : 'Welcome Back.'}
                 </h2>
                 <p className="text-white/90 font-bold text-[17px] leading-relaxed">
                   {isSignUpMode ? 'Create an account to track orders, save wishlist items, and checkout faster.' : 'Log in to access your personalized dashboard, saved components, and order history.'}
                 </p>
               </div>
            </div>

            <div className="w-full md:w-1/2 p-8 md:p-12 relative bg-white flex flex-col justify-center">
              <button onClick={() => { setIsLoginModalOpen(false); setAuthError(''); setAuthSuccess(''); }} className="absolute top-6 right-6 text-slate-400 hover:text-rose-500 bg-slate-50 hover:bg-rose-50 p-2.5 rounded-full transition-colors"><X size={20}/></button>
              <div className="md:hidden flex items-center gap-3 mb-8">
                 {siteSettings.siteLogo ? (
                   <img src={siteSettings.siteLogo} alt={siteSettings.siteName} className="h-10 w-auto max-w-[150px] object-contain shrink-0" />
                 ) : (
                   <div className="h-10 w-10 bg-[#45c4f0] rounded-xl flex items-center justify-center shadow-sm shrink-0"><span className="text-white font-black text-2xl">{siteSettings.siteName.charAt(0)}</span></div>
                 )}
                 <span className="text-2xl font-black text-[#45c4f0] truncate">{siteSettings.siteName}</span>
              </div>
              <h3 className="text-[28px] font-black text-slate-900 mb-1 tracking-tight">{isSignUpMode ? 'Create Account' : 'Sign In'}</h3>
              <p className="text-slate-500 font-bold mb-6 text-[15px]">{isSignUpMode ? 'Please fill your details below.' : 'Enter your credentials to continue.'}</p>

              <div className="flex items-center gap-3 mb-6">
                <div className="h-px bg-slate-200 flex-1"></div>
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Continue with email</span>
                <div className="h-px bg-slate-200 flex-1"></div>
              </div>

              {authError && <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm font-bold px-4 py-3 rounded-xl mb-4 flex items-center justify-between animate-fade-in-up">{authError}<X size={16} className="cursor-pointer hover:text-rose-800" onClick={() => setAuthError('')} /></div>}
              {authSuccess && <div className="bg-[#2ed573]/10 border border-[#2ed573]/30 text-[#27ae60] text-sm font-bold px-4 py-3 rounded-xl mb-4 flex items-center gap-2 animate-fade-in-up"><CheckCircle2 size={18} /> {authSuccess}</div>}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {isSignUpMode && (
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                    <input name="fullName" type="text" required placeholder="Full Name" className="w-full border-2 border-slate-100 bg-slate-50/50 rounded-xl pl-12 pr-4 py-3.5 outline-none focus:border-[#45c4f0] focus:bg-white focus:ring-4 focus:ring-[#45c4f0]/10 transition-all font-bold text-[15px] text-slate-800 placeholder-slate-400" />
                  </div>
                )}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                  <input name="email" type="email" required placeholder="Email Address" className="w-full border-2 border-slate-100 bg-slate-50/50 rounded-xl pl-12 pr-4 py-3.5 outline-none focus:border-[#45c4f0] focus:bg-white focus:ring-4 focus:ring-[#45c4f0]/10 transition-all font-bold text-[15px] text-slate-800 placeholder-slate-400" />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                  <input name="password" type={showPassword ? "text" : "password"} required placeholder="Password (min. 6 chars)" className="w-full border-2 border-slate-100 bg-slate-50/50 rounded-xl pl-12 pr-12 py-3.5 outline-none focus:border-[#45c4f0] focus:bg-white focus:ring-4 focus:ring-[#45c4f0]/10 transition-all font-bold text-[15px] text-slate-800 placeholder-slate-400" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                  </button>
                </div>

                {!isSignUpMode && <div className="flex justify-end pt-1"><a href="#" className="text-[13px] font-black text-[#2a64f6] hover:underline">Forgot password?</a></div>}

                <button type="submit" className="w-full bg-[#2a64f6] text-white font-black py-4 rounded-xl mt-4 transition-all shadow-[0_4px_14px_rgba(42,100,246,0.25)] hover:shadow-[0_6px_20px_rgba(42,100,246,0.4)] hover:-translate-y-0.5 text-[16px]">
                  {isSignUpMode ? 'Create Account' : 'Sign In'}
                </button>
              </form>

              <div className="mt-8 text-center">
                <button onClick={() => { setIsSignUpMode(!isSignUpMode); setAuthError(''); setAuthSuccess(''); setShowPassword(false); }} className="text-[15px] font-bold text-slate-500 hover:text-[#2a64f6] transition-colors">
                  {isSignUpMode ? 'Already have an account? Log In' : "Don't have an account? Sign up"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  <div key={idx} onClick={() => handleProceedToItemDetail(item)} className="flex gap-4 border border-slate-100 p-3 rounded-xl items-center relative group cursor-pointer hover:border-[#45c4f0] hover:bg-slate-50 transition-all">
                    <img src={item.image} className="w-16 h-16 object-contain bg-white rounded-lg p-1 border border-slate-100 shadow-sm" alt={item.name} />
                    <div className="flex-1">
                      <h4 className="text-[14px] font-bold leading-tight line-clamp-2 text-slate-800 group-hover:text-[#2a64f6] transition-colors">{item.name}</h4>
                      <p className="text-[#2a64f6] font-black mt-1">{item.price}</p>
                    </div>
                    <button onClick={(e) => removeFromCart(e, idx)} className="text-slate-400 p-2 bg-white border border-slate-100 rounded-lg hover:bg-rose-500 hover:border-rose-500 hover:text-white transition-colors shadow-sm"><Trash2 size={16}/></button>
                  </div>
                ))
              )}
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-slate-600">Total Price</span>
                <span className="text-2xl font-black text-slate-900">Rs. {cartTotal}</span>
              </div>
              <button className="w-full bg-[#2ed573] hover:bg-green-600 text-white font-black py-4 rounded-xl transition-colors shadow-[0_4px_14px_rgba(46,213,115,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(46,213,115,0.4)]">Proceed to Checkout</button>
            </div>
          </div>
        </div>
      )}

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
                  <div key={idx} onClick={() => handleProceedToItemDetail(item)} className="flex gap-4 border border-slate-100 p-3 rounded-xl items-center relative cursor-pointer hover:border-[#45c4f0] hover:bg-slate-50 transition-all group">
                    <img src={item.image} className="w-16 h-16 object-contain bg-white rounded-lg p-1 border border-slate-100 shadow-sm" alt={item.name} />
                    <div className="flex-1">
                      <h4 className="text-[14px] font-bold leading-tight line-clamp-2 group-hover:text-[#2a64f6] transition-colors">{item.name}</h4>
                      <p className="text-[#2a64f6] font-black mt-1">{item.price}</p>
                    </div>
                    <button onClick={(e) => removeFromWishlist(e, idx)} className="text-slate-400 p-2 bg-white border border-slate-100 rounded-lg hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200 transition-colors shadow-sm"><Trash2 size={16}/></button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <div className={`fixed top-32 left-0 z-40 bg-[#45c4f0] text-white p-3 rounded-r-full cursor-pointer shadow-lg transition-transform duration-300 ${isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}`} onMouseEnter={() => setIsSidebarOpen(true)} onClick={() => setIsSidebarOpen(true)}>
        <Menu size={24} />
      </div>

      <div className={`fixed top-0 left-0 h-full w-[85%] sm:w-[300px] bg-white shadow-[0_0_50px_rgba(0,0,0,0.2)] z-[100] transform transition-transform duration-300 ease-in-out font-nunito flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`} onMouseLeave={() => { setIsSidebarOpen(false); setActiveHoverCategory(null); }}>
        <div className="bg-[#45c4f0] text-white px-6 py-5 flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-3 font-black text-xl"><Menu size={24} strokeWidth={2.5} /> Categories</div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden bg-white/20 p-1.5 rounded-lg"><X size={20}/></button>
        </div>
        <ul className="py-2 flex-1 overflow-y-auto custom-scrollbar">
          {displayCategories.length === 0 ? (
            <li className="px-6 py-4 text-slate-400 font-bold text-sm">No live categories.</li>
          ) : (
            displayCategories.map((cat) => (
              <li key={cat}>
                <Link to={`/?category=${encodeURIComponent(cat)}`} onClick={() => setIsSidebarOpen(false)} className="w-full flex items-center justify-between px-6 py-3 text-[15px] font-bold transition-colors text-slate-700 hover:text-[#45c4f0] hover:bg-slate-50">
                  {cat} <ChevronRight size={16} className="opacity-0 hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* --- TOP HEADER BAR --- */}
      <header className="w-full bg-white shadow-sm flex flex-col font-nunito relative z-30">
        <div className="max-w-[1500px] w-full mx-auto px-4 sm:px-6 py-4 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-12">
          
          <div className="flex items-center justify-between w-full lg:w-auto shrink-0">
            <Link to="/" className="flex items-center gap-3 shrink-0">
              {siteSettings.siteLogo ? (
                <img src={siteSettings.siteLogo} alt={siteSettings.siteName} className="max-h-10 sm:max-h-14 w-auto max-w-[180px] sm:max-w-[250px] object-contain shrink-0" />
              ) : (
                <>
                  <div className="h-10 w-10 bg-[#45c4f0] rounded flex items-center justify-center shrink-0"><span className="text-white font-black text-2xl">{siteSettings.siteName.charAt(0)}</span></div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-[#45c4f0] leading-none tracking-tight">{siteSettings.siteName}</span>
                    <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Explore • Learn • Build</span>
                  </div>
                </>
              )}
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

          <form onSubmit={handleSearch} className="flex-1 w-full relative order-3 lg:order-2 lg:mx-4">
            <input type="text" placeholder="Search for products, categories, or kits..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="w-full border-2 border-slate-100 bg-white rounded-full py-3.5 pl-6 pr-14 outline-none focus:border-[#45c4f0] transition-all text-[15px] font-bold text-slate-700 shadow-sm" />
            <button type="submit" className="absolute right-2 top-2 bg-[#45c4f0] hover:bg-[#3ab0d9] text-white p-2.5 rounded-full transition-colors"><Search size={20} /></button>
          </form>

          <div className="hidden lg:flex items-center gap-6 shrink-0 order-2 lg:order-3">
            <a href={`tel:${siteSettings.phone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="bg-[#eef6ff] p-2.5 rounded-full"><HeadphonesIcon size={22} className="text-[#2a64f6]" /></div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">Call Us</span>
                <span className="text-[15px] font-black text-slate-800 leading-none mt-1.5">{siteSettings.phone}</span>
              </div>
            </a>
            
            <a href={`mailto:${siteSettings.email}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="bg-[#eef6ff] p-2.5 rounded-full"><Mail size={22} className="text-[#2a64f6]" /></div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">Email Us</span>
                <span className="text-[15px] font-black text-slate-800 leading-none mt-1.5">{siteSettings.email}</span>
              </div>
            </a>

            <div className="flex items-center gap-3 bg-gradient-to-r from-[#2a64f6]/10 to-[#45c4f0]/10 px-4 py-2.5 rounded-2xl border border-[#2a64f6]/20 shadow-sm ml-2">
               <span className="text-[#2a64f6] font-black text-2xl italic tracking-tighter drop-shadow-sm">24/7</span>
               <div className="flex flex-col">
                 <span className="text-[10px] font-bold text-[#2a64f6] uppercase tracking-widest leading-tight">Fast</span>
                 <span className="text-[13px] font-black text-slate-800 leading-tight">Dispatch</span>
               </div>
            </div>
          </div>
        </div>

        {/* BOTTOM NAVIGATION BAR */}
        <div className="hidden lg:block bg-white border-t border-[#e2e8f0]">
          <div className="max-w-[1300px] mx-auto px-6 lg:px-12 flex items-center justify-between h-[64px] overflow-visible no-scrollbar">
            <div className="h-full flex items-center cursor-pointer group mr-6 shrink-0" onClick={() => setIsSidebarOpen(true)}>
              <div className="flex items-center bg-white rounded-full pr-5 pl-1 py-1 shadow-sm border border-slate-200 group-hover:shadow-md transition-all">
                <div className="bg-[#2a64f6] text-white p-2 rounded-full flex items-center justify-center"><Menu size={20} strokeWidth={2.5} /></div>
                <span className="font-bold text-slate-800 text-[15px] ml-3">All Categories</span>
              </div>
            </div>

            <nav className="flex items-center justify-between xl:justify-center xl:gap-10 w-full flex-1 px-4">
              <Link to="/" className="text-[15px] font-bold text-slate-700 hover:text-[#45c4f0] transition-colors whitespace-nowrap">Home</Link>
              
              {dynamicExploreCategories.length > 0 ? (
                <div className="relative group h-full flex items-center py-5 -my-5">
                  <Link to="/?category=Explore" className="text-[15px] font-bold text-slate-700 hover:text-[#45c4f0] transition-colors whitespace-nowrap flex items-center gap-1">
                    Explore <ChevronRight size={14} className="rotate-90 group-hover:-rotate-90 transition-transform duration-300" />
                  </Link>
                  <div className="absolute top-[100%] left-1/2 -translate-x-1/2 mt-3 w-64 bg-white/95 backdrop-blur-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-100 rounded-2xl p-2.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:mt-0 transition-all duration-300 z-50 flex flex-col gap-1">
                    {dynamicExploreCategories.map(cat => (
                      <Link key={cat} to={`/?category=${encodeURIComponent(cat)}`} className="px-4 py-3 text-[14px] font-bold text-slate-600 hover:text-[#2a64f6] hover:bg-[#eef6ff] rounded-xl transition-colors flex items-center justify-between group/item">
                        {cat}
                        <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300" />
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link to="/?category=Explore" className="text-[15px] font-bold text-slate-700 hover:text-[#45c4f0] transition-colors whitespace-nowrap">Explore</Link>
              )}

              {dynamicProjectCategories.length > 0 && (
                <div className="relative group h-full flex items-center py-5 -my-5">
                  <Link to="/?category=Projects" className="text-[15px] font-bold text-slate-700 hover:text-[#45c4f0] transition-colors whitespace-nowrap flex items-center gap-1">
                    Projects <ChevronRight size={14} className="rotate-90 group-hover:-rotate-90 transition-transform duration-300" />
                  </Link>
                  <div className="absolute top-[100%] left-1/2 -translate-x-1/2 mt-3 w-64 bg-white/95 backdrop-blur-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-100 rounded-2xl p-2.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:mt-0 transition-all duration-300 z-50 flex flex-col gap-1">
                    {dynamicProjectCategories.map(cat => (
                      <Link key={cat} to={`/?category=${encodeURIComponent(cat)}`} className="px-4 py-3 text-[14px] font-bold text-slate-600 hover:text-[#2a64f6] hover:bg-[#eef6ff] rounded-xl transition-colors flex items-center justify-between group/item">
                        {cat}
                        <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <Link to="/?view=new" className="text-[15px] font-bold text-slate-700 hover:text-[#45c4f0] transition-colors whitespace-nowrap flex items-center gap-1.5">
                Newly Added <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm animate-pulse">NEW</span>
              </Link>
              <Link to="/blog" className="text-[15px] font-bold text-slate-700 hover:text-[#45c4f0] transition-colors whitespace-nowrap">Blog</Link>
              <Link to="/contact" className="text-[15px] font-bold text-slate-700 hover:text-[#45c4f0] transition-colors whitespace-nowrap">Contact Us</Link>
            </nav>

            <div className="flex items-center gap-4 shrink-0 ml-4 pl-6 border-l border-slate-200">
              
              {/* Dynamic User Authentication State UI */}
              {isAdminLoggedIn ? (
                <Link to="/admin" className="h-10 px-4 bg-slate-900 rounded-full border border-slate-700 flex items-center gap-2 text-white hover:bg-slate-800 transition-colors shadow-sm">
                  <Lock size={14} className="text-[#45c4f0]" /> <span className="font-bold text-sm">Admin</span>
                </Link>
              ) : currentUser ? (
                <div className="relative group/user h-full flex items-center py-2 -my-2 cursor-pointer">
                  <div className="h-10 w-10 bg-gradient-to-br from-[#2a64f6] to-[#45c4f0] rounded-full flex items-center justify-center text-white font-black shadow-sm border-2 border-white ring-2 ring-slate-100 hover:ring-[#45c4f0]/50 transition-all">
                    {currentUserName ? currentUserName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="absolute top-[100%] right-0 mt-0 w-48 bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-100 rounded-2xl py-2 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all duration-300 z-50 flex flex-col">
                    <div className="px-4 py-3 border-b border-slate-50 mb-1">
                       <p className="text-[13px] font-black text-slate-800 truncate">{currentUserName}</p>
                       <p className="text-[11px] font-bold text-slate-400 truncate">{currentUser}</p>
                    </div>
                    <button onClick={handleLogout} className="px-4 py-2.5 text-[13px] font-bold text-rose-500 hover:bg-rose-50 flex items-center gap-2 transition-colors w-full text-left">
                      <LogOut size={16} /> Log Out
                    </button>
                  </div>
                </div>
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
                <span className="text-[15px] font-black">Rs. {cartTotal}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 p-4 absolute top-[100%] left-0 w-full shadow-[0_10px_25px_rgba(0,0,0,0.1)] z-50">
            <nav className="flex flex-col gap-2">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="p-3 font-bold text-slate-700 hover:bg-slate-50 rounded-xl">Home</Link>
              <Link to="/?category=Explore" onClick={() => setIsMobileMenuOpen(false)} className="p-3 font-bold text-slate-700 hover:bg-slate-50 rounded-xl">Explore</Link>
              <Link to="/?category=Projects" onClick={() => setIsMobileMenuOpen(false)} className="p-3 font-bold text-slate-700 hover:bg-slate-50 rounded-xl">Projects</Link>
              <Link to="/?view=new" onClick={() => setIsMobileMenuOpen(false)} className="p-3 font-bold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2">Newly Added <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full">NEW</span></Link>
              <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="p-3 font-bold text-slate-700 hover:bg-slate-50 rounded-xl">Blog</Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="p-3 font-bold text-slate-700 hover:bg-slate-50 rounded-xl">Contact Us</Link>
              
              {/* Dynamic Auth for Mobile */}
              {isAdminLoggedIn ? (
                <Link to="/admin" className="p-3 font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl text-center mt-2 w-full flex items-center justify-center gap-2"><Lock size={16} className="text-[#45c4f0]"/> Admin Dashboard</Link>
              ) : currentUser ? (
                <div className="mt-2 pt-2 border-t border-slate-100">
                   <div className="p-3 flex items-center gap-3">
                     <div className="h-10 w-10 bg-gradient-to-br from-[#2a64f6] to-[#45c4f0] rounded-full flex items-center justify-center text-white font-black shadow-sm shrink-0">
                        {currentUserName ? currentUserName.charAt(0).toUpperCase() : 'U'}
                     </div>
                     <div className="overflow-hidden">
                       <p className="text-[14px] font-black text-slate-800 truncate">{currentUserName}</p>
                       <p className="text-[12px] font-bold text-slate-400 truncate">{currentUser}</p>
                     </div>
                   </div>
                   <button onClick={handleLogout} className="p-3 font-bold text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl text-center w-full flex items-center justify-center gap-2 mt-1"><LogOut size={16}/> Log Out</button>
                </div>
              ) : (
                <button onClick={() => {setIsMobileMenuOpen(false); setIsSignUpMode(false); setIsLoginModalOpen(true);}} className="p-3 font-bold text-white bg-[#45c4f0] rounded-xl text-center mt-2 w-full shadow-sm hover:bg-[#3ab0d9]">Log In / Register</button>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}