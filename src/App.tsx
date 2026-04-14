/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useNavigate 
} from 'react-router-dom';
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  X, 
  ChevronRight, 
  MapPin, 
  Phone, 
  User, 
  CheckCircle2, 
  Clock,
  ExternalLink,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  updateDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { db, auth } from './firebase';
import { cn } from './lib/utils';
import { MenuItem, CartItem, Order, CATEGORIES, STAFF_WHATSAPP } from './types';
import { INITIAL_MENU } from './data';

// --- Helpers ---
const formatPhone = (phone: string) => {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) cleaned = cleaned.substring(1);
  if (!cleaned.startsWith('966')) cleaned = '966' + cleaned;
  return cleaned;
};

const generateWhatsAppLink = (order: Order) => {
  const phone = formatPhone(order.customerPhone);
  const itemsList = order.items.map(i => `${i.nameAr} x${i.quantity}`).join(', ');
  const message = `أهلاً ${order.customerName}، نؤكد استلام طلبك من ماكولاتي: ${itemsList}. المجموع: ${order.total} ريال. هل تود التأكيد؟`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};

// --- Components ---

const Navbar = ({ cartCount, onOpenCart }: { cartCount: number; onOpenCart: () => void }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-secondary/80 backdrop-blur-lg border-b border-white/5 px-4 py-3 md:py-4">
    <div className="max-w-7xl mx-auto flex justify-between items-center flex-row-reverse">
      {/* Cart on the Right */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenCart}
          className="relative p-2.5 md:p-3 bg-primary rounded-xl hover:scale-105 transition-transform shadow-lg shadow-primary/20"
        >
          <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-secondary" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-red-500 text-white text-[8px] md:text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-secondary">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Navigation Links (Desktop) */}
      <div className="hidden md:flex items-center gap-8 font-bold text-sm">
        <Link to="/" className="text-white hover:text-primary transition-colors">الرئيسية</Link>
        <a href="#menu" className="text-white/60 hover:text-primary transition-colors">القائمة</a>
        <Link to="/staff" className="text-white/60 hover:text-primary transition-colors">لماذا مأكولاتي</Link>
        <a href={`https://wa.me/${formatPhone(STAFF_WHATSAPP)}`} className="text-white/60 hover:text-primary transition-colors">تواصل معنا</a>
      </div>

      {/* Logo on the Left */}
      <Link to="/" className="flex items-center gap-2 md:gap-3">
        <div className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center bg-primary rounded-xl overflow-hidden p-1 shadow-lg shadow-primary/20">
          <img 
            src="/logo.png" 
            alt="مأكولاتي" 
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Fallback to a high-quality SVG if logo.png is missing
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.innerHTML = `<svg viewBox="0 0 100 100" class="w-full h-full text-secondary fill-current"><path d="M20 80V40l30 20 30-20v40H20zM50 10L20 30v10l30 20 30-20V30L50 10z"/></svg>`;
              }
            }}
          />
        </div>
        <span className="font-black text-xl md:text-2xl tracking-tighter text-primary">مأكولاتي</span>
      </Link>
    </div>
  </nav>
);

const MenuCard = ({ item, onAdd }: { item: MenuItem; onAdd: (item: MenuItem, size?: string) => void; key?: string }) => {
  const [selectedSize, setSelectedSize] = useState(item.sizes?.[0]?.name);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-3xl overflow-hidden flex flex-col group"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={item.image} alt={item.nameEn} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent opacity-60" />
        {item.calories && (
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold border border-white/10">
            {item.calories} Kcal
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-grow relative -mt-8 bg-secondary/80 backdrop-blur-xl rounded-t-3xl border-t border-white/10">
        <div className="mb-4 text-right">
          <h3 className="font-black text-xl leading-tight text-primary mb-1">{item.nameAr}</h3>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest">{item.nameEn}</p>
        </div>
        
        {item.sizes && (
          <div className="flex gap-2 mb-6">
            {item.sizes.map(s => (
              <button
                key={s.name}
                onClick={() => setSelectedSize(s.name)}
                className={cn(
                  "flex-1 py-2 rounded-xl text-xs font-black transition-all border",
                  selectedSize === s.name ? "bg-primary text-secondary border-primary shadow-lg shadow-primary/20" : "bg-white/5 text-white/40 border-white/10"
                )}
              >
                {s.name}
              </button>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-primary font-black text-2xl">
              {item.sizes ? item.sizes.find(s => s.name === selectedSize)?.price : item.price}
              <span className="text-xs mr-1 font-bold">SR</span>
            </span>
          </div>
          <button 
            onClick={() => onAdd(item, selectedSize)}
            className="w-12 h-12 bg-primary text-secondary rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-primary/20"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const CartDrawer = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQty, 
  onCheckout 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  items: CartItem[]; 
  onUpdateQty: (id: string, size: string | undefined, delta: number) => void;
  onCheckout: () => void;
}) => {
  const total = items.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
          />
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            className="fixed top-0 left-0 bottom-0 w-full max-w-md bg-secondary z-[70] shadow-2xl flex flex-col border-r border-white/10"
          >
            <div className="p-8 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-3xl font-black text-primary">سلة الطلبات</h2>
              <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full transition-colors"><X /></button>
            </div>

            <div className="flex-grow overflow-y-auto p-8 space-y-8">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-white/10">
                  <ShoppingBag className="w-24 h-24 mb-6" />
                  <p className="font-black text-xl">السلة فارغة حالياً</p>
                </div>
              ) : (
                items.map((item, idx) => (
                  <div key={`${item.id}-${item.selectedSize}-${idx}`} className="flex gap-6">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 shadow-xl">
                      <img src={item.image} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow text-right">
                      <h4 className="font-black text-lg leading-tight mb-1">{item.nameAr}</h4>
                      {item.selectedSize && <p className="text-xs text-primary font-black mb-3">{item.selectedSize}</p>}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-4 bg-white/5 rounded-xl p-1.5 border border-white/5">
                          <button onClick={() => onUpdateQty(item.id, item.selectedSize, -1)} className="p-1 hover:text-primary transition-colors"><Minus className="w-4 h-4" /></button>
                          <span className="font-black text-sm w-4 text-center">{item.quantity}</span>
                          <button onClick={() => onUpdateQty(item.id, item.selectedSize, 1)} className="p-1 hover:text-primary transition-colors"><Plus className="w-4 h-4" /></button>
                        </div>
                        <span className="font-black text-xl text-primary">{item.finalPrice * item.quantity} SR</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-8 border-t border-white/10 bg-white/5 backdrop-blur-xl">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-white/40 font-black text-lg">المجموع الكلي</span>
                  <span className="text-4xl font-black text-primary">{total} SR</span>
                </div>
                <button 
                  onClick={onCheckout}
                  className="w-full py-5 yellow-gradient text-secondary font-black rounded-2xl text-xl shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  إتمام الطلب
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const CheckoutModal = ({ 
  isOpen, 
  onClose, 
  onSubmit 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (data: any) => void 
}) => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    type: 'pickup' as 'pickup' | 'delivery',
    maps: ''
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
        onClick={onClose}
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-lg glass rounded-[3rem] p-10 overflow-hidden border border-white/10 shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -z-10" />
        <h2 className="text-4xl font-black text-primary mb-8 text-right">بيانات العميل</h2>
        <div className="space-y-8 text-right">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2 justify-end">
              الاسم الكامل <User className="w-3 h-3" />
            </label>
            <input 
              type="text" 
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary transition-all text-right font-bold"
              placeholder="أدخل اسمك هنا..."
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2 justify-end">
              رقم الجوال (واتساب) <Phone className="w-3 h-3" />
            </label>
            <input 
              type="tel" 
              value={form.phone}
              onChange={e => setForm({...form, phone: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary transition-all text-right font-bold"
              placeholder="05xxxxxxxx"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] text-right block">نوع الطلب</label>
            <div className="flex gap-4">
              <button 
                onClick={() => setForm({...form, type: 'pickup'})}
                className={cn(
                  "flex-1 py-4 rounded-2xl font-black border transition-all",
                  form.type === 'pickup' ? "bg-primary text-secondary border-primary shadow-lg shadow-primary/20" : "bg-white/5 border-white/10 text-white/40"
                )}
              >
                استلام من الفرع
              </button>
              <button 
                onClick={() => setForm({...form, type: 'delivery'})}
                className={cn(
                  "flex-1 py-4 rounded-2xl font-black border transition-all",
                  form.type === 'delivery' ? "bg-primary text-secondary border-primary shadow-lg shadow-primary/20" : "bg-white/5 border-white/10 text-white/40"
                )}
              >
                توصيل للمنزل
              </button>
            </div>
          </div>

          {form.type === 'delivery' && (
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2 justify-end">
                رابط قوقل ماب <MapPin className="w-3 h-3" />
              </label>
              <input 
                type="url" 
                value={form.maps}
                onChange={e => setForm({...form, maps: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary transition-all text-right font-bold"
                placeholder="https://goo.gl/maps/..."
              />
            </div>
          )}

          <button 
            disabled={!form.name || !form.phone}
            onClick={() => onSubmit(form)}
            className="w-full py-5 yellow-gradient text-secondary font-black rounded-2xl text-xl shadow-2xl shadow-primary/20 disabled:opacity-50 disabled:grayscale transition-all mt-4"
          >
            تأكيد وإرسال الطلب
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const CategoryBar = ({ active, onChange }: { active: string; onChange: (id: string) => void }) => {
  const icons: Record<string, string> = {
    shawarma: '🌯',
    pizza: '🍕',
    pasta: '🍝',
    sandwiches: '🍔',
    pastries: '🥟',
    meals: '🍱',
    appetizers: '🥗',
    all: '🍽️'
  };

  return (
    <div className="flex gap-6 md:gap-8 overflow-x-auto pb-10 no-scrollbar px-8 snap-x snap-mandatory cursor-grab active:cursor-grabbing">
      {[{ id: 'all', nameAr: 'الكل' }, ...CATEGORIES].map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className="flex flex-col items-center gap-3 md:gap-4 group transition-all shrink-0 snap-center"
        >
          <div className={cn(
            "w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-3xl md:text-4xl transition-all shadow-xl",
            active === cat.id ? "bg-primary scale-110 shadow-primary/20" : "bg-white/5 hover:bg-white/10"
          )}>
            {icons[cat.id] || '🍴'}
          </div>
          <span className={cn(
            "text-xs md:text-sm font-bold transition-colors",
            active === cat.id ? "text-primary" : "text-white/40"
          )}>
            {cat.nameAr}
          </span>
        </button>
      ))}
    </div>
  );
};

const Home = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const filteredMenu = INITIAL_MENU.filter(item => 
    activeCategory === 'all' || item.category === activeCategory
  );

  const addToCart = (item: MenuItem, size?: string) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id && i.selectedSize === size);
      const price = size ? item.sizes?.find(s => s.name === size)?.price || item.price : item.price;
      
      if (existing) {
        return prev.map(i => 
          (i.id === item.id && i.selectedSize === size) 
            ? { ...i, quantity: i.quantity + 1 } 
            : i
        );
      }
      return [...prev, { ...item, quantity: 1, selectedSize: size, finalPrice: price }];
    });
    setIsCartOpen(true);
  };

  const updateQty = (id: string, size: string | undefined, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id && i.selectedSize === size) {
        const newQty = Math.max(0, i.quantity + delta);
        return { ...i, quantity: newQty };
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  const handleCheckout = async (formData: any) => {
    const total = cart.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);
    const orderData: Order = {
      customerName: formData.name,
      customerPhone: formData.phone,
      orderType: formData.type,
      googleMapsLink: formData.maps,
      items: cart,
      total,
      status: 'pending',
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, 'orders'), orderData);
      setCart([]);
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
      alert('تم إرسال طلبك بنجاح! سنتواصل معك قريباً.');
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء إرسال الطلب.');
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Navbar cartCount={cart.reduce((s, i) => s + i.quantity, 0)} onOpenCart={() => setIsCartOpen(true)} />
      
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1920&q=80" 
            className="w-full h-full object-cover"
            alt="Hero Background"
          />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary text-xs font-black mb-8 border border-primary/20"
          >
            🔥 مرحباً بكم في ماكولاتي
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-7xl md:text-9xl font-black mb-6 md:mb-10 leading-tight tracking-normal px-2"
          >
            ذوق أصيل،<br />
            <span className="text-primary">تجربة لا تُنسى</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl font-bold text-white/60 mb-10 md:mb-16 max-w-3xl mx-auto tracking-wide leading-relaxed px-4 text-center"
          >
            شاورما | بيتزا | باستا | برجر | فطاير <br className="md:hidden" /> كلها بنكهة ماكولاتي المميزة
          </motion.p>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-stretch md:items-center max-w-[320px] sm:max-w-md md:max-w-none mx-auto px-4">
            <a 
              href="#menu"
              className="px-8 md:px-12 py-4 md:py-5 bg-primary text-secondary font-black rounded-2xl text-lg md:text-xl shadow-2xl shadow-primary/40 hover:scale-105 transition-transform flex items-center justify-center gap-3"
            >
              🍽️ تصفح القائمة
            </a>
            <a 
              href={`https://wa.me/${formatPhone(STAFF_WHATSAPP)}`}
              className="px-8 md:px-12 py-4 md:py-5 glass text-white font-black rounded-2xl text-lg md:text-xl hover:bg-white/20 transition-all flex items-center justify-center gap-3"
            >
              📱 اطلب عبر واتساب
            </a>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-8">
          <div className="text-center md:text-right">
            <h2 className="text-4xl font-black text-primary">قائمة الطعام</h2>
            <p className="text-white/40 font-bold">اختر وجبتك المفضلة من أصنافنا المتنوعة</p>
          </div>
          
          <div className="w-full md:w-auto">
            <CategoryBar active={activeCategory} onChange={setActiveCategory} />
          </div>
        </div>
        
        <div className="flex overflow-x-auto gap-6 md:gap-10 pb-12 no-scrollbar snap-x snap-mandatory px-4 md:px-8 cursor-grab active:cursor-grabbing scroll-smooth">
          {filteredMenu.map(item => (
            <div key={item.id} className="w-[280px] md:w-[350px] shrink-0 snap-start">
              <MenuCard item={item} onAdd={addToCart} />
            </div>
          ))}
        </div>
      </section>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart} 
        onUpdateQty={updateQty}
        onCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        onSubmit={handleCheckout} 
      />

      {/* Floating Chat */}
      <a 
        href={`https://wa.me/${formatPhone(STAFF_WHATSAPP)}`}
        className="fixed bottom-6 left-6 md:bottom-8 md:left-8 w-14 h-14 md:w-16 md:h-16 bg-primary rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 hover:scale-110 transition-transform z-50"
      >
        <Phone className="w-7 h-7 md:w-8 md:h-8 text-secondary" />
      </a>
    </div>
  );
};

const StaffDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      if (u) {
        if (u.email === 'helpooclassmate@gmail.com') {
          setUser(u);
        } else {
          alert('غير مصرح لك بالدخول');
          signOut(auth);
          navigate('/');
        }
      }
    });
    return () => unsubAuth();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
      setOrders(docs);
    });
    return () => unsub();
  }, [user]);

  const handleLogin = () => {
    signInWithPopup(auth, new GoogleAuthProvider());
  };

  const updateStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, 'orders', id), { status });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass p-12 rounded-[3rem] text-center max-w-md w-full">
          <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-secondary" />
          </div>
          <h2 className="text-3xl font-black mb-2">دخول الموظفين</h2>
          <p className="text-white/40 mb-8">يرجى تسجيل الدخول للوصول إلى لوحة الطلبات</p>
          <button 
            onClick={handleLogin}
            className="w-full py-4 yellow-gradient text-secondary font-black rounded-2xl flex items-center justify-center gap-3"
          >
            تسجيل الدخول عبر قوقل
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black text-primary">لوحة الطلبات</h1>
            <p className="text-white/40">إدارة طلبات العملاء الحالية</p>
          </div>
          <button onClick={() => signOut(auth)} className="p-3 bg-white/5 rounded-xl hover:text-red-500 transition-colors">
            <LogOut />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {orders.map(order => (
            <motion.div 
              key={order.id}
              layout
              className={cn(
                "glass rounded-3xl p-6 border-l-8",
                order.status === 'pending' ? "border-primary" : 
                order.status === 'confirmed' ? "border-blue-500" : "border-green-500"
              )}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-black">{order.customerName}</h3>
                  <p className="text-white/40 font-bold flex items-center gap-2">
                    <Phone className="w-3 h-3" /> {order.customerPhone}
                  </p>
                </div>
                <div className="text-right">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                    order.status === 'pending' ? "bg-primary/20 text-primary" : "bg-green-500/20 text-green-500"
                  )}>
                    {order.status}
                  </span>
                  <p className="text-xs text-white/20 mt-1">
                    {order.createdAt?.toDate().toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-primary/20 text-primary rounded-lg flex items-center justify-center font-bold text-xs">
                        {item.quantity}
                      </span>
                      <div>
                        <p className="font-bold text-sm">{item.nameAr}</p>
                        {item.selectedSize && <p className="text-[10px] text-primary">{item.selectedSize}</p>}
                      </div>
                    </div>
                    <span className="font-black text-sm">{item.finalPrice * item.quantity} SR</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 text-white/40 text-sm">
                  {order.orderType === 'delivery' ? (
                    <><MapPin className="w-4 h-4" /> توصيل</>
                  ) : (
                    <><ShoppingBag className="w-4 h-4" /> استلام</>
                  )}
                </div>
                <span className="text-2xl font-black text-primary">{order.total} SR</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {order.status === 'pending' && (
                  <button 
                    onClick={() => {
                      updateStatus(order.id!, 'confirmed');
                      window.open(generateWhatsAppLink(order), '_blank');
                    }}
                    className="col-span-2 py-3 yellow-gradient text-secondary font-black rounded-xl flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" /> تأكيد وإرسال واتساب
                  </button>
                )}
                {order.status === 'confirmed' && (
                  <button 
                    onClick={() => updateStatus(order.id!, 'completed')}
                    className="col-span-2 py-3 bg-green-500 text-white font-black rounded-xl flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> تم الإنجاز
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/staff" element={<StaffDashboard />} />
      </Routes>
    </Router>
  );
}
