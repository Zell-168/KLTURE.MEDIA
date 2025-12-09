
import React, { useState } from 'react';
import { useLang, useAuth } from '../App';
import Section from '../components/ui/Section';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Loader2, AlertCircle, UserPlus, Mail, Phone, Lock, User as UserIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

const SignUp: React.FC = () => {
  const { t } = useLang();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if user came from a specific course page
  const fromProgram = location.state?.selectedProgram;
  const returnTo = location.state?.returnTo;

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
        // 1. Check if email already exists
        const { data: existingUser } = await supabase
            .from('registrations')
            .select('email')
            .eq('email', formData.email.trim())
            .maybeSingle();
            
        if (existingUser) {
            setErrorMsg("This email is already registered. Please sign in.");
            setLoading(false);
            return;
        }

        // 2. Insert new user
        const { data, error } = await supabase
            .from('registrations')
            .insert([{
                full_name: formData.fullName,
                email: formData.email.trim(),
                phone_number: formData.phoneNumber,
                password: formData.password,
                // If they came from a course button, save that program. Otherwise, 'General Member'.
                program: fromProgram || 'General Member',
                preferred_date: new Date().toISOString(),
                message: fromProgram 
                    ? `Registered specifically for: ${fromProgram}` 
                    : 'Self-registered via Sign Up page'
            }])
            .select()
            .single();

        if (error) throw error;

        // 3. Auto Login
        if (data) {
            login(data);
            
            // Redirect logic: If they were trying to enroll, go to checkout (Contact). Otherwise profile.
            if (returnTo && fromProgram) {
                navigate(returnTo, { state: { selectedProgram: fromProgram } });
            } else {
                navigate('/profile');
            }
        }

    } catch (err: any) {
        console.error("Sign up error:", err);
        setErrorMsg("Failed to create account. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Section className="w-full">
        <div className="w-full max-w-md glass-panel p-8 rounded-2xl shadow-2xl mx-auto backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-red-900/20 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-900/50">
              <UserPlus size={24} />
            </div>
            <h1 className="text-2xl font-bold text-white">{t.nav.signUp}</h1>
            {fromProgram ? (
                <p className="text-green-400 mt-2 text-sm font-medium border border-green-500/20 bg-green-500/10 py-1 px-3 rounded-full inline-block">
                    to register for {fromProgram}
                </p>
            ) : (
                <p className="text-zinc-400 mt-2">Create your KLTURE.MEDIA account</p>
            )}
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-700/50 rounded-lg flex items-start gap-3 text-red-400 backdrop-blur-sm">
              <AlertCircle className="shrink-0 mt-0.5" size={20} />
              <p className="text-sm font-medium">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-zinc-400 mb-1">Full Name</label>
              <div className="relative">
                <input
                    required
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-black/60 transition-all"
                />
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-400 mb-1">Email Address</label>
              <div className="relative">
                <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-black/60 transition-all"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-400 mb-1">Phone Number</label>
              <div className="relative">
                <input
                    required
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-black/60 transition-all"
                />
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-400 mb-1">Password</label>
              <div className="relative">
                <input
                    required
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Choose a password"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-black/60 transition-all"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 mt-6 shadow-lg shadow-red-900/20"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Creating Account...
                </>
              ) : (
                t.nav.signUp
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-zinc-500">
            Already have an account?{' '}
            <Link 
                to="/signin" 
                state={{ returnTo, selectedProgram: fromProgram }} 
                className="text-white font-bold hover:underline"
            >
              {t.nav.signIn}
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default SignUp;
