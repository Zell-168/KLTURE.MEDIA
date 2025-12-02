import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { useAuth } from '../App';
import { useLocation } from 'react-router-dom';

export const useCreditBalance = () => {
  const { user } = useAuth();
  const location = useLocation(); // trigger refresh on route change
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchBalance = useCallback(async () => {
    if (!user?.email) {
      setBalance(0);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('credit_transactions')
        .select('amount')
        .eq('user_email', user.email);

      if (error) {
        console.error('Error fetching credit balance:', error);
        return;
      }

      const total = data?.reduce((sum, tx) => sum + Number(tx.amount), 0) || 0;
      setBalance(total);
    } catch (err) {
      console.error('Error calculating balance:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.email]);

  // Fetch on mount and when location changes (e.g. after a purchase redirect)
  useEffect(() => {
    fetchBalance();
  }, [fetchBalance, location]);

  return { balance, loading, refreshBalance: fetchBalance };
};