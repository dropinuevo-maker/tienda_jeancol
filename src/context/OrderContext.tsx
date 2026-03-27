import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

import { Order, OrderContextType } from '@/types';

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Error al cargar pedidos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const addOrder = async (order: Omit<Order, 'id' | 'createdAt'>) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([order])
        .select();

      if (error) throw error;
      setOrders(prev => [data[0], ...prev]);
      return true;
    } catch (error) {
      console.error('Error adding order:', error);
      toast.error('Error al procesar el pedido');
      return false;
    }
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Error al actualizar el estado del pedido');
      return false;
    }
  };

  const getStats = () => {
    const totalRevenue = orders
      .filter(o => o.status === 'delivered')
      .reduce((acc, o) => acc + o.total, 0);
    return {
      totalRevenue,
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === 'pending').length
    };
  };

  const stats = {
    totalSales: orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0),
    orderCount: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    averageOrderValue: orders.length > 0 ? orders.reduce((sum, o) => sum + o.total, 0) / orders.length : 0
  };

  const getUserOrders = (userId: string) => {
    return orders.filter(o => o.userId === userId);
  };

  return (
    <OrderContext.Provider value={{ 
      orders, addOrder, updateOrderStatus, loading: isLoading, fetchOrders, getStats, stats, getUserOrders 
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
