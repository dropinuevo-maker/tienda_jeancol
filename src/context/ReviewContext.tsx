import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

import { Review, ReviewContextType } from '@/types';

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const ReviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Error al cargar reseñas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const addReview = async (review: Omit<Review, 'id' | 'createdAt' | 'status'>) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([{ ...review, status: 'pending' }])
        .select();

      if (error) throw error;
      setReviews(prev => [data[0], ...prev]);
    } catch (error) {
      console.error('Error adding review:', error);
      toast.error('Error al enviar reseña');
    }
  };

  const updateReviewStatus = async (id: string, status: Review['status']) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    } catch (error) {
      console.error('Error updating review status:', error);
      toast.error('Error al actualizar estado de reseña');
    }
  };

  const deleteReview = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Error al eliminar reseña');
    }
  };

  const getProductReviews = (productId: string) => {
    return reviews.filter(r => r.productId === productId && r.status === 'approved');
  };

  const pendingReviews = reviews.filter(r => r.status === 'pending');
  const getPendingCount = () => pendingReviews.length;

  return (
    <ReviewContext.Provider value={{ 
      reviews, addReview, updateReviewStatus, deleteReview, getProductReviews, 
      loading: isLoading, fetchReviews, pendingReviews, getPendingCount 
    }}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (context === undefined) {
    throw new Error('useReviews must be used within a ReviewProvider');
  }
  return context;
};
