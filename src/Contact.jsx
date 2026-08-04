import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
            <MessageSquare size={32} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-4">How can we help?</h1>
          <p className="text-slate-500 text-lg">Send us a message or contact our support team directly.</p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl border border-slate-200 text-center shadow-sm hover:shadow-md transition">
            <Phone size={24} className="text-blue-500 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 mb-1">Call Us</h3>
            <p className="text-sm text-slate-500">+92 (42) 321-4567</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 text-center shadow-sm hover:shadow-md transition">
            <Mail size={24} className="text-blue-500 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 mb-1">Email Support</h3>
            <p className="text-sm text-slate-500">support@ktronic.org</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 text-center shadow-sm hover:shadow-md transition">
            <MapPin size={24} className="text-blue-500 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 mb-1">Headquarters</h3>
            <p className="text-sm text-slate-500">Tech Hub, Building 4</p>
          </div>
        </div>

        {/* Professional Form */}
        <div className="bg-white p-8 md:p-12 rounded-2xl border border-slate-200 shadow-sm">
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Message sent to Ktronic Support!"); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                <input type="text" required className="w-full border border-slate-300 bg-slate-50 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:bg-white transition-colors text-sm" placeholder="John" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                <input type="text" required className="w-full border border-slate-300 bg-slate-50 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:bg-white transition-colors text-sm" placeholder="Doe" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <input type="email" required className="w-full border border-slate-300 bg-slate-50 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:bg-white transition-colors text-sm" placeholder="john@example.com" />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">How can we assist you?</label>
              <textarea required rows="5" className="w-full border border-slate-300 bg-slate-50 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:bg-white transition-colors text-sm" placeholder="Please describe your inquiry..."></textarea>
            </div>
            
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center justify-center gap-2">
              <Send size={18} /> Submit Request
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}