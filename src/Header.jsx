import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User, HeadphonesIcon, Globe, Shuffle, LogOut, Menu, ChevronRight } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [categories, setCategories] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeHoverCategory, setActiveHoverCategory] = useState(null);
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    const dbCategories = JSON.parse(localStorage.getItem('ktronic_categories')) || [
      'Microcontrollers', 'Robotics', 'Electronic Modules', 
      'Displays', 'Battery & Charger', 'Kits', 'IoT & Wireless Boards', 
      'Tools', 'Sensors'
    ];
    setCategories(dbCategories);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) navigate(`/?search=${encodeURIComponent(searchInput)}`);
    else navigate(`/`);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const subCategories = ['Bluetooth', 'GPS/GNSS', 'GSM, GPRS, 4G', 'nRF'];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@500;700;800;900&display=swap');
        .font-nunito { font-family: 'Nunito', sans-serif; }
      `}</style>

      {/* Floating Left Edge Button */}
      <div 
        className={`fixed top-32 left-0 z-40 bg-[#45c4f0] text-white p-3 rounded-r-full cursor-pointer shadow-lg transition-transform duration-300 ${isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}`}
        onMouseEnter={() => setIsSidebarOpen(true)}
        onClick={() => setIsSidebarOpen(true)}
      >
        <Menu size={24} />
      </div>

      {/* Global Fixed Left Sidebar Drawer */}
      <div 
        className={`fixed top-0 left-0 h-full w-[300px] bg-white shadow-[0_0_50px_rgba(0,0,0,0.2)] z-[100] transform transition-transform duration-300 ease-in-out font-nunito ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        onMouseLeave={() => {
          setIsSidebarOpen(false);
          setActiveHoverCategory(null);
        }}
      >
        <div className="bg-[#45c4f0] text-white px-6 py-5 flex items-center gap-3 font-black text-xl rounded-br-3xl shadow-sm">
          <Menu size={24} strokeWidth={2.5} /> All Categories
        </div>
        
        <ul className="py-2 h-[calc(100vh-80px)] overflow-y-auto custom-scrollbar">
          {categories.map((cat) => (
            <li 
              key={cat} 
              className="relative group/item"
              onMouseEnter={() => setActiveHoverCategory(cat)}
              onMouseLeave={() => setActiveHoverCategory(null)}
            >
              <Link 
                to={`/?category=${encodeURIComponent(cat)}`}
                onClick={() => setIsSidebarOpen(false)}
                className={`w-full flex items-center justify-between px-6 py-3 text-[15px] font-bold transition-colors ${activeHoverCategory === cat ? 'text-[#45c4f0]' : 'text-slate-700'}`}
              >
                {cat}
                <ChevronRight size={16} className={`transition-opacity ${activeHoverCategory === cat ? 'opacity-100 text-[#45c4f0]' : 'opacity-0'}`} />
              </Link>

              {activeHoverCategory === cat && (
                <div className="absolute top-0 left-[295px] w-[220px] bg-white shadow-2xl border border-slate-100 rounded-xl py-2 z-[100]">
                  {subCategories.map(sub => (
                    <Link 
                      key={sub} 
                      to={`/?search=${encodeURIComponent(sub)}`}
                      className="block px-6 py-2.5 text-[15px] font-bold text-slate-600 hover:text-[#45c4f0] hover:bg-slate-50 transition-colors"
                    >
                      {sub}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <header className="w-full bg-white shadow-sm flex flex-col font-nunito relative z-30">
        
        {/* Top Tier */}
        <div className="max-w-[1500px] w-full mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="h-10 w-10 bg-[#45c4f0] rounded flex items-center justify-center">
              <span className="text-white font-black text-2xl">K</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-[#45c4f0] leading-none tracking-tight">Ktronics</span>
              <span className="text-[10px] text-slate-400 font-bold tracking-widest">EXPLORE • LEARN • BUILD</span>
            </div>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-2xl w-full relative">
            <input 
              type="text" 
              placeholder="Search for products" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full border-2 border-slate-100 bg-white rounded-full py-2.5 pl-6 pr-14 outline-none focus:border-[#45c4f0] transition-all text-[15px] font-bold text-slate-700"
            />
            <button type="submit" className="absolute right-1.5 top-1.5 bg-[#45c4f0] hover:bg-[#3ab0d9] text-white p-2 rounded-full transition-colors">
              <Search size={18} />
            </button>
          </form>

          <div className="hidden lg:flex items-center gap-8 shrink-0">
            <div className="flex items-center gap-3">
              <HeadphonesIcon size={28} className="text-slate-700 stroke-1" />
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-slate-700">Customer Support</span>
                <span className="text-[15px] font-black text-[#2a64f6]">+92 (42) 321-4567</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Globe size={28} className="text-slate-700 stroke-1" />
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-slate-700">Worldwide</span>
                <span className="text-[15px] font-black text-[#2a64f6]">Shipping Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Tier */}
        <div className="bg-[#f8fafc] border-t border-[#e2e8f0]">
          <div className="max-w-[1500px] mx-auto px-6 flex items-center justify-between h-[64px] overflow-visible no-scrollbar">
            
            <div className="flex items-center h-full w-full">
              <div 
                className="h-full flex items-center cursor-pointer group mr-8 shrink-0"
                onMouseEnter={() => setIsSidebarOpen(true)}
                onClick={() => setIsSidebarOpen(true)}
              >
                <div className="flex items-center bg-white rounded-full pr-5 pl-1 py-1 shadow-sm border border-slate-200 group-hover:shadow-md transition-all">
                  <div className="bg-[#2a64f6] text-white p-2 rounded-full flex items-center justify-center">
                    <Menu size={20} strokeWidth={2.5} />
                  </div>
                  <span className="font-bold text-slate-800 text-[15px] ml-3">All Categories</span>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="flex items-center justify-center gap-2 flex-1">
                <Link to="/" className="px-5 py-2 rounded-full text-[15px] font-bold text-slate-700 hover:bg-[#e0f7fa] hover:text-[#00acc1] transition-all whitespace-nowrap">Home</Link>
                <Link to="/?category=Microcontrollers" className="px-5 py-2 rounded-full text-[15px] font-bold text-slate-700 hover:bg-[#e0f7fa] hover:text-[#00acc1] transition-all whitespace-nowrap">Microcontrollers</Link>
                
                {/* NEW: Projects Dropdown Menu */}
                <div className="relative group/projects h-full flex items-center">
                  <Link to="/?category=Projects" className="px-5 py-2 rounded-full text-[15px] font-bold text-slate-700 hover:bg-[#e0f7fa] hover:text-[#00acc1] transition-all whitespace-nowrap flex items-center gap-1">
                    Projects <ChevronRight size={14} className="rotate-90" />
                  </Link>
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white shadow-xl border border-slate-100 rounded-xl py-2 opacity-0 invisible group-hover/projects:opacity-100 group-hover/projects:visible transition-all duration-200 z-50">
                    <Link to="/?search=Arduino Project" className="block px-6 py-2.5 text-[14px] font-bold text-slate-600 hover:text-[#45c4f0] hover:bg-slate-50 transition-colors">Arduino Projects</Link>
                    <Link to="/?search=IoT" className="block px-6 py-2.5 text-[14px] font-bold text-slate-600 hover:text-[#45c4f0] hover:bg-slate-50 transition-colors">IoT Automations</Link>
                    <Link to="/?search=Robotics" className="block px-6 py-2.5 text-[14px] font-bold text-slate-600 hover:text-[#45c4f0] hover:bg-slate-50 transition-colors">Robotics Builds</Link>
                    <Link to="/?search=Drone" className="block px-6 py-2.5 text-[14px] font-bold text-slate-600 hover:text-[#45c4f0] hover:bg-slate-50 transition-colors">Drone Kits</Link>
                  </div>
                </div>

                <Link to="/?view=new" className="px-5 py-2 rounded-full text-[15px] font-bold text-slate-700 hover:bg-[#e0f7fa] hover:text-[#00acc1] transition-all whitespace-nowrap flex items-center gap-1">
                  Newly Added <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm animate-pulse">NEW</span>
                </Link>
                <Link to="/blog" className="px-5 py-2 rounded-full text-[15px] font-bold text-slate-700 hover:bg-[#e0f7fa] hover:text-[#00acc1] transition-all whitespace-nowrap">Blog</Link>
                <Link to="/contact" className="px-5 py-2 rounded-full text-[15px] font-bold text-slate-700 hover:bg-[#e0f7fa] hover:text-[#00acc1] transition-all whitespace-nowrap">Contact Us</Link>
              </nav>

              {userRole === 'admin' && (
                <div className="flex items-center gap-2 ml-4 pl-4 border-l border-slate-300 shrink-0">
                  <Link to="/admin" className="px-4 py-2 rounded-full text-[14px] font-bold text-blue-600 hover:bg-white transition-all">Admin</Link>
                  <button onClick={handleLogout} className="px-4 py-2 rounded-full text-[14px] font-bold text-rose-500 hover:bg-white transition-all">Logout</button>
                </div>
              )}
            </div>

            {/* Icons */}
            <div className="flex items-center gap-4 shrink-0 hidden xl:flex ml-6 pl-6 border-l border-slate-200">
              <button className="w-10 h-10 bg-white rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:text-[#45c4f0] transition-colors"><User size={18}/></button>
              <button className="w-10 h-10 bg-white rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:text-[#45c4f0] transition-colors relative">
                <Shuffle size={18}/>
                <span className="absolute -top-1 -right-1 bg-slate-100 text-slate-600 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
              </button>
              <button className="w-10 h-10 bg-white rounded-full border border-slate-200 flex items-center justify-center text-rose-500 hover:text-white hover:bg-rose-500 transition-colors relative shadow-sm">
                <Heart size={18}/>
                <span className="absolute -top-1 -right-1 bg-rose-100 text-rose-600 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
              </button>
              
              <button className="h-10 px-4 bg-white rounded-full flex items-center gap-2 text-slate-700 hover:bg-[#e0f7fa] transition-colors border border-slate-200">
                <div className="bg-[#45c4f0] text-white p-1.5 rounded-full relative">
                  <ShoppingCart size={14}/>
                </div>
                <span className="text-[15px] font-black">₹0.00</span>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}