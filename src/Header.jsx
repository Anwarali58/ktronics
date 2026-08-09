import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User, HeadphonesIcon, Menu, ChevronRight, X, Mail, Trash2, Lock, Eye, EyeOff } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [categories, setCategories] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeHoverCategory, setActiveHoverCategory] = useState(null);
  
  const [currentUser, setCurrentUser] = useState(localStorage.getItem('currentUser'));
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [cartTotal, setCartTotal] = useState("0.00");
  
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
    setCartTotal(total.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  };

  const loadCategories = () => {
    // Strictly load what the Admin has saved. No fake fallbacks!
    const dbCategories = JSON.parse(localStorage.getItem('ktronic_categories')) || [];
    setCategories(dbCategories);
  };

  useEffect(() => {
    loadCategories();
    updateCartAndWishlist();

    window.addEventListener('storage', loadCategories); // Listen if Admin adds new category
    window.addEventListener('cartUpdated', updateCartAndWishlist);
    window.addEventListener('wishlistUpdated', updateCartAndWishlist);
    
    const handleOpenLogin = () => setIsLoginModalOpen(true);
    window.addEventListener('openLogin', handleOpenLogin);

    return () => {
      window.removeEventListener('storage', loadCategories);
      window.removeEventListener('cartUpdated', updateCartAndWishlist);
      window.removeEventListener('wishlistUpdated', updateCartAndWishlist);
      window.removeEventListener('openLogin', handleOpenLogin);
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
    setAuthError('');
    setAuthSuccess('');
    
    const emailInput = e.target.elements.email.value;
    const passwordInput = e.target.elements.password.value;
    const usersDB = JSON.parse(localStorage.getItem('ktronic_users')) || [];

    if (isSignUpMode) {
      const nameInput = e.target.elements.fullName.value;
      if (usersDB.find(u => u.email === emailInput)) {
        setAuthError('An account with this email already exists.');
        return;
      }
      if (passwordInput.length < 6) {
        setAuthError('Password must be at least 6 characters long.');
        return;
      }
      usersDB.push({ email: emailInput, password: passwordInput, name: nameInput });
      localStorage.setItem('ktronic_users', JSON.stringify(usersDB));
      
      e.target.reset();
      setIsSignUpMode(false);
      setAuthSuccess('Account created successfully! Please log in below.');
    } else {
      const user = usersDB.find(u => u.email === emailInput);
      if (!user) {
        setAuthError('No account found with this email. Please create an account first.');
        return;
      }
      if (user.password !== passwordInput) {
        setAuthError('Incorrect password. Please try again.');
        return;
      }
      localStorage.setItem('currentUser', emailInput);
      setCurrentUser(emailInput);
      setIsLoginModalOpen(false);
    }
  };

  const handleSocialLogin = (provider) => {
    setAuthError(`Live ${provider} authentication requires backend OAuth configuration. Please use the Email/Password option to log in securely.`);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setIsMobileMenuOpen(false);
  };

  const removeFromCart = (e, index) => {
    e.stopPropagation(); 
    const updated = [...cartItems];
    updated.splice(index, 1);
    localStorage.setItem('ktronic_cart', JSON.stringify(updated));
    updateCartAndWishlist();
  };

  const removeFromWishlist = (e, index) => {
    e.stopPropagation();
    const updated = [...wishlistItems];
    updated.splice(index, 1);
    localStorage.setItem('ktronic_wishlist', JSON.stringify(updated));
    updateCartAndWishlist();
  };

  const handleProceedToItemDetail = (item) => {
    setIsCartOpen(false);
    setIsWishlistOpen(false);
    window.dispatchEvent(new CustomEvent('openProductDetail', { detail: item }));
  };

  // We can dynamically pull subcategories if needed, but for now we will keep a few static suggestions
  const subCategories = ['View All', 'New Arrivals', 'Best Sellers'];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@500;700;800;900&display=swap');
        .font-nunito { font-family: 'Nunito', sans-serif; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        @keyframes gradient-shimmer { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-gradient-text { background-size: 200% auto; animation: gradient-shimmer 3s linear infinite; }
      `}</style>

      {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[90] transition-opacity" onClick={() => setIsSidebarOpen(false)} />}
      
      {/* AUTH MODAL */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[110] flex items-center justify-center p-4 font-nunito">
          <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-[32px] shadow-2xl w-full max-w-[900px] relative animate-fade-in-up flex overflow-hidden">
            <div className="hidden md:flex w-1/2 bg-gradient-to-br from-[#2a64f6] to-[#45c4f0] p-10 flex-col justify-between relative overflow-hidden">
               <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
               <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
               <div className="relative z-10">
                 <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                   <span className="text-[#2a64f6] font-black text-3xl">K</span>
                 </div>
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
                 <div className="h-10 w-10 bg-[#45c4f0] rounded-xl flex items-center justify-center shadow-sm"><span className="text-white font-black text-2xl">K</span></div>
                 <span className="text-2xl font-black text-[#45c4f0]">Ktronics</span>
              </div>
              <h3 className="text-[28px] font-black text-slate-900 mb-1 tracking-tight">{isSignUpMode ? 'Create Account' : 'Sign In'}</h3>
              <p className="text-slate-500 font-bold mb-6 text-[15px]">{isSignUpMode ? 'Please fill your details below.' : 'Enter your credentials to continue.'}</p>

              <div className="flex gap-3 mb-6">
                 <button onClick={() => handleSocialLogin('Google')} className="flex-1 border-2 border-slate-100 py-3 rounded-xl flex items-center justify-center gap-2 text-[14px] font-black text-slate-700 hover:bg-slate-50 hover:border-[#4285F4] transition-all">
                    <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                 </button>
                 <button onClick={() => handleSocialLogin('GitHub')} className="flex-1 border-2 border-slate-100 py-3 rounded-xl flex items-center justify-center gap-2 text-[14px] font-black text-slate-700 hover:bg-slate-50 hover:border-slate-800 transition-all">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/></svg>
                 </button>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="h-px bg-slate-200 flex-1"></div>
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Or continue with email</span>
                <div className="h-px bg-slate-200 flex-1"></div>
              </div>

              {authError && <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm font-bold px-4 py-3 rounded-xl mb-4 flex items-center justify-between animate-fade-in-up">{authError}<X size={16} className="cursor-pointer hover:text-rose-800" onClick={() => setAuthError('')} /></div>}
              {authSuccess && <div className="bg-[#2ed573]/10 border border-[#2ed573]/30 text-[#27ae60] text-sm font-bold px-4 py-3 rounded-xl mb-4 flex items-center gap-2 animate-fade-in-up"><Heart size={18} /> {authSuccess}</div>}

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

      {/* Cart Drawer */}
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

      {/* Wishlist Drawer */}
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

      {/* --- HEADER CONTENT --- */}
      <div className={`fixed top-32 left-0 z-40 bg-[#45c4f0] text-white p-3 rounded-r-full cursor-pointer shadow-lg transition-transform duration-300 ${isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}`} onMouseEnter={() => setIsSidebarOpen(true)} onClick={() => setIsSidebarOpen(true)}>
        <Menu size={24} />
      </div>

      <div className={`fixed top-0 left-0 h-full w-[85%] sm:w-[300px] bg-white shadow-[0_0_50px_rgba(0,0,0,0.2)] z-[100] transform transition-transform duration-300 ease-in-out font-nunito ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`} onMouseLeave={() => { setIsSidebarOpen(false); setActiveHoverCategory(null); }}>
        <div className="bg-[#45c4f0] text-white px-6 py-5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 font-black text-xl"><Menu size={24} strokeWidth={2.5} /> Categories</div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden bg-white/20 p-1.5 rounded-lg"><X size={20}/></button>
        </div>
        <ul className="py-2 h-[calc(100vh-80px)] overflow-y-auto custom-scrollbar">
          {categories.length === 0 ? (
            <li className="px-6 py-4 text-slate-400 font-bold text-sm">No categories available.</li>
          ) : (
            categories.map((cat) => (
              <li key={cat} className="relative group/item" onMouseEnter={() => setActiveHoverCategory(cat)} onMouseLeave={() => setActiveHoverCategory(null)}>
                <Link to={`/?category=${encodeURIComponent(cat)}`} onClick={() => setIsSidebarOpen(false)} className={`w-full flex items-center justify-between px-6 py-3 text-[15px] font-bold transition-colors ${activeHoverCategory === cat ? 'text-[#45c4f0]' : 'text-slate-700'}`}>
                  {cat} <ChevronRight size={16} className={`transition-opacity hidden sm:block ${activeHoverCategory === cat ? 'opacity-100 text-[#45c4f0]' : 'opacity-0'}`} />
                </Link>
                {activeHoverCategory === cat && (
                  <div className="hidden sm:block absolute top-0 left-[295px] w-[220px] bg-white shadow-2xl border border-slate-100 rounded-xl py-2 z-[100]">
                    {subCategories.map(sub => <Link key={sub} to={`/?search=${encodeURIComponent(sub)}`} className="block px-6 py-2.5 text-[15px] font-bold text-slate-600 hover:text-[#45c4f0] hover:bg-slate-50 transition-colors">{sub}</Link>)}
                  </div>
                )}
              </li>
            ))
          )}
        </ul>
      </div>

      <header className="w-full bg-white shadow-sm flex flex-col font-nunito relative z-30">
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
              <button onClick={() => currentUser ? setIsCartOpen(true) : setIsLoginModalOpen(true)} className="relative p-2 text-slate-600">
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

          <div className="hidden lg:flex items-center gap-8 shrink-0 order-2 lg:order-3">
            <a href="tel:+923111486790" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <HeadphonesIcon size={28} className="text-slate-700 stroke-1" />
              <div className="flex flex-col"><span className="text-[13px] font-bold text-slate-700">Customer Support</span><span className="text-[15px] font-black text-[#2a64f6]">+92 311 1486790</span></div>
            </a>
            <a href="mailto:support@ktronics.org" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <Mail size={28} className="text-slate-700 stroke-1" />
              <div className="flex flex-col"><span className="text-[13px] font-bold text-slate-700">Email Us</span><span className="text-[15px] font-black text-[#2a64f6]">support@ktronics.io</span></div>
            </a>
          </div>
        </div>

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
              
              <button onClick={() => currentUser ? setIsWishlistOpen(true) : setIsLoginModalOpen(true)} className="w-10 h-10 bg-white rounded-full border border-slate-200 flex items-center justify-center text-rose-500 hover:text-white hover:bg-rose-500 transition-colors relative shadow-sm cursor-pointer">
                <Heart size={18}/>
                <span className="absolute -top-1 -right-1 bg-rose-100 text-rose-600 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">{wishlistItems.length}</span>
              </button>
              
              <button onClick={() => currentUser ? setIsCartOpen(true) : setIsLoginModalOpen(true)} className="h-10 px-4 bg-white rounded-full flex items-center gap-2 text-slate-700 hover:bg-[#e0f7fa] transition-colors border border-slate-200 relative group cursor-pointer shadow-sm">
                <div className="bg-[#45c4f0] text-white p-1.5 rounded-full relative">
                  <ShoppingCart size={14}/>
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">{cartItems.length}</span>
                </div>
                <span className="text-[15px] font-black">Rs. {cartTotal}</span>
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 p-4 absolute top-[100%] left-0 w-full shadow-[0_10px_25px_rgba(0,0,0,0.1)] z-50">
            <nav className="flex flex-col gap-2">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="p-3 font-bold text-slate-700 hover:bg-slate-50 rounded-xl">Home</Link>
              <Link to="/?category=Microcontrollers" onClick={() => setIsMobileMenuOpen(false)} className="p-3 font-bold text-slate-700 hover:bg-slate-50 rounded-xl">Microcontrollers</Link>
              <Link to="/?category=Projects" onClick={() => setIsMobileMenuOpen(false)} className="p-3 font-bold text-slate-700 hover:bg-slate-50 rounded-xl">Projects</Link>
              <Link to="/?view=new" onClick={() => setIsMobileMenuOpen(false)} className="p-3 font-bold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2">Newly Added <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full">NEW</span></Link>
              <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="p-3 font-bold text-slate-700 hover:bg-slate-50 rounded-xl">Blog</Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="p-3 font-bold text-slate-700 hover:bg-slate-50 rounded-xl">Contact Us</Link>
              
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