import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Strict Admin Access with new credentials
    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('currentUser', JSON.stringify({ name: 'Admin', username }));
      localStorage.setItem('userRole', 'admin');
      window.location.href = '/admin'; // Force reload to apply admin state
    } else {
      alert('Unauthorized access. Invalid credentials.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
        <div className="text-center mb-6">
          <div className="mx-auto h-12 w-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg mb-4">
            <span className="text-white font-black text-2xl">K</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900">Admin Portal</h2>
          <p className="text-sm text-slate-500 mt-1">Authorized personnel only</p>
        </div>
        
        <form className="space-y-4" onSubmit={handleLogin}>
          {/* Changed type from "email" to "text" to prevent the '@' requirement */}
          <input 
            type="text" 
            required 
            placeholder="Username" 
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-violet-500 text-sm" 
            onChange={(e) => setUsername(e.target.value)} 
          />
          <input 
            type="password" 
            required 
            placeholder="Password" 
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-violet-500 text-sm" 
            onChange={(e) => setPassword(e.target.value)} 
          />
          
          <button type="submit" className="w-full py-2.5 rounded-lg font-bold text-white bg-violet-600 hover:bg-violet-700 transition shadow-sm mt-2">
            Access Dashboard
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-slate-600">
          Return to <Link to="/" className="text-violet-600 font-bold hover:underline">Open Market</Link>
        </p>
      </div>
    </div>
  );
}