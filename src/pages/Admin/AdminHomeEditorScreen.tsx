import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Layout, Image as ImageIcon, Type, 
  Plus, Trash2, MoveUp, MoveDown, 
  Save, RefreshCw, Sparkles, Zap,
  Smartphone, Laptop, Tablet, Eye
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useStore } from '../../context/StoreContext';

export const AdminHomeEditorScreen = () => {
  const { config, updateConfig, loading } = useStore();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateConfig(config);
      toast.success('Configuración de inicio guardada');
    } catch (error) {
      toast.error('Error al guardar');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Cargando editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl lg:text-6xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter leading-none mb-4">
            Editor de <span className="text-primary">Inicio</span>
          </h1>
          <p className="text-zinc-500 font-medium">Personaliza los banners, secciones y contenido de tu página principal.</p>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:text-primary rounded-2xl transition-all">
            <Eye className="w-6 h-6" />
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-10 py-5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-[32px] text-sm font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl flex items-center gap-3 disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Guardar Cambios
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Controls */}
        <div className="lg:col-span-2 space-y-8">
          {/* Hero Banners */}
          <div className="bg-white dark:bg-zinc-900 p-10 rounded-[48px] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Banners Principales</h3>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                <Plus className="w-4 h-4" /> Añadir Banner
              </button>
            </div>

            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="p-8 bg-zinc-50 dark:bg-zinc-800/50 rounded-[40px] border border-zinc-100 dark:border-zinc-700 group">
                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-48 aspect-video lg:aspect-square bg-zinc-200 dark:bg-zinc-700 rounded-3xl overflow-hidden relative">
                      <img src={`https://picsum.photos/seed/banner-${i}/400/400`} alt="Banner" className="w-full h-full object-cover" />
                      <button className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-black uppercase tracking-widest">
                        Cambiar Imagen
                      </button>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-4">Título Principal</label>
                          <input type="text" defaultValue="Nueva Colección 2026" className="w-full px-6 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-primary/10" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-4">Subtítulo</label>
                          <input type="text" defaultValue="Descubre lo último en tendencia" className="w-full px-6 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-primary/10" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-4">Texto Botón</label>
                          <input type="text" defaultValue="Comprar Ahora" className="w-full px-6 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-primary/10" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-4">Enlace (URL)</label>
                          <input type="text" defaultValue="/products" className="w-full px-6 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-xs font-bold outline-none focus:ring-4 focus:ring-primary/10" />
                        </div>
                      </div>
                    </div>
                    <div className="flex lg:flex-col gap-2">
                      <button className="p-3 bg-white dark:bg-zinc-900 rounded-xl text-zinc-400 hover:text-primary transition-all shadow-sm"><MoveUp className="w-4 h-4" /></button>
                      <button className="p-3 bg-white dark:bg-zinc-900 rounded-xl text-zinc-400 hover:text-primary transition-all shadow-sm"><MoveDown className="w-4 h-4" /></button>
                      <button className="p-3 bg-white dark:bg-zinc-900 rounded-xl text-zinc-400 hover:text-red-500 transition-all shadow-sm"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Sections */}
          <div className="bg-white dark:bg-zinc-900 p-10 rounded-[48px] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                  <Layout className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Secciones Destacadas</h3>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { name: 'Categorías Populares', active: true },
                { name: 'Productos en Oferta', active: true },
                { name: 'Nuevos Arribos', active: true },
                { name: 'Testimonios de Clientes', active: false },
                { name: 'Blog / Noticias', active: false },
              ].map((section, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl border border-zinc-100 dark:border-zinc-700">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center font-black text-zinc-400">{i + 1}</div>
                    <span className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight">{section.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      section.active ? 'bg-primary text-white' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500'
                    }`}>
                      {section.active ? 'Activo' : 'Inactivo'}
                    </button>
                    <button className="p-3 bg-white dark:bg-zinc-900 rounded-xl text-zinc-400 hover:text-primary transition-all shadow-sm">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview Sidebar */}
        <div className="space-y-8">
          <div className="bg-zinc-900 p-10 rounded-[48px] text-white sticky top-8">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight">Previsualización</h3>
            </div>

            <div className="aspect-[9/16] bg-zinc-800 rounded-[40px] border-8 border-zinc-700 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-full overflow-y-auto no-scrollbar">
                {/* Mock Mobile App Header */}
                <div className="p-6 flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-primary" />
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/10" />
                    <div className="w-6 h-6 rounded-full bg-white/10" />
                  </div>
                </div>
                
                {/* Mock Banner */}
                <div className="px-6 mb-8">
                  <div className="aspect-video bg-zinc-700 rounded-3xl relative overflow-hidden">
                    <img src="https://picsum.photos/seed/banner-1/400/225" className="w-full h-full object-cover opacity-50" />
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <div className="w-24 h-2 bg-primary rounded-full mb-2" />
                      <div className="w-16 h-2 bg-white/20 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Mock Categories */}
                <div className="px-6 mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <div className="w-20 h-3 bg-white/20 rounded-full" />
                    <div className="w-10 h-2 bg-primary/40 rounded-full" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="aspect-square bg-zinc-700 rounded-2xl" />
                    <div className="aspect-square bg-zinc-700 rounded-2xl" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 mt-10 text-white/40">
              <Smartphone className="w-5 h-5 text-primary" />
              <Tablet className="w-5 h-5" />
              <Laptop className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
