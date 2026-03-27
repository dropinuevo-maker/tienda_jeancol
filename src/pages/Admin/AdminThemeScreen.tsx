import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Palette, Moon, Sun, Monitor, 
  Layout, Type, Grid, List, 
  Check, Sparkles, Zap, Smartphone,
  Laptop, Tablet, RefreshCw, Save
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useStore } from '../../context/StoreContext';
import toast from 'react-hot-toast';

const PRIMARY_COLORS = [
  { name: 'Naranja Profesional', value: '#FF6321', class: 'bg-[#FF6321]' },
  { name: 'Azul Corporativo', value: '#3B82F6', class: 'bg-[#3B82F6]' },
  { name: 'Verde Esmeralda', value: '#10B981', class: 'bg-[#10B981]' },
  { name: 'Púrpura Real', value: '#8B5CF6', class: 'bg-[#8B5CF6]' },
  { name: 'Rosa Vibrante', value: '#EC4899', class: 'bg-[#EC4899]' },
  { name: 'Negro Elegante', value: '#18181B', class: 'bg-[#18181B]' },
];

const FONTS = [
  { name: 'Inter (Moderno)', value: 'Inter, sans-serif' },
  { name: 'Montserrat (Elegante)', value: 'Montserrat, sans-serif' },
  { name: 'Space Grotesk (Tech)', value: 'Space Grotesk, sans-serif' },
  { name: 'Playfair Display (Serif)', value: 'Playfair Display, serif' },
];

export const AdminThemeScreen = () => {
  const { theme, toggleTheme } = useTheme();
  const { config, updateConfig, loading } = useStore();
  const [selectedColor, setSelectedColor] = useState(config.primaryColor || '#FF6321');
  const [selectedFont, setSelectedFont] = useState('Inter, sans-serif');
  const [borderRadius, setBorderRadius] = useState('24px');
  const [isSaving, setIsSaving] = useState(false);

  if (loading) {
    return (
      <div className="p-4 lg:p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Cargando tema...</p>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateConfig({ primaryColor: selectedColor });
      toast.success('Configuración de tema guardada correctamente');
    } catch (error) {
      toast.error('Error al guardar la configuración');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl lg:text-6xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter leading-none mb-4">
            Personalizar <span className="text-primary">Apariencia</span>
          </h1>
          <p className="text-zinc-500 font-medium">Define la identidad visual de tu tienda y la experiencia del usuario.</p>
        </div>

        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-10 py-5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-[32px] text-sm font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl flex items-center gap-3 disabled:opacity-50"
        >
          {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Guardar Cambios
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Theme Controls */}
        <div className="lg:col-span-2 space-y-8">
          {/* Mode Selection */}
          <div className="bg-white dark:bg-zinc-900 p-10 rounded-[48px] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Monitor className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Modo de Visualización</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: 'light', name: 'Claro', icon: Sun, active: theme === 'light' },
                { id: 'dark', name: 'Oscuro', icon: Moon, active: theme === 'dark' },
                { id: 'system', name: 'Sistema', icon: Monitor, active: false },
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => mode.id !== 'system' && theme !== mode.id && toggleTheme()}
                  className={`p-8 rounded-[40px] border-2 transition-all text-center group ${
                    mode.active 
                      ? 'border-primary bg-primary/5' 
                      : 'border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700'
                  }`}
                >
                  <mode.icon className={`w-10 h-10 mx-auto mb-4 transition-transform group-hover:scale-110 ${
                    mode.active ? 'text-primary' : 'text-zinc-400'
                  }`} />
                  <span className={`text-xs font-black uppercase tracking-widest ${
                    mode.active ? 'text-primary' : 'text-zinc-400'
                  }`}>{mode.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette */}
          <div className="bg-white dark:bg-zinc-900 p-10 rounded-[48px] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                <Palette className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Color Primario</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {PRIMARY_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={`p-6 rounded-[32px] border-2 transition-all flex items-center gap-4 group ${
                    selectedColor === color.value 
                      ? 'border-primary bg-primary/5' 
                      : 'border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-2xl ${color.class} shadow-lg group-hover:scale-110 transition-transform`} />
                  <span className={`text-[10px] font-black uppercase tracking-widest ${
                    selectedColor === color.value ? 'text-primary' : 'text-zinc-400'
                  }`}>{color.name}</span>
                  {selectedColor === color.value && <Check className="w-5 h-5 text-primary ml-auto" />}
                </button>
              ))}
            </div>
          </div>

          {/* Typography & Layout */}
          <div className="bg-white dark:bg-zinc-900 p-10 rounded-[48px] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                <Type className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Tipografía y Bordes</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4 block">Fuente Principal</label>
                <div className="space-y-3">
                  {FONTS.map((font) => (
                    <button
                      key={font.value}
                      onClick={() => setSelectedFont(font.value)}
                      className={`w-full p-5 rounded-2xl border-2 transition-all text-left flex items-center justify-between group ${
                        selectedFont === font.value 
                          ? 'border-primary bg-primary/5' 
                          : 'border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700'
                      }`}
                      style={{ fontFamily: font.value }}
                    >
                      <span className={`text-sm font-bold ${selectedFont === font.value ? 'text-primary' : 'text-zinc-900 dark:text-white'}`}>
                        {font.name}
                      </span>
                      {selectedFont === font.value && <Check className="w-4 h-4 text-primary" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4 block">Redondeo de Bordes</label>
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-zinc-900 dark:text-white">{borderRadius}</span>
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Suavidad</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="60" 
                    step="4"
                    value={parseInt(borderRadius)}
                    onChange={(e) => setBorderRadius(`${e.target.value}px`)}
                    className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full appearance-none cursor-pointer accent-primary"
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <div className="aspect-square bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700" style={{ borderRadius: '0px' }} />
                    <div className="aspect-square bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700" style={{ borderRadius: '16px' }} />
                    <div className="aspect-square bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700" style={{ borderRadius: '32px' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="space-y-8">
          <div className="bg-zinc-900 p-10 rounded-[48px] text-white sticky top-8">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight">Vista Previa</h3>
            </div>

            <div className="space-y-8">
              {/* Card Preview */}
              <div className="bg-white dark:bg-zinc-800 rounded-[32px] p-6 shadow-2xl overflow-hidden group">
                <div className="aspect-[4/3] bg-zinc-100 dark:bg-zinc-700 rounded-2xl mb-4 relative overflow-hidden">
                  <div className="absolute top-3 left-3 px-3 py-1 bg-primary text-white text-[8px] font-black uppercase rounded-full">Nuevo</div>
                </div>
                <h4 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-1">Producto de Ejemplo</h4>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Categoría</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-zinc-900 dark:text-white" style={{ color: selectedColor }}>$120.000</span>
                  <button className="p-3 rounded-2xl text-white transition-all" style={{ backgroundColor: selectedColor }}>
                    <Zap className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Button Previews */}
              <div className="space-y-4">
                <button className="w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-white shadow-lg transition-all" style={{ backgroundColor: selectedColor }}>
                  Botón Primario
                </button>
                <button className="w-full py-4 rounded-2xl text-xs font-black uppercase tracking-widest border-2 transition-all" style={{ borderColor: selectedColor, color: selectedColor }}>
                  Botón Secundario
                </button>
              </div>

              {/* Device Icons */}
              <div className="flex items-center justify-center gap-6 pt-6 border-t border-white/10">
                <Smartphone className="w-5 h-5 text-white/40" />
                <Tablet className="w-5 h-5 text-white/40" />
                <Laptop className="w-5 h-5 text-white/40" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
