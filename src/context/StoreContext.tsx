import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

import { StoreConfig, StoreContextType } from '@/types';

const defaultConfig: StoreConfig = {
  name: 'JEANCOL Professional',
  logo: 'https://picsum.photos/seed/jeancol/200/200',
  favicon: 'https://picsum.photos/seed/jeancol/32/32',
  primaryColor: '#8b5cf6',
  contactEmail: 'contacto@jeancol.com',
  contactPhone: '+57 300 000 0000',
  address: 'Calle 123 #45-67, Bogotá, Colombia',
  socialLinks: {
    instagram: 'https://instagram.com/jeancol',
    facebook: 'https://facebook.com/jeancol',
    whatsapp: 'https://wa.me/573000000000',
  },
  isMaintenanceMode: false,
  heroTitle: 'JEANCOL PROFESSIONAL',
  heroSubtitle: 'La mejor calidad en moda profesional',
  description: 'Tienda oficial de JEANCOL Professional'
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<StoreConfig>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);

  const setIsMaintenanceMode = (value: boolean) => {
    setConfig(prev => ({ ...prev, isMaintenanceMode: value }));
  };

  const getStoreName = () => config.name;

  const fetchConfig = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('store_config')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) setConfig(data);
    } catch (error) {
      console.error('Error fetching store config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const updateConfig = async (newConfig: Partial<StoreConfig>) => {
    try {
      const { error } = await supabase
        .from('store_config')
        .upsert({ id: 1, ...config, ...newConfig });

      if (error) throw error;
      setConfig(prev => ({ ...prev, ...newConfig }));
      toast.success('Configuración actualizada');
      return true;
    } catch (error) {
      console.error('Error updating store config:', error);
      toast.error('Error al actualizar configuración');
      return false;
    }
  };

  return (
    <StoreContext.Provider value={{ config, updateConfig, isLoading, loading: isLoading, fetchConfig, setIsMaintenanceMode, getStoreName, settings: config }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
