
import React, { useState } from 'react';
import { useLang, useAuth } from '../App';
import Section from '../components/ui/Section';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, AlertCircle, LogIn } from 'lucide-react';
import { supabase } from '../lib/supabase';

const SignIn: React.FC = () => {
  const { t } = useLang();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
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
      // Check Supabase by EMAIL
      // We use .limit(1).maybeSingle() because if a user enrolled in multiple courses,
      // they will have multiple rows. We just need one row to confirm auth and get user details.
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .eq('email', formData.email.trim())
        .eq('password', formData.password.trim())
        .order('created_at', { ascending: false }) // Get latest info
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Supabase error:', error);
        setErrorMsg('Database error. Please check your connection or contact support.');
      } else if (!data) {
        setErrorMsg('Invalid email or password.');
      } else {
        login(data);
        navigate('/profile');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMsg('An error occurred during sign in.');
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
              <LogIn size={24} />
            </div>
            <h1 className="text-2xl font-bold text-white">{t.nav.signIn}</h1>
            <p className="text-zinc-400 mt-2">Access your KLTURE.MEDIA account</p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-700/50 rounded-lg flex items-start gap-3 text-red-400 backdrop-blur-sm">
              <AlertCircle className="shrink-0 mt-0.5" size={20} />
              <p className="text-sm font-medium">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-zinc-400 mb-1">{t.contact.formEmail}</label>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-black/60 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-400 mb-1">{t.contact.formPassword}</label>
              <input
                required
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:bg-black/60 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black py-4 rounded-xl font-bold text-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 mt-4 shadow-lg shadow-white/10"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Signing In...
                </>
              ) : (
                t.nav.signIn
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-zinc-500">
            Don't have an account?{' '}
            <Link to="/contact" className="text-red-500 font-bold hover:underline">
              Register Now
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default SignIn;
