import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, Save, X, Image as ImageIcon, Video, 
  Sparkles, Trash2, PlusCircle, Check, AlertCircle,
  ChevronRight, ArrowLeft, Package, Tag, Info,
  Layers, Ruler, Truck, Palette, Layout
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AdminNavigation } from '../../components/AdminNavigation';
import { useProducts } from '../../context/ProductContext';
import { useCategories } from '../../context/CategoryContext';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';
import { generateAIDescription, generateAIFeatures, generateVariations } from '../../utils/productGenerator';
import { compressImage, MAX_VIDEO_SIZE } from '../../utils/imageUtils';

export const AdminNewProductScreen = () => {
  const navigate = useNavigate();
  const { addProduct } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const { success, error, loading, dismiss } = useToast();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (categoriesLoading) {
    return (
      <div className="pb-24 lg:pb-10 flex flex-col lg:flex-row min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <AdminNavigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Cargando formulario...</p>
          </div>
        </main>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    offerPrice: 0,
    category: '',
    stock: 0,
    sku: '',
    brand: '',
    material: '',
    weight: '',
    dimensions: '',
    featured: false,
    new: true,
    trending: false,
    active: true,
    sizeGuideType: 'standard',
    image: '',
    images: [] as string[],
    video: '',
    colors: [] as string[],
    sizes: [] as string[],
    variations: [] as any[]
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleAddColor = (color: string) => {
    if (color && !formData.colors.includes(color)) {
      setFormData(prev => ({ ...prev, colors: [...prev.colors, color] }));
    }
  };

  const handleRemoveColor = (color: string) => {
    setFormData(prev => ({ ...prev, colors: prev.colors.filter(c => c !== color) }));
  };

  const handleAddSize = (size: string) => {
    if (size && !formData.sizes.includes(size)) {
      setFormData(prev => ({ ...prev, sizes: [...prev.sizes, size] }));
    }
  };

  const handleRemoveSize = (size: string) => {
    setFormData(prev => ({ ...prev, sizes: prev.sizes.filter(s => s !== size) }));
  };

  const generateAIDescriptionWithIA = async () => {
    if (!formData.name) {
      error('Por favor ingresa el nombre del producto primero');
      return;
    }

    setIsGenerating(true);
    const toastId = loading('Generando descripción con IA...');

    try {
      const description = await generateAIDescription(formData.name, formData.brand);
      setFormData(prev => ({ ...prev, description }));
      success('Descripción generada con éxito');
    } catch (err) {
      error('Error al generar descripción');
    } finally {
      setIsGenerating(false);
      dismiss(toastId);
    }
  };

  const generateAIFeaturesWithIA = async () => {
    if (!formData.name) {
      error('Por favor ingresa el nombre del producto primero');
      return;
    }

    setIsGenerating(true);
    const toastId = loading('Generando características con IA...');

    try {
      const features = await generateAIFeatures(formData.name, formData.category);
      // Convert array of features to string if needed, or update how it's stored
      // For now, let's assume features is a string in the form
      setFormData(prev => ({ ...prev, description: prev.description + '\n\nCaracterísticas:\n' + features.join('\n') }));
      success('Características generadas con éxito');
    } catch (err) {
      error('Error al generar características');
    } finally {
      setIsGenerating(false);
      dismiss(toastId);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.price) {
      error('Por favor completa los campos obligatorios');
      return;
    }

    const toastId = loading('Guardando producto...');
    try {
      await addProduct({
        ...formData,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        image: formData.image || 'https://picsum.photos/seed/product/600/800',
        images: formData.images.length > 0 ? formData.images : ['https://picsum.photos/seed/product/600/800'],
      });
      success('Producto creado con éxito');
      navigate('/admin/inventory');
    } catch (err) {
      error('Error al crear producto');
    } finally {
      dismiss(toastId);
    }
  };

  return (
    <div className="pb-24 lg:pb-10 flex flex-col lg:flex-row min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <AdminNavigation />
      <div className="flex-1">
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 h-16 lg:h-20 flex items-center px-4 lg:px-8">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-zinc-500" />
              </button>
              <div>
                <h1 className="text-lg lg:text-xl font-black text-zinc-900 dark:text-white">Nuevo Producto</h1>
                <p className="text-xs text-zinc-500">Agrega un nuevo artículo a tu catálogo</p>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Guardar Producto</span>
            </button>
          </div>
        </header>

        <main className="p-4 lg:p-8 max-w-5xl mx-auto">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column: Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Info className="w-5 h-5 text-primary" />
                  <h2 className="font-black text-zinc-900 dark:text-white uppercase tracking-wider text-sm">Información General</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1.5">Nombre del Producto *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Ej: Jeans Slim Fit Azul"
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-zinc-500 uppercase">Descripción</label>
                      <button
                        type="button"
                        onClick={generateAIDescriptionWithIA}
                        disabled={isGenerating}
                        className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase hover:underline disabled:opacity-50"
                      >
                        <Sparkles className="w-3 h-3" />
                        Generar con IA
                      </button>
                    </div>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={5}
                      placeholder="Describe las características, estilo y beneficios..."
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase mb-1.5">Categoría *</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                        required
                      >
                        <option value="">Seleccionar...</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-500 uppercase mb-1.5">Marca</label>
                      <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        placeholder="Ej: JEANCOL"
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Tag className="w-5 h-5 text-primary" />
                  <h2 className="font-black text-zinc-900 dark:text-white uppercase tracking-wider text-sm">Precios e Inventario</h2>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1.5">Precio Base *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">$</span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full pl-8 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1.5">Precio Oferta</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">$</span>
                      <input
                        type="number"
                        name="offerPrice"
                        value={formData.offerPrice}
                        onChange={handleInputChange}
                        className="w-full pl-8 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1.5">Stock Total *</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                      required
                    />
                  </div>
                </div>
              </section>

              <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Palette className="w-5 h-5 text-primary" />
                  <h2 className="font-black text-zinc-900 dark:text-white uppercase tracking-wider text-sm">Variaciones y Tallas</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-3">Tallas Disponibles</label>
                    <div className="flex flex-wrap gap-2">
                      {['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36'].map(size => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => formData.sizes.includes(size) ? handleRemoveSize(size) : handleAddSize(size)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            formData.sizes.includes(size)
                              ? 'bg-primary text-white shadow-lg shadow-primary/20'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-3">Colores</label>
                    <div className="flex flex-wrap gap-3">
                      {['#000000', '#FFFFFF', '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#6366f1', '#a855f7'].map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => formData.colors.includes(color) ? handleRemoveColor(color) : handleAddColor(color)}
                          className={`w-8 h-8 rounded-full border-2 transition-all ${
                            formData.colors.includes(color)
                              ? 'border-primary scale-110 shadow-lg'
                              : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Media & Settings */}
            <div className="space-y-6">
              <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  <h2 className="font-black text-zinc-900 dark:text-white uppercase tracking-wider text-sm">Multimedia</h2>
                </div>

                <div className="space-y-4">
                  <div className="aspect-[3/4] bg-zinc-100 dark:bg-zinc-800 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 flex flex-col items-center justify-center p-4 text-center group cursor-pointer hover:border-primary transition-all">
                    {formData.image ? (
                      <img src={formData.image} className="w-full h-full object-cover rounded-xl" alt="Preview" />
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <Plus className="w-6 h-6 text-zinc-500" />
                        </div>
                        <p className="text-xs font-bold text-zinc-500 uppercase">Imagen Principal</p>
                        <p className="text-[10px] text-zinc-400 mt-1">Sube una imagen 600x800</p>
                      </>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="aspect-square bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-700 flex items-center justify-center cursor-pointer hover:border-primary transition-all">
                        <Plus className="w-4 h-4 text-zinc-400" />
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Layout className="w-5 h-5 text-primary" />
                  <h2 className="font-black text-zinc-900 dark:text-white uppercase tracking-wider text-sm">Configuración</h2>
                </div>

                <div className="space-y-4">
                  {[
                    { id: 'active', label: 'Producto Activo', desc: 'Visible en la tienda' },
                    { id: 'featured', label: 'Destacado', desc: 'Aparece en inicio' },
                    { id: 'new', label: 'Nuevo', desc: 'Etiqueta de novedad' },
                    { id: 'trending', label: 'Tendencia', desc: 'Etiqueta de popular' },
                  ].map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                      <div>
                        <p className="text-xs font-bold text-zinc-900 dark:text-white">{item.label}</p>
                        <p className="text-[10px] text-zinc-500">{item.desc}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCheckboxChange(item.id, !formData[item.id as keyof typeof formData])}
                        className={`w-10 h-5 rounded-full transition-all relative ${
                          formData[item.id as keyof typeof formData] ? 'bg-primary' : 'bg-zinc-300 dark:bg-zinc-700'
                        }`}
                      >
                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${
                          formData[item.id as keyof typeof formData] ? 'left-6' : 'left-1'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};
