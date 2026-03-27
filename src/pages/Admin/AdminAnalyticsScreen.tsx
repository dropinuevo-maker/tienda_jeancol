import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, DollarSign, 
  ShoppingBag, Users, Eye, ArrowUpRight, 
  ArrowDownRight, Calendar, Filter, 
  Download, PieChart as PieChartIcon, 
  BarChart as BarChartIcon, LineChart as LineChartIcon,
  Activity, Target, Zap, Globe, Smartphone, Laptop
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, 
  PieChart, Pie, Cell, Line, ComposedChart, Legend
} from 'recharts';
import { useOrders } from '../../context/OrderContext';
import { useProducts } from '../../context/ProductContext';
import { useCategories } from '../../context/CategoryContext';
import { formatPriceCOP } from '../../lib/utils';

const COLORS = ['#FF6321', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

export const AdminAnalyticsScreen = () => {
  const { orders, stats, loading: ordersLoading } = useOrders();
  const { products, loading: productsLoading } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const isLoading = ordersLoading || productsLoading || categoriesLoading;

  if (isLoading) {
    return (
      <div className="p-4 lg:p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Cargando analíticas...</p>
        </div>
      </div>
    );
  }

  // Mock data for charts
  const salesData = useMemo(() => [
    { name: 'Lun', sales: 4000, orders: 24, users: 400 },
    { name: 'Mar', sales: 3000, orders: 18, users: 300 },
    { name: 'Mie', sales: 2000, orders: 12, users: 200 },
    { name: 'Jue', sales: 2780, orders: 16, users: 278 },
    { name: 'Vie', sales: 1890, orders: 11, users: 189 },
    { name: 'Sab', sales: 2390, orders: 14, users: 239 },
    { name: 'Dom', sales: 3490, orders: 21, users: 349 },
  ], []);

  const categoryData = useMemo(() => categories.map((cat, i) => ({
    name: cat.name,
    value: Math.floor(Math.random() * 100) + 20,
    color: COLORS[i % COLORS.length]
  })), [categories]);

  const deviceData = [
    { name: 'Mobile', value: 65, icon: Smartphone },
    { name: 'Desktop', value: 30, icon: Laptop },
    { name: 'Tablet', value: 5, icon: Globe },
  ];

  return (
    <div className="p-4 lg:p-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl lg:text-6xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter leading-none mb-4">
            Análisis de <span className="text-primary">Negocio</span>
          </h1>
          <p className="text-zinc-500 font-medium">Visualiza el rendimiento de tu tienda y toma decisiones basadas en datos.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-900 p-2 rounded-[32px] border border-zinc-200 dark:border-zinc-800">
            {(['7d', '30d', '90d', '1y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  timeRange === range 
                    ? 'bg-white dark:bg-zinc-800 text-primary shadow-sm' 
                    : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="p-4 bg-zinc-900 text-white rounded-2xl hover:bg-primary transition-all shadow-xl">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Ingresos Totales', value: `$${formatPriceCOP(stats.totalRevenue)}`, icon: DollarSign, trend: '+12.5%', isUp: true, color: 'text-green-500' },
          { label: 'Pedidos Realizados', value: stats.totalOrders, icon: ShoppingBag, trend: '+8.2%', isUp: true, color: 'text-blue-500' },
          { label: 'Nuevos Clientes', value: '1,284', icon: Users, trend: '-3.1%', isUp: false, color: 'text-red-500' },
          { label: 'Tasa de Conversión', value: '3.45%', icon: Target, trend: '+1.2%', isUp: true, color: 'text-amber-500' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-zinc-900 p-8 rounded-[40px] border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-2xl transition-all group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className={`w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                stat.isUp ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
              }`}>
                {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Sales Overview */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-10 rounded-[48px] border border-zinc-100 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <LineChartIcon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Ventas vs Pedidos</h3>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Ventas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Pedidos</span>
              </div>
            </div>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6321" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FF6321" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#999' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#999' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#18181b', 
                    border: 'none', 
                    borderRadius: '20px',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: '900'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#FF6321" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
                <Area type="monotone" dataKey="orders" stroke="#3B82F6" strokeWidth={4} fillOpacity={1} fill="url(#colorOrders)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white dark:bg-zinc-900 p-10 rounded-[48px] border border-zinc-100 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
              <PieChartIcon className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Categorías</h3>
          </div>

          <div className="h-[300px] w-full mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            {categoryData.map((cat, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-widest">{cat.name}</span>
                </div>
                <span className="text-xs font-black text-zinc-400">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Device Usage */}
        <div className="bg-zinc-900 p-10 rounded-[48px] text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-32 -mt-32" />
          
          <div className="flex items-center gap-3 mb-12 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight">Dispositivos</h3>
          </div>

          <div className="grid grid-cols-3 gap-6 relative z-10">
            {deviceData.map((device, i) => (
              <div key={i} className="text-center">
                <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 group hover:bg-primary transition-all cursor-default">
                  <device.icon className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                </div>
                <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">{device.name}</h4>
                <p className="text-3xl font-black text-white">{device.value}%</p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-3xl relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Optimización Mobile</span>
              <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Excelente</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="w-[92%] h-full bg-green-500 rounded-full" />
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-zinc-900 p-10 rounded-[48px] border border-zinc-100 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Productos Top</h3>
          </div>

          <div className="space-y-6">
            {products.slice(0, 4).map((product, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl group hover:bg-primary transition-all cursor-default">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700">
                    <img src={product.images?.[0] || product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight group-hover:text-white transition-colors">{product.name}</h4>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest group-hover:text-white/60 transition-colors">{product.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-zinc-900 dark:text-white group-hover:text-white transition-colors">{Math.floor(Math.random() * 100) + 50} Ventas</p>
                  <p className="text-[10px] font-black text-green-500 group-hover:text-white transition-colors">+15%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
