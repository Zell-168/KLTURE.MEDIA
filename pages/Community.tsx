
import React, { useEffect, useState } from 'react';
import { useLang, useAuth } from '../App';
import Section from '../components/ui/Section';
import { supabase } from '../lib/supabase';
import { User, Follow } from '../types';
import { Loader2, UserPlus, UserCheck, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Community: React.FC = () => {
  const { t } = useLang();
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [myFollows, setMyFollows] = useState<string[]>([]); // Array of emails I follow
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        // 1. Fetch All Users
        // Note: 'registrations' might have duplicates if a user bought multiple items.
        // We will deduplicate by email on the frontend.
        // IMPORTANT: We do NOT fetch the password field.
        const { data: userData, error: userError } = await supabase
          .from('registrations')
          .select('id, full_name, email, program, created_at')
          .order('created_at', { ascending: false });

        if (userError) throw userError;

        // Deduplicate users by email
        const uniqueUsers = Array.from(new Map(userData.map(u => [u.email, u])).values());
        setUsers(uniqueUsers);

        // 2. Fetch My Follows (if logged in)
        if (user?.email) {
          const { data: followData, error: followError } = await supabase
            .from('follows')
            .select('following_email')
            .eq('follower_email', user.email);

          if (followError) throw followError;

          const followingEmails = followData.map((f: any) => f.following_email);
          setMyFollows(followingEmails);
        }

      } catch (err) {
        console.error("Error fetching community data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityData();
  }, [user]);

  const handleFollow = async (targetEmail: string) => {
    if (!user) return;
    setFollowLoading(targetEmail);

    try {
      const { error } = await supabase
        .from('follows')
        .insert([{ follower_email: user.email, following_email: targetEmail }]);

      if (error) throw error;

      setMyFollows(prev => [...prev, targetEmail]);
    } catch (err) {
      console.error("Error following:", err);
    } finally {
      setFollowLoading(null);
    }
  };

  const handleUnfollow = async (targetEmail: string) => {
    if (!user) return;
    setFollowLoading(targetEmail);

    try {
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('follower_email', user.email)
        .eq('following_email', targetEmail);

      if (error) throw error;

      setMyFollows(prev => prev.filter(e => e !== targetEmail));
    } catch (err) {
      console.error("Error unfollowing:", err);
    } finally {
      setFollowLoading(null);
    }
  };

  return (
    <div className="min-h-screen">
      <Section>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black mb-4 flex items-center justify-center gap-3 text-white drop-shadow-md">
            <Users size={40} className="text-red-600" />
            {t.community.title}
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            {t.community.subtitle}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-zinc-500" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((u) => {
              // Skip showing myself
              if (user && u.email === user.email) return null;

              const isFollowing = myFollows.includes(u.email);
              const isLoading = followLoading === u.email;

              // Generate initials
              const initials = u.full_name
                ? u.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                : 'U';

              return (
                <div key={u.id} className="glass-panel glass-panel-hover rounded-2xl p-6 transition-all duration-300 flex flex-col items-center text-center hover:-translate-y-1">
                  <div className="w-20 h-20 bg-black/40 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 border-4 border-white/5 shadow-inner">
                    {initials}
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-1">{u.full_name}</h3>
                  <p className="text-zinc-400 text-sm mb-4 line-clamp-1">{u.program || 'Member'}</p>

                  <div className="mt-auto w-full">
                    {user ? (
                      <button
                        onClick={() => isFollowing ? handleUnfollow(u.email) : handleFollow(u.email)}
                        disabled={isLoading}
                        className={`w-full py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                          isFollowing
                            ? 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 border border-white/5'
                            : 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/20'
                        }`}
                      >
                        {isLoading ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : isFollowing ? (
                          <>
                            <UserCheck size={18} /> {t.community.unfollow}
                          </>
                        ) : (
                          <>
                            <UserPlus size={18} /> {t.community.follow}
                          </>
                        )}
                      </button>
                    ) : (
                      <Link to="/signin" className="block w-full py-2.5 rounded-xl font-bold bg-white/5 border border-white/10 text-zinc-400 hover:bg-white/10 transition-colors">
                        Log in to Connect
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Section>
    </div>
  );
};

export default Community;
