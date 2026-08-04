import { useState, useEffect } from 'react';
import { ChevronLeft, Calendar, Tag, ArrowRight } from 'lucide-react';

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null); // Controls Detail View vs List View

  useEffect(() => {
    const dbBlogs = JSON.parse(localStorage.getItem('ktronic_blogs')) || [];
    
    // Fallback blogs if empty so the page always looks good
    if (dbBlogs.length === 0) {
      const dummyBlogs = [
        {
          id: 1,
          title: 'Top 5 Microcontrollers for IoT Projects in 2026',
          category: 'Hardware Guide',
          date: 'Aug 04, 2026',
          snippet: 'Choosing the right microcontroller is crucial for any IoT project. In this guide, we break down the performance, power consumption, and connectivity options of the ESP32, Raspberry Pi Pico W, and more. We will explore how dual-core processing handles heavy sensor data and why Wi-Fi/Bluetooth integration natively on the board saves both space and development time...',
          image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80'
        },
        {
          id: 2,
          title: 'How to Build Your First Custom Drone from Scratch',
          category: 'Tutorial',
          date: 'Jul 28, 2026',
          snippet: 'Building your own drone gives you total control over its speed, camera payload, and battery life. This step-by-step tutorial covers selecting the right carbon fiber frame, matching your brushless motors to your ESCs, and programming your flight controller. Whether you are aiming for a cinematic camera rig or a high-speed FPV racer, these fundamentals apply...',
          image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&q=80'
        },
        {
          id: 3,
          title: 'Understanding Capacitors: Filtering vs. Energy Storage',
          category: 'Electronics 101',
          date: 'Jul 15, 2026',
          snippet: 'Capacitors are everywhere, but they serve vastly different purposes depending on where they sit in a circuit. We take a deep dive into the difference between electrolytic bulk storage capacitors used in power supplies, and tiny ceramic capacitors used for high-frequency noise filtering near ICs. Learn how to read their values and choose the right type for your next PCB design...',
          image: 'https://images.unsplash.com/photo-1580983584897-40f413ee0c05?w=800&q=80'
        }
      ];
      setBlogs(dummyBlogs);
      localStorage.setItem('ktronic_blogs', JSON.stringify(dummyBlogs));
    } else {
      setBlogs(dbBlogs);
    }
  }, []);

  // --- DETAILED VIEW ---
  if (selectedBlog) {
    return (
      <div className="min-h-screen bg-white font-nunito pb-20 animate-fade-in-up">
        {/* Banner */}
        <div className="w-full h-[40vh] bg-slate-900 relative">
          <img src={selectedBlog.image} alt={selectedBlog.title} className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
        </div>
        
        {/* Content Container */}
        <div className="max-w-[800px] mx-auto px-6 -mt-32 relative z-10">
          <button onClick={() => setSelectedBlog(null)} className="flex items-center gap-2 text-white/80 hover:text-white font-bold mb-6 transition-colors bg-black/20 px-4 py-2 rounded-full w-max backdrop-blur-md">
            <ChevronLeft size={18} /> Back to Articles
          </button>

          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-12">
            <div className="flex items-center gap-4 mb-6 text-sm font-bold">
              <span className="bg-[#eef6ff] text-[#2a64f6] px-3 py-1 rounded-full flex items-center gap-1.5"><Tag size={14}/> {selectedBlog.category}</span>
              <span className="text-slate-400 flex items-center gap-1.5"><Calendar size={14}/> {selectedBlog.date}</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-8 leading-tight">
              {selectedBlog.title}
            </h1>
            
            <div className="prose max-w-none text-slate-600 font-medium text-[16px] leading-relaxed space-y-6 whitespace-pre-wrap">
              {selectedBlog.snippet}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- GRID LIST VIEW ---
  return (
    <div className="min-h-screen bg-[#f8fafc] font-nunito pb-20">
      
      <div className="bg-white border-b border-slate-200 py-16 mb-10">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight">Tech & Build Guides</h1>
          <p className="text-slate-500 font-bold text-lg max-w-2xl mx-auto">Explore tutorials, component breakdowns, and hardware news to power up your next project.</p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map(blog => (
            <div key={blog.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer" onClick={() => setSelectedBlog(blog)}>
              
              <div className="relative h-[240px] overflow-hidden">
                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[12px] font-black text-[#2a64f6] uppercase tracking-widest shadow-sm">
                  {blog.category}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-slate-400 font-bold text-[13px] mb-2 flex items-center gap-1.5"><Calendar size={14}/> {blog.date}</p>
                <h3 className="text-xl font-black text-slate-900 mb-3 line-clamp-2 group-hover:text-[#45c4f0] transition-colors">
                  {blog.title}
                </h3>
                <p className="text-slate-500 text-[15px] line-clamp-3 mb-6 font-medium">
                  {blog.snippet}
                </p>
                
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center text-[#2a64f6] font-black text-[14px] group-hover:gap-2 transition-all">
                  Read Article <ArrowRight size={16} className="ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {blogs.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-black text-slate-800 mb-2">No blogs published yet!</h2>
            <p className="text-slate-500 font-bold">Check back soon for new guides and articles.</p>
          </div>
        )}
      </div>
    </div>
  );
}