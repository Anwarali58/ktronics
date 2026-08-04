import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ChevronRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 font-nunito pt-16 pb-8 mt-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* 1. Brand & About Section */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-2 w-max">
              <div className="h-10 w-10 bg-[#45c4f0] rounded flex items-center justify-center shadow-sm">
                <span className="text-white font-black text-2xl">K</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-[#45c4f0] leading-none tracking-tight">Ktronics</span>
                <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Explore • Learn • Build</span>
              </div>
            </Link>
            <p className="text-[15px] font-bold text-slate-500 leading-relaxed">
              Your ultimate catalog for premium electronic components, microcontrollers, robotics, and DIY tech kits. Build the future with Ktronics.
            </p>
            
            {/* 1. Subscribe & Social Section */}
          <div className="flex flex-col gap-5">
            <h3 className="text-[22px] font-semibold text-[#1e293b] mb-1 tracking-tight">Subscribe us</h3>
            
            {/* Exact Replica of Social Icons from the Screenshot */}
            <div className="flex items-center gap-2.5">
              
              {/* Facebook */}
              <a href="#" className="w-[38px] h-[38px] flex items-center justify-center text-[#3b5998] hover:opacity-80 transition-opacity">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 22.954 24 17.99 24 12c0-6.627-5.373-12-12-12z"/></svg>
              </a>
              
              {/* X / Twitter */}
              <a href="#" className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-white bg-black hover:opacity-80 transition-opacity">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.005 4.15H5.059z"/></svg>
              </a>
              
              {/* Pinterest */}
              <a href="#" className="w-[38px] h-[38px] flex items-center justify-center text-[#cb2027] hover:opacity-80 transition-opacity">
                 <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.168 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.366 18.602 0 12.017 0z"/></svg>
              </a>
              
              {/* LinkedIn */}
              <a href="#" className="w-[38px] h-[38px] flex items-center justify-center text-[#007bb5] hover:opacity-80 transition-opacity">
                 <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full"><path d="M12 0C5.373 0 0 5.373 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12C24 5.373 18.627 0 12 0zm-3.69 17.58H5.43V9.083h2.88v8.497zM6.87 7.922c-.92 0-1.666-.745-1.666-1.666s.746-1.666 1.666-1.666c.92 0 1.665.745 1.665 1.666s-.745 1.666-1.665 1.666zm11.7 9.658h-2.88v-4.14c0-.988-.02-2.259-1.375-2.259-1.377 0-1.587 1.077-1.587 2.188v4.21h-2.88V9.083h2.766v1.16h.04c.385-.729 1.326-1.5 2.73-1.5 2.922 0 3.465 1.922 3.465 4.423v4.414z"/></svg>
              </a>
              
              {/* Telegram */}
              <a href="#" className="w-[38px] h-[38px] flex items-center justify-center text-[#32a8de] hover:opacity-80 transition-opacity">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.895-1.058-.688-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              </a>

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
              <li><Link to="/admin" className="text-[15px] font-bold text-slate-500 hover:text-[#45c4f0] transition-colors flex items-center gap-2 group"><ChevronRight size={14} className="text-slate-300 group-hover:text-[#45c4f0] transition-colors" /> Admin Dashboard</Link></li>
            </ul>
          </div>

          {/* 3. Top Categories */}
          <div>
            <h3 className="text-[18px] font-black text-slate-900 mb-6">Top Categories</h3>
            <ul className="space-y-3.5">
              <li><Link to="/?category=Microcontrollers" className="text-[15px] font-bold text-slate-500 hover:text-[#45c4f0] transition-colors flex items-center gap-2 group"><ChevronRight size={14} className="text-slate-300 group-hover:text-[#45c4f0] transition-colors" /> Microcontrollers</Link></li>
              <li><Link to="/?category=Robotics" className="text-[15px] font-bold text-slate-500 hover:text-[#45c4f0] transition-colors flex items-center gap-2 group"><ChevronRight size={14} className="text-slate-300 group-hover:text-[#45c4f0] transition-colors" /> Robotics &amp; Kits</Link></li>
              <li><Link to="/?category=Sensors" className="text-[15px] font-bold text-slate-500 hover:text-[#45c4f0] transition-colors flex items-center gap-2 group"><ChevronRight size={14} className="text-slate-300 group-hover:text-[#45c4f0] transition-colors" /> Sensors &amp; Modules</Link></li>
              <li><Link to="/?category=IoT%20%26%20Wireless" className="text-[15px] font-bold text-slate-500 hover:text-[#45c4f0] transition-colors flex items-center gap-2 group"><ChevronRight size={14} className="text-slate-300 group-hover:text-[#45c4f0] transition-colors" /> IoT &amp; Wireless</Link></li>
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
                <span>Tech Hub, Building 4,<br/>Innovation Dist.</span>
              </li>
              <li className="flex items-center gap-3 text-[15px] font-bold text-slate-500">
                <div className="bg-[#eef6ff] p-2 rounded-full shrink-0">
                  <Phone size={16} className="text-[#45c4f0]" />
                </div>
                <span>+92 (42) 321-4567</span>
              </li>
              <li className="flex items-center gap-3 text-[15px] font-bold text-slate-500">
                <div className="bg-[#eef6ff] p-2 rounded-full shrink-0">
                  <Mail size={16} className="text-[#45c4f0]" />
                </div>
                <span>support@ktronics.org</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-200 gap-4">
          <p className="text-[14px] font-bold text-slate-400">
            &copy; {new Date().getFullYear()} Ktronics. All rights reserved.
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