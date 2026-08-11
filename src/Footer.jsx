import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Footer() {
  // Dynamic Site Settings State
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'Ktronics',
    phone: '+92 311 1486790',
    email: 'support@ktronics.tech',
    address: 'Tech Hub, Building 4, Innovation Dist.',
    facebook: '#',
    instagram: '#',
    twitter: '#',
    pinterest: '#',
    linkedin: '#',
    youtube: '#',
    tiktok: '#'
  });

  useEffect(() => {
    // 1. Load settings on initial render
    const storedSettings = JSON.parse(localStorage.getItem('ktronic_settings'));
    if (storedSettings) setSiteSettings(prev => ({ ...prev, ...storedSettings }));
    
    // 2. Listen for live updates when the Admin saves new settings
    const handleSettingsUpdate = () => {
      const updated = JSON.parse(localStorage.getItem('ktronic_settings'));
      if(updated) setSiteSettings(prev => ({ ...prev, ...updated }));
    };

    window.addEventListener('settingsUpdated', handleSettingsUpdate);
    
    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate);
    };
  }, []);

  return (
    <footer className="bg-white border-t border-slate-200 font-nunito pt-16 pb-8 mt-10 relative z-30">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* 1. Brand & About Section */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-2 w-max">
              <div className="h-10 w-10 bg-[#45c4f0] rounded flex items-center justify-center shadow-sm">
                <span className="text-white font-black text-2xl">{siteSettings.siteName.charAt(0)}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-[#45c4f0] leading-none tracking-tight">{siteSettings.siteName}</span>
                <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Explore • Learn • Build</span>
              </div>
            </Link>
            <p className="text-[15px] font-bold text-slate-500 leading-relaxed">
              Your ultimate catalog for premium electronic components, microcontrollers, robotics, and DIY tech kits. Build the future with {siteSettings.siteName}.
            </p>
            
            {/* Subscribe & Social Section */}
            <div className="flex flex-col gap-5 mt-2">
              <h3 className="text-[18px] font-black text-slate-900 mb-1 tracking-tight">Connect With Us</h3>
              
              <div className="flex flex-wrap items-center gap-3">
                {/* Facebook */}
                {siteSettings.facebook && (
                  <a href={siteSettings.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center text-[#3b5998] hover:opacity-80 hover:-translate-y-1 transition-all">
                    <svg fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 22.954 24 17.99 24 12c0-6.627-5.373-12-12-12z"/></svg>
                  </a>
                )}
                {/* Instagram */}
                {siteSettings.instagram && (
                  <a href={siteSettings.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center text-[#e1306c] hover:opacity-80 hover:-translate-y-1 transition-all">
                    <svg fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                )}
                
            
                
                {/* LinkedIn */}
                {siteSettings.linkedin && (
                  <a href={siteSettings.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center text-[#007bb5] hover:opacity-80 hover:-translate-y-1 transition-all">
                     <svg fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8"><path d="M12 0C5.373 0 0 5.373 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12C24 5.373 18.627 0 12 0zm-3.69 17.58H5.43V9.083h2.88v8.497zM6.87 7.922c-.92 0-1.666-.745-1.666-1.666s.746-1.666 1.666-1.666c.92 0 1.665.745 1.665 1.666s-.745 1.666-1.665 1.666zm11.7 9.658h-2.88v-4.14c0-.988-.02-2.259-1.375-2.259-1.377 0-1.587 1.077-1.587 2.188v4.21h-2.88V9.083h2.766v1.16h.04c.385-.729 1.326-1.5 2.73-1.5 2.922 0 3.465 1.922 3.465 4.423v4.414z"/></svg>
                  </a>
                )}

                {/* YouTube */}
                {siteSettings.youtube && (
                  <a href={siteSettings.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center text-[#ff0000] hover:opacity-80 hover:-translate-y-1 transition-all">
                     <svg fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                )}

                {/* TikTok */}
                {siteSettings.tiktok && (
                  <a href={siteSettings.tiktok} target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center text-white bg-black rounded-full hover:opacity-80 hover:-translate-y-1 transition-all p-2">
                     <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v6.62c-.01 2.21-.93 4.38-2.52 5.86-1.49 1.4-3.52 2.2-5.59 2.2-3.14-.01-6.1-1.89-7.51-4.72-1.02-2.07-1.15-4.52-.36-6.66 1.05-2.85 3.56-4.99 6.54-5.46v4.06c-1.39.29-2.65 1.13-3.41 2.32-.7 1.1-.9 2.51-.55 3.76.43 1.55 1.75 2.8 3.32 3.1 1.76.34 3.65-.28 4.77-1.63.85-.99 1.25-2.3 1.25-3.61V.02z"/></svg>
                  </a>
                )}

              </div>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h3 className="text-[18px] font-black text-slate-900 mb-6">Quick Links</h3>
            <ul className="space-y-3.5">
              <li><Link to="/" className="text-[15px] font-bold text-slate-500 hover:text-[#45c4f0] transition-colors flex items-center gap-2 group"><ChevronRight size={14} className="text-slate-300 group-hover:text-[#45c4f0] transition-colors" /> Home</Link></li>
              <li><Link to="/?view=new" className="text-[15px] font-bold text-slate-500 hover:text-[#45c4f0] transition-colors flex items-center gap-2 group"><ChevronRight size={14} className="text-slate-300 group-hover:text-[#45c4f0] transition-colors" /> Newly Added</Link></li>
              <li><Link to="/blog" className="text-[15px] font-bold text-slate-500 hover:text-[#45c4f0] transition-colors flex items-center gap-2 group"><ChevronRight size={14} className="text-slate-300 group-hover:text-[#45c4f0] transition-colors" /> Tech Blog</Link></li>
              <li><Link to="/contact" className="text-[15px] font-bold text-slate-500 hover:text-[#45c4f0] transition-colors flex items-center gap-2 group"><ChevronRight size={14} className="text-slate-300 group-hover:text-[#45c4f0] transition-colors" /> Contact Support</Link></li>
            </ul>
          </div>

          {/* 3. Top Categories */}
          <div>
            <h3 className="text-[18px] font-black text-slate-900 mb-6">Top Categories</h3>
            <ul className="space-y-3.5">
              <li><Link to="/?category=Microcontrollers" className="text-[15px] font-bold text-slate-500 hover:text-[#45c4f0] transition-colors flex items-center gap-2 group"><ChevronRight size={14} className="text-slate-300 group-hover:text-[#45c4f0] transition-colors" /> Microcontrollers</Link></li>
              <li><Link to="/?category=Robotics" className="text-[15px] font-bold text-slate-500 hover:text-[#45c4f0] transition-colors flex items-center gap-2 group"><ChevronRight size={14} className="text-slate-300 group-hover:text-[#45c4f0] transition-colors" /> Robotics &amp; Kits</Link></li>
              <li><Link to="/?category=Sensors" className="text-[15px] font-bold text-slate-500 hover:text-[#45c4f0] transition-colors flex items-center gap-2 group"><ChevronRight size={14} className="text-slate-300 group-hover:text-[#45c4f0] transition-colors" /> Sensors &amp; Modules</Link></li>
              <li><Link to="/?category=IoT" className="text-[15px] font-bold text-slate-500 hover:text-[#45c4f0] transition-colors flex items-center gap-2 group"><ChevronRight size={14} className="text-slate-300 group-hover:text-[#45c4f0] transition-colors" /> IoT &amp; Wireless</Link></li>
              <li><Link to="/?category=Tools" className="text-[15px] font-bold text-slate-500 hover:text-[#45c4f0] transition-colors flex items-center gap-2 group"><ChevronRight size={14} className="text-slate-300 group-hover:text-[#45c4f0] transition-colors" /> Soldering &amp; Tools</Link></li>
            </ul>
          </div>

          {/* 4. Contact Information */}
          <div>
            <h3 className="text-[18px] font-black text-slate-900 mb-6">Get in Touch</h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-3 text-[15px] font-bold text-slate-500">
                <div className="bg-[#eef6ff] p-2 rounded-full shrink-0 mt-0.5">
                  <MapPin size={16} className="text-[#45c4f0]" />
                </div>
                <span>{siteSettings.address || 'Tech Hub, Building 4, Innovation Dist.'}</span>
              </li>
              <li className="flex items-center gap-3 text-[15px] font-bold text-slate-500">
                <div className="bg-[#eef6ff] p-2 rounded-full shrink-0">
                  <Phone size={16} className="text-[#45c4f0]" />
                </div>
                <span><a href={`tel:${siteSettings.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-[#45c4f0] transition-colors">{siteSettings.phone}</a></span>
              </li>
              <li className="flex items-center gap-3 text-[15px] font-bold text-slate-500">
                <div className="bg-[#eef6ff] p-2 rounded-full shrink-0">
                  <Mail size={16} className="text-[#45c4f0]" />
                </div>
                <span><a href={`mailto:${siteSettings.email}`} className="hover:text-[#45c4f0] transition-colors">{siteSettings.email}</a></span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-200 gap-4">
          <p className="text-[14px] font-bold text-slate-400">
            &copy; {new Date().getFullYear()} {siteSettings.siteName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="#" className="text-[13px] font-bold text-slate-400 hover:text-[#45c4f0] transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-[13px] font-bold text-slate-400 hover:text-[#45c4f0] transition-colors">Terms of Service</Link>
            <Link to="#" className="text-[13px] font-bold text-slate-400 hover:text-[#45c4f0] transition-colors">Shipping Info</Link>
          </div>
        </div>
        
      </div>
    </footer>
  );
}