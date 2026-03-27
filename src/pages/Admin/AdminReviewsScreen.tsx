import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, Search, Filter, Trash2, 
  CheckCircle2, XCircle, MessageSquare, 
  User, Calendar, ExternalLink, MoreVertical,
  AlertCircle, ShieldCheck, ShieldAlert
} from 'lucide-react';
import { useReviews } from '../../context/ReviewContext';
import { useProducts } from '../../context/ProductContext';
import { formatPriceCOP } from '../../lib/utils';

export const AdminReviewsScreen = () => {
  const { reviews, updateReviewStatus, deleteReview, loading } = useReviews();
  const { products } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedReview, setSelectedReview] = useState<any>(null);

  if (loading) {
    return (
      <div className="p-4 lg:p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Cargando reseñas...</p>
        </div>
      </div>
    );
  }

  const filteredReviews = useMemo(() => {
    return reviews.filter(review => {
      const matchesSearch = 
        review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [reviews, searchTerm, statusFilter]);

  const getProductName = (productId: string) => {
    return products.find(p => p.id === productId)?.name || 'Producto Desconocido';
  };

  const handleStatusUpdate = (id: string, status: 'approved' | 'rejected') => {
    updateReviewStatus(id, status);
    if (selectedReview?.id === id) {
      setSelectedReview({ ...selectedReview, status });
    }
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl lg:text-6xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter leading-none mb-4">
            Gestión de <span className="text-primary">Reseñas</span>
          </h1>
          <p className="text-zinc-500 font-medium">Modera y analiza la opinión de tus clientes sobre tus productos.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
              <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Promedio Global</p>
              <p className="text-xl font-black text-zinc-900 dark:text-white">4.8 / 5.0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input 
            type="text"
            placeholder="Buscar por cliente o comentario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-8 py-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[32px] text-sm font-medium outline-none focus:ring-4 focus:ring-primary/10 transition-all"
          />
        </div>

        <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900 p-2 rounded-[32px] border border-zinc-200 dark:border-zinc-800">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                statusFilter === status 
                  ? 'bg-white dark:bg-zinc-800 text-primary shadow-sm' 
                  : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
              }`}
            >
              {status === 'all' ? 'Todos' : status === 'pending' ? 'Pendientes' : status === 'approved' ? 'Aprobados' : 'Rechazados'}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredReviews.map((review) => (
            <motion.div
              key={review.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group bg-white dark:bg-zinc-900 rounded-[40px] border border-zinc-100 dark:border-zinc-800 p-8 shadow-sm hover:shadow-2xl transition-all relative overflow-hidden"
            >
              {/* Status Indicator */}
              <div className={`absolute top-0 right-0 w-2 h-full ${
                review.status === 'approved' ? 'bg-green-500' : 
                review.status === 'rejected' ? 'bg-red-500' : 'bg-amber-500'
              }`} />

              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                    <User className="w-7 h-7 text-zinc-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight">{review.userName}</h3>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{new Date(review.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-amber-500/10 rounded-full">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span className="text-[10px] font-black text-amber-500">{review.rating}</span>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Producto</p>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white line-clamp-1">{getProductName(review.productId)}</h4>
              </div>

              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl p-6 mb-8 min-h-[120px]">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium italic leading-relaxed line-clamp-4">
                  "{review.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3">
                {review.status === 'pending' ? (
                  <>
                    <button 
                      onClick={() => handleStatusUpdate(review.id, 'approved')}
                      className="flex-1 py-4 bg-green-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Aprobar
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(review.id, 'rejected')}
                      className="flex-1 py-4 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" /> Rechazar
                    </button>
                  </>
                ) : (
                  <>
                    <div className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border ${
                      review.status === 'approved' 
                        ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                        : 'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}>
                      {review.status === 'approved' ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                      {review.status === 'approved' ? 'Aprobada' : 'Rechazada'}
                    </div>
                    <button 
                      onClick={() => deleteReview(review.id)}
                      className="p-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:text-red-500 rounded-2xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredReviews.length === 0 && (
        <div className="py-32 text-center">
          <div className="w-24 h-24 bg-zinc-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-12 h-12 text-zinc-200" />
          </div>
          <h3 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-2">No se encontraron reseñas</h3>
          <p className="text-zinc-500">Intenta ajustar los filtros o términos de búsqueda.</p>
        </div>
      )}
    </div>
  );
};
