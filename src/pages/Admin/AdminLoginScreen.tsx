import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Lock, Mail, ArrowRight, Sparkles, 
  Zap, ShieldCheck, Eye, EyeOff,
  ShoppingBag, Globe, Smartphone, Laptop
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export const AdminLoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        toast.success('Bienvenido al Panel de Control');
        navigate('/admin');
      } else {
        toast.error('Credenciales incorrectas');
      }
    } catch (error) {
      toast.error('Error al iniciar sesión');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <div className="max-w-5xl w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)]">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-black text-white uppercase tracking-tighter">JEANCOL <span className="text-primary">Admin</span></span>
            </div>

            <h1 className="text-6xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-8">
              Controla <br />
              <span className="text-primary">Tu Imperio</span>
            </h1>

            <p className="text-xl text-zinc-400 font-medium mb-12 leading-relaxed">
              Accede al panel de control más avanzado para gestionar tu tienda, pedidos y clientes con la potencia de la IA.
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-3xl">
                <ShieldCheck className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1">Seguridad</h3>
                <p className="text-zinc-500 text-xs font-bold uppercase">Encriptación AES-256</p>
              </div>
              <div className="p-6 bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-3xl">
                <Zap className="w-8 h-8 text-amber-500 mb-4" />
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1">Velocidad</h3>
                <p className="text-zinc-500 text-xs font-bold uppercase">Tiempo Real</p>
              </div>
            </div>
          </motion.div>

          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-zinc-900/80 backdrop-blur-2xl border border-zinc-800 p-10 lg:p-16 rounded-[60px] shadow-2xl"
          >
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Acceso Restringido</span>
              </div>
              <h2 className="text-4xl font-black text-white uppercase tracking-tight mb-2">Iniciar Sesión</h2>
              <p className="text-zinc-500 font-medium">Ingresa tus credenciales de administrador.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-4">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@jeancol.com"
                    className="w-full pl-16 pr-8 py-5 bg-zinc-800/50 border border-zinc-700 rounded-3xl text-white font-medium outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between px-4">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Contraseña</label>
                  <button type="button" className="text-[10px] font-black text-primary uppercase tracking-widest hover:text-white transition-colors">¿Olvidaste tu contraseña?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-16 pr-16 py-5 bg-zinc-800/50 border border-zinc-700 rounded-3xl text-white font-medium outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-6 bg-primary text-white rounded-3xl text-sm font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Acceder al Panel <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </form>

            <div className="mt-12 pt-12 border-t border-zinc-800 flex items-center justify-center gap-8">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-zinc-600" />
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Desktop App</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-zinc-600" />
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Mobile Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-zinc-600" />
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Global CDN</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
