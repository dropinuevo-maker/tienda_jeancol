import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Camera, 
  Shield, Key, LogOut, Save, Bell,
  Globe, Smartphone, CreditCard, ShoppingBag,
  Star, Activity, Clock, ArrowRight,
  CheckCircle, AlertCircle, Trash2, Edit2,
  Lock, Eye, EyeOff, Zap, Layout, Settings
} from 'lucide-react';
import { AdminNavigation } from '../../components/AdminNavigation';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTheme } from '../../context/ThemeContext';

export const AdminProfileScreen = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const { success, error, loading, dismiss } = useToast();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'Administrador',
    email: user?.email || 'admin@jeancol.com',
    phone: '+57 300 123 4567',
    role: 'Super Admin',
    avatar: 'https://picsum.photos/seed/admin/200/200'
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex">
        <AdminNavigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-black uppercase tracking-widest text-zinc-500">Cargando perfil...</p>
          </div>
        </main>
      </div>
    );
  }

  const handleSave = async () => {
    const toastId = loading('Actualizando perfil...');
    try {
      // Logic to update profile
      setIsEditing(false);
      success('Perfil actualizado con éxito');
    } catch (err) {
      error('Error al actualizar perfil');
    } finally {
      dismiss(toastId);
    }
  };

  const stats = [
    { label: 'Ventas Gestionadas', value: '1,240', icon: ShoppingBag, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Calificación', value: '4.9', icon: Star, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Actividad', value: '98%', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="pb-24 lg:pb-10 flex flex-col lg:flex-row min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <AdminNavigation />
      <div className="flex-1">
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 h-16 lg:h-20 flex items-center px-4 lg:px-8">
          <div className="flex items-center justify-between w-full">
            <div>
              <h1 className="text-lg lg:text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Mi Perfil</h1>
              <p className="text-xs text-zinc-500 font-medium">Gestiona tu información personal</p>
            </div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-xs font-black uppercase text-zinc-500 hover:bg-zinc-200 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-black shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>Guardar</span>
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white px-5 py-2.5 rounded-xl text-sm font-black hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Editar Perfil</span>
                </button>
              )}
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Profile Card */}
            <div className="space-y-6">
              <section className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl text-center">
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="w-full h-full rounded-3xl overflow-hidden border-4 border-white dark:border-zinc-800 shadow-2xl">
                    <img src={formData.avatar} alt={formData.name} className="w-full h-full object-cover" />
                  </div>
                  {isEditing && (
                    <button className="absolute -bottom-2 -right-2 p-2.5 bg-primary text-white rounded-xl shadow-lg hover:scale-110 transition-all">
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <h2 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">{formData.name}</h2>
                <p className="text-xs font-black text-primary uppercase tracking-widest mt-1">{formData.role}</p>
                
                <div className="mt-8 pt-8 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Email</p>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white">{formData.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center">
                      <Phone className="w-4 h-4 text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Teléfono</p>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white">{formData.phone}</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={signOut}
                  className="w-full mt-8 flex items-center justify-center gap-2 p-4 bg-red-50 dark:bg-red-900/10 text-red-600 rounded-2xl text-sm font-black uppercase hover:bg-red-100 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </section>

              <section className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-6">Estadísticas de Usuario</h3>
                <div className="space-y-4">
                  {stats.map((stat, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                          <stat.icon className={`w-4 h-4 ${stat.color}`} />
                        </div>
                        <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">{stat.label}</span>
                      </div>
                      <span className="text-sm font-black text-zinc-900 dark:text-white">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column: Settings & Details */}
            <div className="lg:col-span-2 space-y-6">
              <section className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-6">Información Personal</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Nombre Completo</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Email</label>
                    <input
                      type="email"
                      disabled={!isEditing}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Teléfono</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Rol de Usuario</label>
                    <input
                      type="text"
                      disabled
                      value={formData.role}
                      className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm opacity-50 cursor-not-allowed"
                    />
                  </div>
                </div>
              </section>

              <section className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-6">Seguridad</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center">
                        <Key className="w-5 h-5 text-zinc-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-900 dark:text-white">Contraseña</p>
                        <p className="text-xs text-zinc-500">Cambia tu contraseña de acceso</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl text-[10px] font-black uppercase hover:bg-zinc-50 transition-all">
                      Cambiar
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-zinc-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-900 dark:text-white">Autenticación de 2 Pasos</p>
                        <p className="text-xs text-zinc-500">Añade una capa extra de seguridad</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase hover:scale-105 transition-all">
                      Activar
                    </button>
                  </div>
                </div>
              </section>

              <section className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-6">Actividad Reciente</h3>
                <div className="space-y-4">
                  {[
                    { action: 'Inicio de sesión exitoso', device: 'Chrome en Windows', time: 'Hace 10 minutos', icon: CheckCircle, color: 'text-emerald-500' },
                    { action: 'Actualización de inventario', device: 'App Móvil', time: 'Hace 2 horas', icon: Zap, color: 'text-primary' },
                    { action: 'Cambio de contraseña', device: 'Chrome en Windows', time: 'Hace 3 días', icon: AlertCircle, color: 'text-amber-500' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all">
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-zinc-900 dark:text-white">{item.action}</p>
                        <p className="text-xs text-zinc-500">{item.device}</p>
                      </div>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase">{item.time}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
