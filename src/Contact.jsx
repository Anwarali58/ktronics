import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { supabase } from './supabaseClient';

export default function Contact() {
  const [siteSettings, setSiteSettings] = useState({
    phone: '+92 311 1486790',
    email: 'support@ktronics.tech',
    address: 'Tech Hub, Building 4, Innovation Dist.'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('site_settings').select('*').eq('id', 1).single();
      if (data) {
        setSiteSettings({
          phone: data.phone || '+92 311 1486790',
          email: data.email || 'support@ktronics.tech',
          address: data.address || 'Tech Hub, Building 4'
        });
      }
    };
    fetchSettings();
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const fname = formData.get('fname');
    const lname = formData.get('lname');
    const userEmail = formData.get('email');
    const message = formData.get('message');
    
    const subject = `New Website Inquiry from ${fname} ${lname}`;
    const body = `Name: ${fname} ${lname}%0D%0AEmail: ${userEmail}%0D%0A%0D%0AMessage:%0D%0A${message}`;
    
    // Aggressively open email client in a new window/tab to bypass blockers
    const mailtoLink = `mailto:${siteSettings.email}?subject=${subject}&body=${body}`;
    window.open(mailtoLink, '_blank');
    
    alert(`Thank you! Opening your email client to securely send this message to ${siteSettings.email}.`);
    e.target.reset();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 font-nunito relative overflow-hidden">
      <div className="fixed inset-0 z-[0] opacity-[0.03] pointer-events-none mix-blend-multiply" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518770660439-4636190af475?w=2000&q=80')", backgroundAttachment: "fixed", backgroundSize: "cover", backgroundPosition: "center" }}></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 animate-fade-in-up">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2a64f6]/10 text-[#2a64f6] rounded-full mb-4 shadow-sm">
            <MessageSquare size={32} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">How can we help?</h1>
          <p className="text-slate-500 font-bold text-lg">Send us a message or contact our support team directly.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center shadow-sm hover:shadow-[0_10px_30px_rgba(42,100,246,0.1)] hover:border-[#45c4f0] transition-all group">
            <Phone size={28} className="text-[#45c4f0] mx-auto mb-4 group-hover:-translate-y-1 transition-transform" />
            <h3 className="font-black text-slate-900 mb-1 text-lg">Call Us</h3>
            <p className="text-sm font-bold text-slate-500">{siteSettings.phone}</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center shadow-sm hover:shadow-[0_10px_30px_rgba(42,100,246,0.1)] hover:border-[#45c4f0] transition-all group">
            <Mail size={28} className="text-[#45c4f0] mx-auto mb-4 group-hover:-translate-y-1 transition-transform" />
            <h3 className="font-black text-slate-900 mb-1 text-lg">Email Support</h3>
            <p className="text-sm font-bold text-slate-500">{siteSettings.email}</p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center shadow-sm hover:shadow-[0_10px_30px_rgba(42,100,246,0.1)] hover:border-[#45c4f0] transition-all group">
            <MapPin size={28} className="text-[#45c4f0] mx-auto mb-4 group-hover:-translate-y-1 transition-transform" />
            <h3 className="font-black text-slate-900 mb-1 text-lg">Headquarters</h3>
            <p className="text-sm font-bold text-slate-500">{siteSettings.address}</p>
          </div>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-[32px] border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <form className="space-y-6" onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-black text-slate-800 mb-2">First Name</label>
                <input name="fname" type="text" required className="w-full border-2 border-slate-100 bg-slate-50 rounded-xl px-4 py-3.5 outline-none focus:border-[#45c4f0] focus:bg-white focus:ring-4 focus:ring-[#45c4f0]/10 transition-all font-bold text-[15px] text-slate-800" placeholder="John" />
              </div>
              <div>
                <label className="block text-sm font-black text-slate-800 mb-2">Last Name</label>
                <input name="lname" type="text" required className="w-full border-2 border-slate-100 bg-slate-50 rounded-xl px-4 py-3.5 outline-none focus:border-[#45c4f0] focus:bg-white focus:ring-4 focus:ring-[#45c4f0]/10 transition-all font-bold text-[15px] text-slate-800" placeholder="Doe" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-black text-slate-800 mb-2">Email Address</label>
              <input name="email" type="email" required className="w-full border-2 border-slate-100 bg-slate-50 rounded-xl px-4 py-3.5 outline-none focus:border-[#45c4f0] focus:bg-white focus:ring-4 focus:ring-[#45c4f0]/10 transition-all font-bold text-[15px] text-slate-800" placeholder="john@example.com" />
            </div>
            
            <div>
              <label className="block text-sm font-black text-slate-800 mb-2">How can we assist you?</label>
              <textarea name="message" required rows="5" className="w-full border-2 border-slate-100 bg-slate-50 rounded-xl px-4 py-3.5 outline-none focus:border-[#45c4f0] focus:bg-white focus:ring-4 focus:ring-[#45c4f0]/10 transition-all font-bold text-[15px] text-slate-800 resize-none custom-scrollbar" placeholder="Please describe your inquiry..."></textarea>
            </div>
            
            <button type="submit" className="w-full bg-[#2a64f6] text-white font-black py-4 rounded-xl shadow-[0_4px_14px_rgba(42,100,246,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(42,100,246,0.4)] flex items-center justify-center gap-2 text-lg mt-4 cursor-pointer z-20 relative">
              <Send size={20} /> Send Message
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}