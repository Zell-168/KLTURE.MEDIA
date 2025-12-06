
import React, { useState, createContext, useContext, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { TranslationData, Language, User } from './types';
import { TRANSLATIONS } from './constants';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import FreeCourses from './pages/FreeCourses';
import Community from './pages/Community';
import OurClients from './pages/OurClients';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import SignIn from './pages/SignIn';
import Profile from './pages/Profile';
import Trainers from './pages/Trainers';
import LearningClassroom from './pages/LearningClassroom';
// AI Tools
import AiHub from './pages/ai/AiHub';
import AiMarketing from './pages/ai/AiMarketing';
import AiBoosting from './pages/ai/AiBoosting';
import AiSpy from './pages/ai/AiSpy';
import { User as UserIcon } from 'lucide-react';

// Language Context
interface LangContextType {
  lang: Language;
  t: TranslationData;
  toggleLang: () => void;
}

const LangContext = createContext<LangContextType | undefined>(undefined);

export const useLang = () => {
  const context = useContext(LangContext);
  if (!context) throw new Error('useLang must be used within a LangProvider');
  return context;
};

// Auth Context
interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [user, setUser] = useState<User | null>(null);

  // Check local storage for user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('klture_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user", e);
        localStorage.removeItem('klture_user');
      }
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('klture_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('klture_user');
  };

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'kh' : 'en');
  };

  const t = TRANSLATIONS[lang];

  return (
    <LangContext.Provider value={{ lang, t, toggleLang }}>
      <AuthContext.Provider value={{ user, login, logout }}>
        <HashRouter>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen font-sans text-white relative">
            
            {/* Liquid Background Layer */}
            <div className="fixed inset-0 -z-50 bg-[#050505] overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-900/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-900/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-purple-900/10 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <Navbar />
            <main className="flex-grow pt-16 relative z-10">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/clients" element={<OurClients />} />
                <Route path="/free" element={<FreeCourses />} />
                <Route path="/community" element={<Community />} />
                <Route path="/trainers" element={<Trainers />} />
                <Route path="/about" element={<About />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/learning/:courseId" element={<LearningClassroom />} />
                
                {/* AI Tools Routes */}
                <Route path="/ai" element={<AiHub />} />
                <Route path="/ai/marketing" element={<AiMarketing />} />
                <Route path="/ai/boosting" element={<AiBoosting />} />
                <Route path="/ai/spy" element={<AiSpy />} />
              </Routes>
            </main>
            <Footer />
            
            {/* Fixed "Our Team" Button */}
            <Link 
              to="/trainers" 
              className="fixed bottom-6 right-6 z-50 bg-red-600/90 backdrop-blur-md text-white px-6 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:bg-red-700 transition-all flex items-center gap-2 hover:scale-105 border border-red-500/50 group"
            >
              <UserIcon size={20} className="group-hover:animate-bounce" />
              {t.trainers.title}
            </Link>
          </div>
        </HashRouter>
      </AuthContext.Provider>
    </LangContext.Provider>
  );
};

export default App;
