
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLang, useAuth } from '../App';
import { Menu, X, Globe, User, LogOut, LogIn, Wallet, Bot, Briefcase } from 'lucide-react';
import { useCreditBalance } from '../lib/hooks';

const Navbar: React.FC = () => {
  const { t, lang, toggleLang } = useLang();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { balance: creditBalance, loading: creditLoading } = useCreditBalance();

  const handleNav = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  // Nav Links
  const navLinks = [
    { name: t.nav.clients, path: '/clients' },
    { name: t.nav.ai, path: '/ai' },
    { name: t.nav.free, path: '/free' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/10 backdrop-blur-xl border-b border-white/5 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center" onClick={() => setIsOpen(false)}>
             <span className="font-black text-2xl tracking-tighter text-white drop-shadow-md">
                KLTURE<span className="text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]">.</span>MEDIA
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-all hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] ${link.path === '/ai' ? 'text-red-400 hover:text-red-300 font-bold flex items-center gap-1.5' : 'text-zinc-300 hover:text-white'}`}
              >
                {link.path === '/ai' && <Bot size={16} />}
                {link.name}
              </Link>
            ))}
            
            <button 
              onClick={toggleLang}
              className="flex items-center gap-1 text-sm font-semibold text-zinc-300 hover:text-white border border-white/10 bg-white/5 px-2 py-1 rounded hover:bg-white/10 transition-all"
            >
              <Globe size={14} />
              {lang === 'en' ? 'KH' : 'EN'}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                 {/* Credit Balance Badge */}
                 {!creditLoading && (
                   <div className="flex items-center gap-1.5 text-zinc-200 font-bold text-sm bg-black/40 border border-white/10 px-3 py-2 rounded-md backdrop-blur-md">
                     <Wallet size={16} className="text-green-400" />
                     ${creditBalance}
                   </div>
                 )}

                 <Link
                  to="/profile"
                  className="flex items-center gap-2 text-zinc-200 hover:text-white font-semibold text-sm border border-white/10 bg-white/5 px-4 py-2 rounded-md transition-all hover:bg-white/10 backdrop-blur-md"
                >
                  <User size={16} />
                  {t.nav.profile}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-500 hover:text-red-400 font-semibold text-sm border border-red-900/30 bg-red-900/10 px-3 py-2 rounded-md hover:bg-red-900/20 transition-all"
                >
                  <LogOut size={16} />
                  {t.nav.signOut}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/signin"
                  className="text-zinc-300 hover:text-white font-bold text-sm px-3 py-2 transition-all"
                >
                  {t.nav.signIn}
                </Link>
                <Link
                  to="/signup"
                  className="bg-red-600/90 text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-red-600 transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)] backdrop-blur-sm"
                >
                  {t.nav.signUp}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
             <button 
              onClick={toggleLang}
              className="text-sm font-bold text-zinc-400"
            >
              {lang === 'en' ? 'KH' : 'EN'}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-white">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-zinc-950/95 backdrop-blur-xl border-t border-white/10 absolute w-full h-screen left-0 top-20 px-4 py-6 flex flex-col gap-6 overflow-y-auto pb-32">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNav(link.path)}
              className={`text-left text-xl font-medium flex items-center gap-2 ${link.path === '/ai' ? 'text-red-500' : 'text-white'}`}
            >
              {link.path === '/ai' && <Bot size={20} />}
              {link.name}
            </button>
          ))}
          
          <div className="flex flex-col gap-4 mt-2">
             <button
              onClick={() => handleNav('/about')}
              className="text-left text-xl font-medium text-zinc-500 hover:text-zinc-300"
            >
              {t.nav.about}
            </button>
             <button
              onClick={() => handleNav('/faq')}
              className="text-left text-xl font-medium text-zinc-500 hover:text-zinc-300"
            >
              {t.nav.faq}
            </button>
          </div>

          <div className="h-px bg-white/10 my-2"></div>
          
          {user ? (
            <div className="flex flex-col gap-3">
               {/* Mobile Credit Balance */}
               {!creditLoading && (
                 <div className="flex items-center justify-between px-4 py-3 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-zinc-400 font-medium">Your Credits</span>
                    <span className="flex items-center gap-2 font-bold text-lg text-white">
                      <Wallet size={20} className="text-green-500" />
                      ${creditBalance}
                    </span>
                 </div>
               )}

              <button
                onClick={() => handleNav('/profile')}
                className="flex items-center justify-center gap-2 w-full py-4 border border-white/10 rounded-lg text-lg font-bold text-white hover:bg-white/5"
              >
                <User size={20} />
                {t.nav.profile}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full py-4 bg-red-900/10 text-red-500 rounded-lg text-lg font-bold"
              >
                <LogOut size={20} />
                {t.nav.signOut}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleNav('/signin')}
                className="flex items-center justify-center gap-2 w-full py-4 border border-white/10 text-white rounded-lg text-lg font-bold hover:bg-white/5"
              >
                <LogIn size={20} />
                {t.nav.signIn}
              </button>
              <button
                onClick={() => handleNav('/signup')}
                className="bg-red-600 text-white w-full py-4 rounded-lg text-lg font-bold text-center shadow-lg"
              >
                {t.nav.signUp}
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
