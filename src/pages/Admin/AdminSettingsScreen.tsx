import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, Save, Globe, Bell, Shield, 
  CreditCard, Truck, Mail, Phone, MapPin,
  Instagram, Facebook, Twitter, Smartphone,
  Database, Cloud, Lock, User, Eye, EyeOff,
  Trash2, Plus, Info, Palette, Layout,
  Share2, MessageSquare, Zap
} from 'lucide-react';
import { AdminNavigation } from '../../components/AdminNavigation';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';

export const AdminSettingsScreen = () => {
  const { config, updateConfig, loading: storeLoading } = useStore();
  const { success, error, loading, dismiss } = useToast();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState(config);
  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'shipping' | 'payments' | 'notifications' | 'security'>('general');

  if (storeLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex">
        <AdminNavigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Cargando configuración...</p>
          </div>
        </main>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    const toastId = loading('Guardando configuración...');
    try {
      await updateConfig(formData);
      success('Configuración guardada con éxito');
    } catch (err) {
      error('Error al guardar configuración');
    } finally {
      dismiss(toastId);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'appearance', label: 'Apariencia', icon: Palette },
    { id: 'shipping', label: 'Envío', icon: Truck },
    { id: 'payments', label: 'Pagos', icon: CreditCard },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'security', label: 'Seguridad', icon: Shield },
  ];

  return (
    <div className="pb-24 lg:pb-10 flex flex-col lg:flex-row min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <AdminNavigation />
      <div className="flex-1">
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 h-16 lg:h-20 flex items-center px-4 lg:px-8">
          <div className="flex items-center justify-between w-full">
            <div>
              <h1 className="text-lg lg:text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Configuración</h1>
              <p className="text-xs text-zinc-500 font-medium">Personaliza tu tienda y preferencias</p>
            </div>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-black shadow-lg shadow-primary/20 hover:scale-105 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Guardar</span>
            </button>
          </div>
        </header>

        <main className="p-4 lg:p-8 max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Tabs */}
            <aside className="lg:w-64 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </aside>

            {/* Content Area */}
            <div className="flex-1 space-y-6">
              {activeTab === 'general' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <section className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-6">Información de la Tienda</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Nombre de la Tienda</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Email de Contacto</label>
                        <input
                          type="email"
                          name="contactEmail"
                          value={formData.contactEmail}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Teléfono</label>
                        <input
                          type="text"
                          name="contactPhone"
                          value={formData.contactPhone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Dirección Física</label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                        />
                      </div>
                    </div>
                  </section>

                  <section className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-6">Redes Sociales</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Instagram</label>
                        <div className="relative">
                          <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                          <input
                            type="text"
                            name="socialLinks.instagram"
                            value={formData.socialLinks.instagram}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Facebook</label>
                        <div className="relative">
                          <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                          <input
                            type="text"
                            name="socialLinks.facebook"
                            value={formData.socialLinks.facebook}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">WhatsApp Business</label>
                        <div className="relative">
                          <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                          <input
                            type="text"
                            name="socialLinks.whatsapp"
                            value={formData.socialLinks.whatsapp}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </section>
                </motion.div>
              )}

              {activeTab === 'appearance' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <section className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-6">Tema Visual</h3>
                    <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl">
                      <div>
                        <p className="text-sm font-bold text-zinc-900 dark:text-white">Modo Oscuro</p>
                        <p className="text-xs text-zinc-500">Alternar entre tema claro y oscuro</p>
                      </div>
                      <button
                        onClick={toggleTheme}
                        className={`w-14 h-7 rounded-full transition-all relative ${
                          isDark ? 'bg-primary' : 'bg-zinc-300'
                        }`}
                      >
                        <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all ${
                          isDark ? 'left-8' : 'left-1'
                        }`} />
                      </button>
                    </div>
                  </section>

                  <section className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-6">Identidad Visual</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Logo de la Tienda</label>
                        <div className="aspect-square bg-zinc-50 dark:bg-zinc-800 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center p-4 text-center group cursor-pointer hover:border-primary transition-all">
                          {formData.logo ? (
                            <img src={formData.logo} className="w-full h-full object-contain" alt="Logo" />
                          ) : (
                            <Plus className="w-8 h-8 text-zinc-300" />
                          )}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Favicon (32x32)</label>
                        <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-800 rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex items-center justify-center cursor-pointer hover:border-primary transition-all">
                          {formData.favicon ? (
                            <img src={formData.favicon} className="w-8 h-8 object-contain" alt="Favicon" />
                          ) : (
                            <Plus className="w-5 h-5 text-zinc-300" />
                          )}
                        </div>
                      </div>
                    </div>
                  </section>
                </motion.div>
              )}

              {/* Other tabs would follow similar structure */}
              {['shipping', 'payments', 'notifications', 'security'].includes(activeTab) && (
                <div className="bg-white dark:bg-zinc-900 p-12 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm text-center">
                  <Zap className="w-12 h-12 text-primary/20 mx-auto mb-4" />
                  <h3 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tight">Próximamente</h3>
                  <p className="text-sm text-zinc-500">Esta sección de configuración estará disponible en la próxima actualización.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
