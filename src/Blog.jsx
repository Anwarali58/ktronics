import { useState, useEffect } from 'react';
import { ChevronLeft, Calendar, Tag, ArrowRight, BookOpen, ThumbsUp, ThumbsDown, MessageSquare, Send, User } from 'lucide-react';
import { supabase } from './supabaseClient';

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to get logged-in user's name
  const getActiveUser = () => {
    const email = localStorage.getItem('currentUser');
    if (!email) return null;
    const usersDB = JSON.parse(localStorage.getItem('ktronic_users')) || [];
    const user = usersDB.find(u => u.email === email);
    return user ? user.name : email.split('@')[0];
  };

  const activeUserName = getActiveUser();

  useEffect(() => {
    const fetchDatabase = async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('id', { ascending: false });

      if (!error && data) {
        setBlogs(data);
      } else if (error) {
        console.error("Error fetching blogs:", error);
      }
      setLoading(false);
    };

    fetchDatabase();
  }, []);

  const extractTextPreview = (htmlString) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = htmlString;
    return tmp.textContent || tmp.innerText || "";
  };

  // --- INTERACTION HANDLERS ---
  const handleVote = async (type) => {
    // Prevent spam voting
    const voteKey = `voted_blog_${selectedBlog.id}`;
    if (localStorage.getItem(voteKey)) {
      return alert("You have already voted on this article!");
    }

    const newCount = (selectedBlog[type] || 0) + 1;
    
    // 1. Instantly update UI for the user (Optimistic update)
    setSelectedBlog(prev => ({ ...prev, [type]: newCount }));
    setBlogs(prev => prev.map(b => b.id === selectedBlog.id ? { ...b, [type]: newCount } : b));
    localStorage.setItem(voteKey, 'true');

    // 2. Save to Live Database
    await supabase.from('blogs').update({ [type]: newCount }).eq('id', selectedBlog.id);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const nameInput = e.target.name ? e.target.name.value : activeUserName;
    const textInput = e.target.comment.value;
    
    if (!textInput.trim()) return;

    const newComment = {
      id: Date.now(),
      name: nameInput || 'Anonymous Guest',
      text: textInput,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    const currentComments = selectedBlog.comments || [];
    const updatedComments = [...currentComments, newComment];

    // 1. Instantly update UI
    setSelectedBlog(prev => ({ ...prev, comments: updatedComments }));
    setBlogs(prev => prev.map(b => b.id === selectedBlog.id ? { ...b, comments: updatedComments } : b));
    e.target.reset();

    // 2. Save to Live Database
    await supabase.from('blogs').update({ comments: updatedComments }).eq('id', selectedBlog.id);
  };

  // --- DETAILED VIEW (WITH INTERACTIVE FEEDBACK) ---
  if (selectedBlog) {
    const commentsList = selectedBlog.comments || [];
    const hasVoted = localStorage.getItem(`voted_blog_${selectedBlog.id}`);

    return (
      <div className="min-h-screen bg-slate-50 font-nunito pb-24 animate-fade-in-up">
        {/* CSS to control TinyMCE output */}
        <style>{`
          .blog-html-content {
            word-wrap: break-word;
            overflow-wrap: break-word;
            word-break: break-word;
            width: 100%;
          }
          .blog-html-content img {
            max-width: 100% !important;
            height: auto !important;
            border-radius: 16px;
            margin: 2.5rem auto;
            display: block;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          }
          .blog-html-content p { margin-bottom: 1.5rem; }
          .blog-html-content h1, .blog-html-content h2, .blog-html-content h3, .blog-html-content h4 {
            color: #0f172a; font-weight: 900; margin-top: 2.5rem; margin-bottom: 1rem; line-height: 1.3;
          }
          .blog-html-content a { color: #2a64f6; text-decoration: underline; }
          .blog-html-content ul { list-style-type: disc; padding-left: 2rem; margin-bottom: 1.5rem; }
        `}</style>

        {/* Edge-to-Edge Hero Banner */}
        <div className="w-full h-[40vh] md:h-[50vh] bg-slate-900 relative">
          <img src={selectedBlog.image} alt={selectedBlog.title} className="w-full h-full object-cover opacity-50 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/10 to-transparent"></div>
          
          <div className="absolute top-0 left-0 w-full p-6 lg:px-12 z-20">
            <button onClick={() => setSelectedBlog(null)} className="flex items-center gap-2 text-white/90 hover:text-white font-bold transition-colors bg-black/30 hover:bg-black/50 px-5 py-2.5 rounded-full w-max backdrop-blur-md shadow-sm border border-white/10">
              <ChevronLeft size={18} /> Back to Articles
            </button>
          </div>
        </div>
        
        {/* Main Content Container */}
        <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-12 -mt-32 relative z-10">
          <div className="bg-white rounded-[40px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 p-8 sm:p-12 lg:p-16 mb-12">
            
            <div className="flex flex-wrap items-center gap-4 mb-8 text-sm font-bold">
              <span className="bg-[#eef6ff] text-[#2a64f6] px-4 py-1.5 rounded-full flex items-center gap-2 tracking-wide uppercase shadow-sm">
                <Tag size={16}/> {selectedBlog.category}
              </span>
              <span className="text-slate-500 flex items-center gap-2 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">
                <Calendar size={16}/> Published on {selectedBlog.date}
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 mb-12 leading-tight tracking-tight">
              {selectedBlog.title}
            </h1>
            
            {/* INJECTS DYNAMIC RICH-TEXT HTML FROM TINYMCE */}
            <div 
              className="blog-html-content text-slate-700 font-medium text-[19px] leading-loose w-full"
              dangerouslySetInnerHTML={{ __html: selectedBlog.snippet }} 
            />

            {/* --- NEW: ENGAGEMENT & FEEDBACK SECTION --- */}
            <div className="mt-16 pt-12 border-t-2 border-slate-100">
              
              {/* Voting Module */}
              <div className="flex flex-col items-center justify-center mb-16 bg-slate-50 rounded-3xl p-8 border border-slate-100">
                <h3 className="text-xl font-black text-slate-800 mb-6">Did you find this article helpful?</h3>
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => handleVote('likes')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-black transition-all shadow-sm ${hasVoted ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-white border border-slate-200 text-slate-700 hover:text-[#2a64f6] hover:border-[#2a64f6] hover:shadow-md'}`}
                  >
                    <ThumbsUp size={20} className={hasVoted ? "" : "group-hover:-translate-y-0.5 transition-transform"}/> 
                    {selectedBlog.likes || 0}
                  </button>
                  <button 
                    onClick={() => handleVote('dislikes')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-black transition-all shadow-sm ${hasVoted ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-white border border-slate-200 text-slate-700 hover:text-rose-500 hover:border-rose-500 hover:shadow-md'}`}
                  >
                    <ThumbsDown size={20} className={hasVoted ? "" : "group-hover:translate-y-0.5 transition-transform"}/> 
                    {selectedBlog.dislikes || 0}
                  </button>
                </div>
              </div>

              {/* Comments Module */}
              <div className="max-w-[800px] mx-auto">
                <div className="flex items-center gap-3 mb-8">
                  <MessageSquare className="text-[#2a64f6]" size={28} />
                  <h3 className="text-2xl font-black text-slate-900">Discussion ({commentsList.length})</h3>
                </div>

                {/* Comment Submission Form */}
                <form onSubmit={handleCommentSubmit} className="bg-[#f8fafc] p-6 rounded-3xl border border-slate-200 mb-10 shadow-sm">
                  <h4 className="font-bold text-slate-700 mb-4 text-[15px]">Share your feedback or ask a question:</h4>
                  
                  {!activeUserName && (
                    <div className="mb-4 relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                      <input name="name" type="text" required placeholder="Your Name" className="w-full border border-slate-200 bg-white rounded-xl pl-12 pr-4 py-3 outline-none focus:border-[#45c4f0] focus:ring-4 focus:ring-[#45c4f0]/10 transition-all font-bold text-[15px] text-slate-800" />
                    </div>
                  )}

                  <div className="relative">
                    <textarea name="comment" required rows="3" placeholder="Write your comment here..." className="w-full border border-slate-200 bg-white rounded-xl p-4 outline-none focus:border-[#45c4f0] focus:ring-4 focus:ring-[#45c4f0]/10 transition-all font-medium text-[16px] text-slate-800 resize-none custom-scrollbar"></textarea>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <button type="submit" className="bg-[#2a64f6] text-white font-black px-8 py-3.5 rounded-xl shadow-[0_4px_14px_rgba(42,100,246,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(42,100,246,0.4)] flex items-center gap-2">
                      <Send size={18}/> Post Comment
                    </button>
                  </div>
                </form>

                {/* Live Comments Feed */}
                <div className="space-y-6">
                  {commentsList.length === 0 ? (
                    <p className="text-center text-slate-500 font-bold py-6 bg-slate-50 rounded-2xl border border-slate-100">No comments yet. Be the first to start the discussion!</p>
                  ) : (
                    [...commentsList].reverse().map((comment) => (
                      <div key={comment.id} className="flex gap-4 animate-fade-in-up">
                        <div className="h-12 w-12 shrink-0 bg-gradient-to-br from-[#2a64f6] to-[#45c4f0] rounded-full flex items-center justify-center text-white font-black text-lg shadow-sm border-2 border-white ring-2 ring-slate-100">
                          {comment.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 bg-white p-5 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-black text-slate-800 text-[15px]">{comment.name} {activeUserName === comment.name && <span className="bg-[#eef6ff] text-[#2a64f6] text-[10px] px-2 py-0.5 rounded-full ml-2">YOU</span>}</span>
                            <span className="text-[12px] font-bold text-slate-400">{comment.date}</span>
                          </div>
                          <p className="text-slate-600 font-medium leading-relaxed">{comment.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
              
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- GRID LIST VIEW ---
  return (
    <div className="min-h-screen bg-[#f8fafc] font-nunito pb-20">
      
      {/* --- REDESIGNED PREMIUM HERO BANNER --- */}
      <div className="relative w-full h-[350px] sm:h-[400px] bg-slate-900 mb-16 flex flex-col items-center justify-center overflow-hidden shadow-sm">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=2000&q=80" className="w-full h-full object-cover opacity-20 mix-blend-luminosity" alt="Tech Background"/>
          <div className="absolute inset-0 bg-gradient-to-t from-[#f8fafc] via-slate-900/60 to-slate-900/90"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#2a64f6]/30 to-[#45c4f0]/20 mix-blend-overlay"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-[1000px] mt-8 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white text-xs font-black uppercase tracking-widest mb-6 shadow-sm">
            <BookOpen size={14} className="text-[#45c4f0]"/> Ktronics Knowledge Base
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-lg">
            Tech & Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#45c4f0] to-[#2a64f6]">Guides</span>
          </h1>
          <p className="text-slate-300 font-bold text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto drop-shadow">
            Explore in-depth tutorials, multi-image component breakdowns, and hardware news to power up your next project.
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6">
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#2a64f6]"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map(blog => (
                <div key={blog.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-[0_20px_40px_-10px_rgba(42,100,246,0.15)] transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer" onClick={() => setSelectedBlog(blog)}>
                  <div className="relative h-[260px] overflow-hidden bg-slate-100">
                    <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                    
                    {/* Live Interaction Stats on Card */}
                    <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-black px-3 py-1.5 rounded-full flex items-center gap-3">
                      <span className="flex items-center gap-1"><ThumbsUp size={12} className="text-[#45c4f0]"/> {blog.likes || 0}</span>
                      <span className="flex items-center gap-1"><MessageSquare size={12} className="text-[#2a64f6]"/> {(blog.comments || []).length}</span>
                    </div>

                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-4 py-1.5 rounded-full text-[12px] font-black text-[#2a64f6] uppercase tracking-widest shadow-md flex items-center gap-1.5">
                      <Tag size={12}/> {blog.category}
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-grow">
                    <p className="text-slate-400 font-bold text-[13px] mb-4 flex items-center gap-1.5"><Calendar size={14}/> {blog.date}</p>
                    <h3 className="text-2xl font-black text-slate-900 mb-4 leading-snug line-clamp-2 group-hover:text-[#45c4f0] transition-colors tracking-tight">
                      {blog.title}
                    </h3>
                    <p className="text-slate-500 text-[15px] line-clamp-3 mb-8 font-medium leading-relaxed">
                      {extractTextPreview(blog.snippet)}
                    </p>
                    <div className="mt-auto pt-5 border-t border-slate-100 flex items-center text-[#2a64f6] font-black text-[14px] uppercase tracking-widest group-hover:gap-3 gap-2 transition-all">
                      Read Full Article <ArrowRight size={18} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {blogs.length === 0 && (
              <div className="text-center py-24 bg-white rounded-[40px] border border-slate-200 shadow-sm flex flex-col items-center">
                <BookOpen size={48} className="text-slate-300 mb-4" />
                <h2 className="text-3xl font-black text-slate-800 mb-3 tracking-tight">No blogs published yet!</h2>
                <p className="text-slate-500 font-bold text-lg">Check back soon for new guides and articles.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}