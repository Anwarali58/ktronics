import { useState, useEffect } from 'react';
import { Trash2, Plus, Save, FileText, Box, Pencil, X, Filter, FolderKanban, Upload, Image as ImageIcon, Settings, Lock, LogOut } from 'lucide-react';

export default function Admin() {
  // --- ADMIN AUTHENTICATION ---
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(localStorage.getItem('ktronic_admin_auth') === 'true');
  const [loginPass, setLoginPass] = useState('');

  // --- DASHBOARD STATES ---
  const [activeTab, setActiveTab] = useState('products');
  
  const [products, setProducts] = useState([]);
  const [categoryDetails, setCategoryDetails] = useState([]);
  const [blogs, setBlogs] = useState([]);
  
  // Settings State - Expanded to include all social links
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'Ktronics',
    phone: '+92 311 1486790',
    email: 'support@ktronics.tech',
    address: 'Tech Hub, Building 4, Innovation Dist.',
    facebook: '',
    instagram: '',
    twitter: '',
    pinterest: '',
    linkedin: '',
    youtube: '',
    tiktok: ''
  });

  // Form States
  const [productForm, setProductForm] = useState({ name: '', category: '', price: '', description: '', image: '', productUrl: '' });
  const [categoryForm, setCategoryForm] = useState({ name: '', image: '' });
  const [blogForm, setBlogForm] = useState({ title: '', category: '', date: '', snippet: '', image: '' });
  
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingBlogId, setEditingBlogId] = useState(null);
  
  const [productFilter, setProductFilter] = useState('All');

  useEffect(() => {
    // Load Database
    const dbProducts = JSON.parse(localStorage.getItem('ktronic_products')) || [];
    let dbCategoryDetails = JSON.parse(localStorage.getItem('ktronic_category_details')) || [];
    const dbBlogs = JSON.parse(localStorage.getItem('ktronic_blogs')) || [];
    const dbSettings = JSON.parse(localStorage.getItem('ktronic_settings'));

    // Fix to ensure seeded categories show up if Admin tries to load before Catalog
    if (dbCategoryDetails.length === 0) {
      const oldCategories = JSON.parse(localStorage.getItem('ktronic_categories')) || ['Microcontrollers', 'Sensors', 'Robotics', 'Projects', 'IoT'];
      dbCategoryDetails = oldCategories.map(c => ({ name: c, image: '' }));
      localStorage.setItem('ktronic_category_details', JSON.stringify(dbCategoryDetails));
    }

    setProducts(dbProducts);
    setCategoryDetails(dbCategoryDetails);
    setBlogs(dbBlogs);
    if (dbSettings) setSiteSettings(prev => ({...prev, ...dbSettings}));
  }, []);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (loginPass === 'admin123') {
      localStorage.setItem('ktronic_admin_auth', 'true');
      setIsAdminLoggedIn(true);
    } else {
      alert('Incorrect master password!');
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('ktronic_admin_auth');
    setIsAdminLoggedIn(false);
    setLoginPass('');
  };

  const safeStorageSave = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      window.dispatchEvent(new Event('storage'));
      return true;
    } catch (e) {
      alert("⚠️ Storage Limit Exceeded! The image file you uploaded is too large. Please use an image under 500kb or paste an Image URL instead.");
      return false;
    }
  };

  const handleImageUpload = (e, formType) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2000000) {
         alert("Warning: This image is over 2MB. It may not save correctly. We recommend using images under 500kb or using a URL.");
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (formType === 'product') setProductForm({ ...productForm, image: reader.result });
        if (formType === 'category') setCategoryForm({ ...categoryForm, image: reader.result });
        if (formType === 'blog') setBlogForm({ ...blogForm, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // --- PRODUCT MANAGEMENT ---
  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (!productForm.image || productForm.image.trim() === '') return alert("⚠️ Product Image is compulsory!");

    let updatedProducts;
    if (editingProductId) {
      updatedProducts = products.map(p => p.id === editingProductId ? { ...productForm, id: editingProductId } : p);
    } else {
      updatedProducts = [{ ...productForm, id: Date.now() }, ...products];
    }
    
    if (safeStorageSave('ktronic_products', updatedProducts)) {
      setProducts(updatedProducts);
      setProductForm({ name: '', category: '', price: '', description: '', image: '', productUrl: '' });
      setEditingProductId(null);
      alert(editingProductId ? 'Product updated successfully!' : 'Product added successfully!');
    }
  };

  const handleEditProduct = (product) => {
    setProductForm({ ...product, description: product.description || '', productUrl: product.productUrl || '' });
    setEditingProductId(product.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = (id) => {
    if(window.confirm("Are you sure you want to permanently delete this product?")) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      safeStorageSave('ktronic_products', updated);
    }
  };

  // --- CATEGORY MANAGEMENT ---
  const handleCategorySubmit = (e) => {
    e.preventDefault();
    if (!categoryForm.image || categoryForm.image.trim() === '') return alert("⚠️ Category Cover Image is compulsory!");

    let updatedDetails;
    if (editingCategoryId) {
      if (editingCategoryId !== categoryForm.name) {
        const updatedProducts = products.map(p => p.category === editingCategoryId ? { ...p, category: categoryForm.name } : p);
        setProducts(updatedProducts);
        safeStorageSave('ktronic_products', updatedProducts);
      }
      updatedDetails = categoryDetails.map(c => c.name === editingCategoryId ? { name: categoryForm.name, image: categoryForm.image } : c);
    } else {
      if (categoryDetails.some(c => c.name.toLowerCase() === categoryForm.name.toLowerCase())) return alert("Category already exists!");
      updatedDetails = [...categoryDetails, { name: categoryForm.name, image: categoryForm.image }];
    }

    if (safeStorageSave('ktronic_category_details', updatedDetails)) {
      safeStorageSave('ktronic_categories', updatedDetails.map(c => c.name));
      setCategoryDetails(updatedDetails);
      setCategoryForm({ name: '', image: '' });
      setEditingCategoryId(null);
      alert('Category saved successfully!');
    }
  };

  const handleEditCategory = (cat) => {
    setCategoryForm({ name: cat.name, image: cat.image || '' });
    setEditingCategoryId(cat.name);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteCategory = (name) => {
    if(window.confirm(`Delete "${name}"? Products in this category will NOT be deleted, but they will lose their grouping.`)) {
      const updated = categoryDetails.filter(c => c.name !== name);
      setCategoryDetails(updated);
      safeStorageSave('ktronic_category_details', updated);
      safeStorageSave('ktronic_categories', updated.map(c => c.name));
    }
  };

  // --- BLOG MANAGEMENT ---
  const handleBlogSubmit = (e) => {
    e.preventDefault();
    if (!blogForm.image || blogForm.image.trim() === '') return alert("⚠️ Blog Cover Image is compulsory!");
    
    let updatedBlogs;
    if (editingBlogId) {
      updatedBlogs = blogs.map(b => b.id === editingBlogId ? { ...blogForm, id: editingBlogId, date: b.date } : b);
    } else {
      updatedBlogs = [{ ...blogForm, id: Date.now(), date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }, ...blogs];
    }

    if (safeStorageSave('ktronic_blogs', updatedBlogs)) {
      setBlogs(updatedBlogs);
      setBlogForm({ title: '', category: '', snippet: '', image: '' });
      setEditingBlogId(null);
      alert(editingBlogId ? 'Blog updated successfully!' : 'Blog published successfully!');
    }
  };

  const handleEditBlog = (blog) => {
    setBlogForm({ title: blog.title, category: blog.category, snippet: blog.snippet, image: blog.image });
    setEditingBlogId(blog.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteBlog = (id) => {
    if(window.confirm("Are you sure you want to delete this blog?")) {
      const updated = blogs.filter(b => b.id !== id);
      setBlogs(updated);
      safeStorageSave('ktronic_blogs', updated);
    }
  };

  // --- SITE SETTINGS MANAGEMENT ---
  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    safeStorageSave('ktronic_settings', siteSettings);
    window.dispatchEvent(new Event('settingsUpdated')); 
    alert("Global Site Settings updated successfully!");
  };

  // --- LOGIN SCREEN RENDER ---
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-nunito p-4">
        <div className="bg-white p-8 md:p-12 rounded-[32px] shadow-lg w-full max-w-md border border-slate-100 text-center animate-fade-in-up">
          <div className="h-20 w-20 bg-[#2a64f6]/10 text-[#2a64f6] rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Lock size={36} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Admin Portal</h1>
          <p className="text-slate-500 font-bold mb-8 text-[15px]">Enter the master password to manage your platform.</p>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <input 
              type="password" 
              required 
              placeholder="Master Password" 
              value={loginPass} 
              onChange={e => setLoginPass(e.target.value)} 
              className="w-full border-2 border-slate-100 bg-slate-50/50 p-4 rounded-xl outline-none focus:border-[#2a64f6] focus:bg-white focus:ring-4 focus:ring-[#2a64f6]/10 transition-all font-bold text-center tracking-widest text-slate-800" 
            />
            <button type="submit" className="w-full bg-[#2a64f6] text-white font-black py-4 rounded-xl shadow-[0_4px_14px_rgba(42,100,246,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(42,100,246,0.4)] transition-all text-lg">
              Unlock Dashboard
            </button>
          </form>
          <p className="text-xs font-bold text-slate-400 mt-6 uppercase tracking-widest">Secure Connection</p>
        </div>
      </div>
    );
  }

  // --- DASHBOARD RENDER ---
  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 mt-8 font-nunito animate-fade-in-up pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-500 font-bold mt-1">Manage platform inventory, settings, and content.</p>
        </div>
        <div className="flex items-center gap-3 overflow-x-auto pb-2 sm:pb-0">
          <button onClick={() => setActiveTab('products')} className={`flex items-center gap-2 px-5 py-2.5 font-bold rounded-full transition-all shrink-0 ${activeTab === 'products' ? 'bg-[#2a64f6] text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}><Box size={18}/> Products</button>
          <button onClick={() => setActiveTab('categories')} className={`flex items-center gap-2 px-5 py-2.5 font-bold rounded-full transition-all shrink-0 ${activeTab === 'categories' ? 'bg-[#2a64f6] text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}><FolderKanban size={18}/> Categories</button>
          <button onClick={() => setActiveTab('blogs')} className={`flex items-center gap-2 px-5 py-2.5 font-bold rounded-full transition-all shrink-0 ${activeTab === 'blogs' ? 'bg-[#2a64f6] text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}><FileText size={18}/> Blogs</button>
          <button onClick={() => setActiveTab('settings')} className={`flex items-center gap-2 px-5 py-2.5 font-bold rounded-full transition-all shrink-0 ${activeTab === 'settings' ? 'bg-[#2a64f6] text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}><Settings size={18}/> Settings</button>
          
          <div className="w-px h-8 bg-slate-200 mx-1 shrink-0"></div>
          <button onClick={handleAdminLogout} className="flex items-center gap-2 px-5 py-2.5 font-bold rounded-full transition-all shrink-0 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white"><LogOut size={18}/> Lock</button>
        </div>
      </div>

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm h-max sticky top-24">
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-2xl font-black text-slate-800">{editingProductId ? 'Edit Product' : 'Add New Product'}</h2>
              {editingProductId && <button onClick={() => { setProductForm({ name: '', category: '', price: '', description: '', image: '', productUrl: '' }); setEditingProductId(null); }} className="text-rose-500 text-sm font-bold flex items-center gap-1 hover:bg-rose-50 px-3 py-1.5 rounded-full"><X size={16} /> Cancel</button>}
            </div>
            <form onSubmit={handleProductSubmit} className="space-y-5">
              <input type="text" required placeholder="Product Name" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full border border-slate-200 bg-slate-50 p-3.5 rounded-xl outline-none focus:border-[#45c4f0] font-semibold" />
              <div className="flex gap-4">
                <input type="text" required placeholder="Price (e.g. Rs. 150.00)" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} className="w-1/2 border border-slate-200 bg-slate-50 p-3.5 rounded-xl outline-none focus:border-[#45c4f0] font-semibold" />
                <select required value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} className="w-1/2 border border-slate-200 bg-slate-50 p-3.5 rounded-xl outline-none focus:border-[#45c4f0] font-semibold text-slate-800">
                  <option value="">Select Category...</option>
                  {categoryDetails.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <input type="url" value={productForm.productUrl} onChange={e => setProductForm({...productForm, productUrl: e.target.value})} placeholder="External Link (For Buy Now Button)" className="w-full border border-slate-200 bg-slate-50 p-3.5 rounded-xl outline-none focus:border-[#45c4f0] font-semibold" />
              
              <textarea required placeholder="Detailed Product Description..." rows="4" value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="w-full border border-slate-200 bg-slate-50 p-3.5 rounded-xl outline-none focus:border-[#45c4f0] font-semibold custom-scrollbar"></textarea>
              
              <div className="border border-slate-200 p-4 rounded-xl bg-slate-50">
                <label className="block text-sm font-black text-slate-800 mb-3">Product Image <span className="text-rose-500">*</span></label>
                <div className="space-y-3">
                  <input type="text" placeholder="Paste Image URL..." value={productForm.image} onChange={e => setProductForm({...productForm, image: e.target.value})} className="w-full border border-slate-200 p-3 rounded-lg outline-none focus:border-[#45c4f0] font-semibold text-sm" />
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-slate-400 uppercase">OR</span>
                    <label className="cursor-pointer bg-white border border-slate-200 px-4 py-2.5 rounded-lg text-sm font-bold text-slate-600 hover:bg-[#eef6ff] flex items-center gap-2 transition-all shadow-sm">
                      <Upload size={16}/> Upload Image
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'product')} />
                    </label>
                  </div>
                </div>
                {productForm.image && <div className="mt-4 w-28 h-28 rounded-lg border bg-white p-2 flex items-center justify-center overflow-hidden"><img src={productForm.image} alt="Preview" className="max-w-full max-h-full object-contain" /></div>}
              </div>
              <button type="submit" className={`w-full text-white py-4 rounded-xl font-black shadow-md flex justify-center gap-2 transition-transform hover:-translate-y-0.5 ${editingProductId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-[#2a64f6] hover:bg-blue-700'}`}>
                <Save size={20}/> {editingProductId ? 'Update Product' : 'Publish Product'}
              </button>
            </form>
          </div>
          <div className="flex-[1.5] bg-[#f8fafc] p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[850px]">
            <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
              <h2 className="text-xl font-black">Inventory ({products.filter(p => productFilter === 'All' || p.category === productFilter).length})</h2>
              <select value={productFilter} onChange={(e) => setProductFilter(e.target.value)} className="px-4 py-2 border rounded-full font-bold outline-none cursor-pointer bg-white shadow-sm">
                <option value="All">All Categories</option>
                {categoryDetails.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-2">
              {products.filter(p => productFilter === 'All' || p.category === productFilter).map(p => (
                <div key={p.id} className="flex gap-4 p-3 bg-white border border-slate-100 rounded-xl items-center shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 bg-white rounded-lg shrink-0 border flex items-center justify-center p-1 overflow-hidden">
                    {p.image ? <img src={p.image} className="max-w-full max-h-full object-contain mix-blend-multiply" alt=""/> : <ImageIcon className="text-slate-300"/>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[15px] truncate">{p.name}</h4>
                    <span className="text-[11px] font-black text-[#2a64f6] bg-[#eef6ff] px-2.5 py-0.5 rounded-full mr-2 uppercase tracking-wide">{p.category}</span>
                    <span className="text-[13px] font-black text-slate-600">{p.price}</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleEditProduct(p)} className="text-[#2a64f6] p-2 hover:bg-[#eef6ff] rounded-lg transition-colors"><Pencil size={18}/></button>
                    <button onClick={() => handleDeleteProduct(p.id)} className="text-rose-500 p-2 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 size={18}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CATEGORIES TAB */}
      {activeTab === 'categories' && (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 bg-white p-6 sm:p-8 rounded-3xl border shadow-sm h-max sticky top-24">
            <div className="flex items-center justify-between mb-6 border-b pb-4">
               <h2 className="text-2xl font-black">{editingCategoryId ? 'Edit Category' : 'Add New Category'}</h2>
               {editingCategoryId && <button onClick={() => { setCategoryForm({ name: '', image: '' }); setEditingCategoryId(null); }} className="text-rose-500 text-sm font-bold flex items-center gap-1 hover:bg-rose-50 px-3 py-1.5 rounded-full"><X size={16} /> Cancel</button>}
            </div>
            <form onSubmit={handleCategorySubmit} className="space-y-5">
              <input type="text" required placeholder="Category Name" value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} className="w-full border bg-slate-50 p-3.5 rounded-xl outline-none focus:border-[#45c4f0] font-semibold" />
              <div className="border p-4 rounded-xl bg-slate-50">
                <label className="block text-sm font-black mb-3">Cover Image <span className="text-rose-500">*</span></label>
                <div className="space-y-3">
                  <input type="text" placeholder="Paste Image URL..." value={categoryForm.image} onChange={e => setCategoryForm({...categoryForm, image: e.target.value})} className="w-full border p-3 rounded-lg outline-none font-semibold text-sm focus:border-[#45c4f0]" />
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-slate-400 uppercase">OR</span>
                    <label className="cursor-pointer bg-white border px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#eef6ff] shadow-sm transition-colors">
                      <Upload size={16}/> Upload Image
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'category')} />
                    </label>
                  </div>
                </div>
                {categoryForm.image && <div className="mt-4 w-32 h-32 rounded-xl border bg-white p-2 overflow-hidden shadow-sm"><img src={categoryForm.image} alt="Preview" className="w-full h-full object-cover rounded-lg" /></div>}
              </div>
              <button type="submit" className={`w-full text-white py-4 rounded-xl font-black shadow-md flex justify-center gap-2 transition-transform hover:-translate-y-0.5 ${editingCategoryId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-[#2a64f6] hover:bg-blue-700'}`}>
                <Save size={20}/> {editingCategoryId ? 'Update Category' : 'Save Category'}
              </button>
            </form>
          </div>
          <div className="flex-[1.5] bg-[#f8fafc] p-4 sm:p-6 rounded-3xl border shadow-sm flex flex-col h-[850px]">
            <h2 className="text-xl font-black mb-6 border-b pb-4">Managed Categories ({categoryDetails.length})</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 overflow-y-auto custom-scrollbar pr-2 pb-4">
              {categoryDetails.map(cat => (
                <div key={cat.name} className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col items-center shadow-sm hover:shadow-md transition-shadow group relative">
                  <div className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden mb-3 border border-slate-100 p-2 flex items-center justify-center">
                    {cat.image ? <img src={cat.image} className="max-w-full max-h-full object-cover rounded" alt={cat.name} /> : <ImageIcon className="text-slate-300"/>}
                  </div>
                  <h4 className="font-black text-[15px] text-center mb-1 line-clamp-2">{cat.name}</h4>
                  <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 bg-white/90 backdrop-blur p-1 rounded-lg shadow-md border transition-opacity">
                    <button onClick={() => handleEditCategory(cat)} className="text-[#2a64f6] p-1.5 hover:bg-[#eef6ff] rounded-md"><Pencil size={14}/></button>
                    <button onClick={() => handleDeleteCategory(cat.name)} className="text-rose-500 p-1.5 hover:bg-rose-50 rounded-md"><Trash2 size={14}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BLOGS TAB */}
      {activeTab === 'blogs' && (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 bg-white p-6 sm:p-8 rounded-3xl border shadow-sm h-max sticky top-24">
            <div className="flex items-center justify-between mb-6 border-b pb-4">
               <h2 className="text-2xl font-black">{editingBlogId ? 'Edit Blog' : 'Write New Blog'}</h2>
               {editingBlogId && <button onClick={() => { setBlogForm({ title: '', category: '', snippet: '', image: '' }); setEditingBlogId(null); }} className="text-rose-500 text-sm font-bold flex items-center gap-1 hover:bg-rose-50 px-3 py-1.5 rounded-full"><X size={16} /> Cancel</button>}
            </div>
            <form onSubmit={handleBlogSubmit} className="space-y-5">
              <input type="text" required placeholder="Blog Title" value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} className="w-full border bg-slate-50 p-3.5 rounded-xl font-semibold outline-none focus:border-[#45c4f0]" />
              <input type="text" required placeholder="Category Tag (e.g. Tutorial)" value={blogForm.category} onChange={e => setBlogForm({...blogForm, category: e.target.value})} className="w-full border bg-slate-50 p-3.5 rounded-xl font-semibold outline-none focus:border-[#45c4f0]" />
              <textarea required rows="6" placeholder="Full Blog Content..." value={blogForm.snippet} onChange={e => setBlogForm({...blogForm, snippet: e.target.value})} className="w-full border bg-slate-50 p-3.5 rounded-xl font-semibold outline-none focus:border-[#45c4f0] custom-scrollbar"></textarea>
              <div className="border p-4 rounded-xl bg-slate-50">
                <label className="block text-sm font-black mb-3">Cover Image <span className="text-rose-500">*</span></label>
                <div className="space-y-3">
                  <input type="text" placeholder="Paste Image URL..." value={blogForm.image} onChange={e => setBlogForm({...blogForm, image: e.target.value})} className="w-full border p-3 rounded-lg outline-none focus:border-[#45c4f0] font-semibold text-sm" />
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-slate-400 uppercase">OR</span>
                    <label className="cursor-pointer bg-white border px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#eef6ff] shadow-sm transition-colors">
                      <Upload size={16}/> Upload Image
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'blog')} />
                    </label>
                  </div>
                </div>
                {blogForm.image && <div className="mt-4 w-full h-32 rounded-xl border bg-white p-2 overflow-hidden shadow-sm"><img src={blogForm.image} alt="Preview" className="w-full h-full object-cover rounded-lg" /></div>}
              </div>
              <button type="submit" className={`w-full text-white py-4 rounded-xl font-black shadow-md flex justify-center gap-2 transition-transform hover:-translate-y-0.5 ${editingBlogId ? 'bg-amber-500 hover:bg-amber-600' : 'bg-[#2a64f6] hover:bg-blue-700'}`}>
                <Save size={20}/> {editingBlogId ? 'Update Blog' : 'Publish Blog'}
              </button>
            </form>
          </div>
          <div className="flex-[1.5] bg-[#f8fafc] p-6 rounded-3xl border shadow-sm h-[850px] overflow-auto custom-scrollbar flex flex-col">
            <h2 className="text-xl font-black mb-6 border-b pb-4">Published Blogs ({blogs.length})</h2>
            <div className="space-y-4 pr-2 flex-1 overflow-y-auto custom-scrollbar pb-4">
              {blogs.map(b => (
                <div key={b.id} className="bg-white p-4 border rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex items-center gap-4 overflow-hidden">
                    <img src={b.image} className="w-20 h-20 rounded-xl object-cover shrink-0 border" alt=""/>
                    <div className="min-w-0">
                      <h4 className="font-black text-[16px] truncate text-slate-800">{b.title}</h4>
                      <span className="text-[12px] font-bold text-slate-500 mt-1 block">{b.date} • <span className="text-[#2a64f6]">{b.category}</span></span>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0 ml-4">
                    <button onClick={() => handleEditBlog(b)} className="text-[#2a64f6] p-2 hover:bg-[#eef6ff] rounded-lg transition-colors"><Pencil size={18}/></button>
                    <button onClick={() => handleDeleteBlog(b.id)} className="text-rose-500 p-2 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 size={18}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
               <h2 className="text-2xl font-black text-slate-800">Global Site Settings</h2>
            </div>
            <form onSubmit={handleSettingsSubmit} className="space-y-6">
              <div>
                 <label className="block text-sm font-black text-slate-800 mb-2">Platform Name</label>
                 <input required type="text" placeholder="e.g. Ktronics" value={siteSettings.siteName} onChange={e => setSiteSettings({...siteSettings, siteName: e.target.value})} className="w-full border border-slate-200 bg-slate-50 p-3.5 rounded-xl outline-none focus:border-[#45c4f0] font-bold text-slate-900" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-black text-slate-800 mb-2">Support Phone Number</label>
                    <input required type="text" placeholder="+92 311 1486790" value={siteSettings.phone} onChange={e => setSiteSettings({...siteSettings, phone: e.target.value})} className="w-full border border-slate-200 bg-slate-50 p-3.5 rounded-xl outline-none focus:border-[#45c4f0] font-bold text-slate-900" />
                 </div>
                 <div>
                    <label className="block text-sm font-black text-slate-800 mb-2">Support Email Address</label>
                    <input required type="email" placeholder="support@ktronics.tech" value={siteSettings.email} onChange={e => setSiteSettings({...siteSettings, email: e.target.value})} className="w-full border border-slate-200 bg-slate-50 p-3.5 rounded-xl outline-none focus:border-[#45c4f0] font-bold text-slate-900" />
                 </div>
              </div>

              <div>
                 <label className="block text-sm font-black text-slate-800 mb-2">Physical Address</label>
                 <input required type="text" placeholder="Tech Hub, Building 4..." value={siteSettings.address} onChange={e => setSiteSettings({...siteSettings, address: e.target.value})} className="w-full border border-slate-200 bg-slate-50 p-3.5 rounded-xl outline-none focus:border-[#45c4f0] font-bold text-slate-900" />
              </div>

              <div className="pt-4 border-t border-slate-100">
                 <h3 className="text-lg font-black text-slate-800 mb-4">Social Media Links</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                       <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Facebook URL</label>
                       <input type="url" placeholder="https://facebook.com/..." value={siteSettings.facebook} onChange={e => setSiteSettings({...siteSettings, facebook: e.target.value})} className="w-full border border-slate-200 bg-slate-50 p-3 rounded-lg outline-none focus:border-[#2a64f6] font-semibold text-sm" />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Instagram URL</label>
                       <input type="url" placeholder="https://instagram.com/..." value={siteSettings.instagram} onChange={e => setSiteSettings({...siteSettings, instagram: e.target.value})} className="w-full border border-slate-200 bg-slate-50 p-3 rounded-lg outline-none focus:border-[#e1306c] font-semibold text-sm" />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Twitter/X URL</label>
                       <input type="url" placeholder="https://twitter.com/..." value={siteSettings.twitter} onChange={e => setSiteSettings({...siteSettings, twitter: e.target.value})} className="w-full border border-slate-200 bg-slate-50 p-3 rounded-lg outline-none focus:border-slate-800 font-semibold text-sm" />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Pinterest URL</label>
                       <input type="url" placeholder="https://pinterest.com/..." value={siteSettings.pinterest} onChange={e => setSiteSettings({...siteSettings, pinterest: e.target.value})} className="w-full border border-slate-200 bg-slate-50 p-3 rounded-lg outline-none focus:border-[#cb2027] font-semibold text-sm" />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">LinkedIn URL</label>
                       <input type="url" placeholder="https://linkedin.com/..." value={siteSettings.linkedin} onChange={e => setSiteSettings({...siteSettings, linkedin: e.target.value})} className="w-full border border-slate-200 bg-slate-50 p-3 rounded-lg outline-none focus:border-[#007bb5] font-semibold text-sm" />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">YouTube URL</label>
                       <input type="url" placeholder="https://youtube.com/..." value={siteSettings.youtube} onChange={e => setSiteSettings({...siteSettings, youtube: e.target.value})} className="w-full border border-slate-200 bg-slate-50 p-3 rounded-lg outline-none focus:border-[#ff0000] font-semibold text-sm" />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">TikTok URL</label>
                       <input type="url" placeholder="https://tiktok.com/..." value={siteSettings.tiktok} onChange={e => setSiteSettings({...siteSettings, tiktok: e.target.value})} className="w-full border border-slate-200 bg-slate-50 p-3 rounded-lg outline-none focus:border-black font-semibold text-sm" />
                    </div>
                 </div>
              </div>

              <button type="submit" className="w-full bg-[#2a64f6] text-white py-4 rounded-xl font-black shadow-md flex justify-center gap-2 transition-transform hover:-translate-y-0.5 hover:bg-blue-700 mt-4">
                <Save size={20}/> Save Global Settings
              </button>
            </form>
          </div>
          
          {/* Information Panel */}
          <div className="flex-1 bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl border border-slate-700 shadow-lg text-white flex flex-col justify-center">
             <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                <Settings size={32} className="text-[#45c4f0]" />
             </div>
             <h3 className="text-2xl font-black mb-3">Live Platform Synchronization</h3>
             <p className="text-slate-300 font-bold leading-relaxed mb-6">
                Any changes made here will immediately update across the entire customer-facing platform. The Header, Footer, and Contact panels will instantly pull this new data, keeping your branding and contact information perfectly consistent.
             </p>
             <div className="bg-white/10 p-5 rounded-2xl border border-white/10">
                <p className="text-sm font-black tracking-widest uppercase text-[#45c4f0] mb-2">Current Active Status</p>
                <div className="space-y-1.5">
                   <p className="text-[13px] font-bold"><span className="text-slate-400">Name:</span> {siteSettings.siteName}</p>
                   <p className="text-[13px] font-bold"><span className="text-slate-400">Phone:</span> {siteSettings.phone}</p>
                   <p className="text-[13px] font-bold"><span className="text-slate-400">Email:</span> {siteSettings.email}</p>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}