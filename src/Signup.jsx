import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    const existingUsers = JSON.parse(localStorage.getItem('ktronic_users')) || [];
    
    if (existingUsers.find(u => u.email === formData.email)) {
      alert('Email already registered. Please login.');
      return;
    }

    existingUsers.push(formData);
    localStorage.setItem('ktronic_users', JSON.stringify(existingUsers));
    
    alert('Account created! Please log in.');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-slate-900">Create an Account</h2>
          <p className="text-sm text-slate-500 mt-1">Join Ktronic to start building</p>
        </div>
        
        <form className="space-y-4" onSubmit={handleSignup}>
          <input type="text" required placeholder="Full Name" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-violet-500 text-sm" onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <input type="email" required placeholder="Email Address" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-violet-500 text-sm" onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <input type="password" required placeholder="Password" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-violet-500 text-sm" onChange={(e) => setFormData({...formData, password: e.target.value})} />
          
          <button type="submit" className="w-full py-2.5 rounded-lg font-bold text-white bg-violet-600 hover:bg-violet-700 transition shadow-sm mt-2">Sign Up</button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">Already have an account? <Link to="/login" className="text-violet-600 font-bold hover:underline">Log in here</Link></p>
      </div>
    </div>
  );
}