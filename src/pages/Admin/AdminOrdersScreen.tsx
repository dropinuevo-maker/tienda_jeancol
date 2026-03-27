import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Download, Eye, MoreVertical, 
  ChevronRight, Clock, Package, Truck, CheckCircle, 
  XCircle, AlertCircle, Calendar, DollarSign, 
  ShoppingBag, ArrowRight, X, Phone, Mail, MapPin,
  ExternalLink, Printer, Trash2
} from 'lucide-react';
import { AdminNavigation } from '../../components/AdminNavigation';
import { useOrders } from '../../context/OrderContext';
import { Order } from '../../types';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import { formatPriceCOP, formatDate } from '../../lib/utils';

export const AdminOrdersScreen = () => {
  const { orders, updateOrderStatus, loading: ordersLoading } = useOrders();
  const { success, error, loading, dismiss } = useToast();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (ordersLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex">
        <AdminNavigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Cargando pedidos...</p>
          </div>
        </main>
      </div>
    );
  }

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, searchQuery, statusFilter]);

  const handleStatusUpdate = async (id: string, newStatus: Order['status']) => {
    const toastId = loading('Actualizando estado...');
    try {
      await updateOrderStatus(id, newStatus);
      success('Estado actualizado con éxito');
      if (selectedOrder?.id === id) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err) {
      error('Error al actualizar estado');
    } finally {
      dismiss(toastId);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400';
      case 'processing': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'shipped': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400';
      case 'delivered': return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'cancelled': return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-zinc-100 text-zinc-600';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="pb-24 lg:pb-10 flex flex-col lg:flex-row min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <AdminNavigation />
      <div className="flex-1">
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 h-16 lg:h-20 flex items-center px-4 lg:px-8">
          <div className="flex items-center justify-between w-full">
            <div>
              <h1 className="text-lg lg:text-xl font-black text-zinc-900 dark:text-white">Pedidos</h1>
              <p className="text-xs text-zinc-500">Gestiona las ventas de tu tienda</p>
            </div>
            <button className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all">
              <Download className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
            </button>
          </div>
        </header>

        <main className="p-4 lg:p-8">
          {/* Filters & Search */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                placeholder="Buscar por ID, cliente o email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
              {(['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    statusFilter === status
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'bg-white dark:bg-zinc-900 text-zinc-500 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  {status === 'all' ? 'Todos' : 
                   status === 'pending' ? 'Pendientes' :
                   status === 'processing' ? 'Procesando' :
                   status === 'shipped' ? 'Enviados' :
                   status === 'delivered' ? 'Entregados' : 'Cancelados'}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table/Grid */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                    <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Pedido</th>
                    <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Cliente</th>
                    <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Fecha</th>
                    <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Total</th>
                    <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Estado</th>
                    <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-20 text-center">
                        <ShoppingBag className="w-16 h-16 text-zinc-200 mx-auto mb-4" />
                        <p className="text-zinc-500 font-bold">No se encontraron pedidos</p>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors cursor-pointer group"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <td className="px-6 py-4">
                          <span className="text-sm font-black text-zinc-900 dark:text-white">#{order.id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-bold text-zinc-900 dark:text-white">{order.customer}</p>
                            <p className="text-xs text-zinc-500">{order.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs text-zinc-600 dark:text-zinc-400">{formatDate(order.createdAt)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-black text-primary">${formatPriceCOP(order.total)}</p>
                          <p className="text-[10px] text-zinc-400 uppercase font-bold">{order.paymentMethod}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status === 'pending' ? 'Pendiente' :
                             order.status === 'processing' ? 'Procesando' :
                             order.status === 'shipped' ? 'Enviado' :
                             order.status === 'delivered' ? 'Entregado' : 'Cancelado'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg transition-colors">
                            <Eye className="w-4 h-4 text-zinc-400" />
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-zinc-900 dark:text-white">Pedido #{selectedOrder.id}</h2>
                    <p className="text-xs text-zinc-500">{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                  <X className="w-6 h-6 text-zinc-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left: Customer & Items */}
                  <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                        <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">Información del Cliente</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-primary" />
                            <p className="text-sm font-bold text-zinc-900 dark:text-white">{selectedOrder.customer}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-zinc-400" />
                            <p className="text-xs text-zinc-500">{selectedOrder.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-zinc-400" />
                            <p className="text-xs text-zinc-500">{selectedOrder.phone}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                        <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">Dirección de Envío</h3>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-primary mt-0.5" />
                            <div>
                              <p className="text-sm font-bold text-zinc-900 dark:text-white">{selectedOrder.address}</p>
                              <p className="text-xs text-zinc-500">{selectedOrder.city}, {selectedOrder.department}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">Productos del Pedido</h3>
                      <div className="space-y-3">
                        {selectedOrder.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl shadow-sm">
                            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{item.name}</p>
                              <p className="text-xs text-zinc-500">Talla: {item.size} • Cantidad: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-black text-primary">${formatPriceCOP(item.price * item.quantity)}</p>
                              <p className="text-[10px] text-zinc-400">${formatPriceCOP(item.price)} c/u</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Summary & Actions */}
                  <div className="space-y-6">
                    <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl border border-zinc-200 dark:border-zinc-800">
                      <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">Resumen de Pago</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-500">Subtotal</span>
                          <span className="font-bold text-zinc-900 dark:text-white">${formatPriceCOP(selectedOrder.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-500">Envío</span>
                          <span className="font-bold text-zinc-900 dark:text-white">${formatPriceCOP(selectedOrder.shipping)}</span>
                        </div>
                        {selectedOrder.discount && (
                          <div className="flex justify-between text-sm">
                            <span className="text-emerald-500">Descuento ({selectedOrder.couponCode})</span>
                            <span className="font-bold text-emerald-500">-${formatPriceCOP(selectedOrder.discount)}</span>
                          </div>
                        )}
                        <div className="pt-3 border-t border-zinc-200 dark:border-zinc-700 flex justify-between items-end">
                          <span className="text-xs font-black text-zinc-400 uppercase">Total</span>
                          <span className="text-2xl font-black text-primary">${formatPriceCOP(selectedOrder.total)}</span>
                        </div>
                      </div>
                      <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-700">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-4 h-4 text-zinc-400" />
                          <span className="text-xs font-bold text-zinc-500 uppercase">Método de Pago</span>
                        </div>
                        <p className="text-sm font-black text-zinc-900 dark:text-white uppercase">{selectedOrder.paymentMethod}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">Actualizar Estado</h3>
                      <div className="grid grid-cols-1 gap-2">
                        {(['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusUpdate(selectedOrder.id, status)}
                            className={`flex items-center gap-3 p-3 rounded-xl text-xs font-bold transition-all ${
                              selectedOrder.status === status
                                ? getStatusColor(status) + ' ring-2 ring-primary/20'
                                : 'bg-white dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700'
                            }`}
                          >
                            {getStatusIcon(status)}
                            <span className="capitalize">
                              {status === 'pending' ? 'Pendiente' :
                               status === 'processing' ? 'Procesando' :
                               status === 'shipped' ? 'Enviado' :
                               status === 'delivered' ? 'Entregado' : 'Cancelado'}
                            </span>
                            {selectedOrder.status === status && <CheckCircle className="w-4 h-4 ml-auto" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-2 p-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-xl text-xs font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all">
                        <Printer className="w-4 h-4" />
                        Imprimir
                      </button>
                      <button className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
