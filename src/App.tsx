/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, Component } from 'react';
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
  LogOut,
  Trash2
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
  serverTimestamp,
  getDocFromServer
} from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { db, auth } from './firebase';
import { cn } from './lib/utils';
import { MenuItem, CartItem, Order, CATEGORIES, STAFF_WHATSAPP } from './types';
import { INITIAL_MENU } from './data';

// --- Error Handling ---

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo;
}

function sanitizeForFirestore(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(v => sanitizeForFirestore(v));
  } else if (obj !== null && typeof obj === 'object' && !(obj instanceof Date)) {
    // Check if it's a plain object
    const proto = Object.getPrototypeOf(obj);
    if (proto === null || proto === Object.prototype) {
      return Object.fromEntries(
        Object.entries(obj)
          .filter(([_, v]) => v !== undefined)
          .map(([k, v]) => [k, sanitizeForFirestore(v)])
      );
    }
  }
  return obj;
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. ");
    }
  }
}
testConnection();

// --- Helpers ---
const formatPhone = (phone: string) => {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) cleaned = cleaned.substring(1);
  if (!cleaned.startsWith('966')) cleaned = '966' + cleaned;
  return cleaned;
};

const generateWhatsAppLink = (order: Order) => {
  const staffPhone = formatPhone(STAFF_WHATSAPP);
  const itemsList = order.items.map(i => {
    const sizeStr = i.selectedSize ? ` (${i.selectedSize})` : '';
    return `${i.quantity} x ${i.nameAr}${sizeStr}`;
  }).join('\n');
  
  const typeStr = order.orderType === 'delivery' ? 'توصيل' : 'استلام';
  
  const message = `طلب جديد من موقع ماكولاتي 🍔
👤 العميل: ${order.customerName}
📍 النوع: ${typeStr}
📞 الجوال: ${order.customerPhone}

🛒 تفاصيل الطلب:

${itemsList}

💰 المجموع الإجمالي: ${order.total} ريال

✅ لتاكيد الطلب، قم بالارسال الان..`;

  return `https://wa.me/${staffPhone}?text=${encodeURIComponent(message)}`;
};

// --- Components ---

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      const error = this.state.error;
      let errorMessage = 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
      try {
        const parsed = JSON.parse(error?.message || '');
        if (parsed.error) errorMessage = `خطأ في قاعدة البيانات: ${parsed.error}`;
      } catch (e) {
        // Not a JSON error
      }
      return (
        <div className="min-h-screen flex items-center justify-center bg-secondary p-4 text-center">
          <div className="glass p-8 rounded-3xl max-w-md border border-white/10">
            <X className="w-16 h-16 text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-white mb-4">عذراً، حدث خطأ ما</h2>
            <p className="text-white/60 mb-8 font-bold">{errorMessage}</p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-primary text-secondary font-black rounded-2xl shadow-xl shadow-primary/20"
            >
              إعادة تحميل الصفحة
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

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
  onRemove,
  onAdd,
  onCheckout 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  items: CartItem[]; 
  onUpdateQty: (id: string, size: string | undefined, delta: number) => void;
  onRemove: (id: string, size: string | undefined) => void;
  onAdd: (item: MenuItem) => void;
  onCheckout: () => void;
}) => {
  const total = items.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);
  
  const suggestedAddons = INITIAL_MENU.filter(item => 
    (item.category === 'sauces' || item.category === 'drinks') && 
    !items.some(cartItem => cartItem.id === item.id)
  ).slice(0, 4);

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
              <button onClick={onClose} className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 rounded-xl transition-colors text-white/60 font-bold">
                <span>إغلاق</span>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-8 space-y-8">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-white/10">
                  <ShoppingBag className="w-24 h-24 mb-6" />
                  <p className="font-black text-xl mb-8">السلة فارغة حالياً</p>
                  <button 
                    onClick={onClose}
                    className="px-8 py-4 bg-primary text-secondary font-black rounded-2xl hover:bg-accent transition-all flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" /> تصفح القائمة
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-8">
                    {items.map((item, idx) => (
                      <div key={`${item.id}-${item.selectedSize}-${idx}`} className="flex gap-6">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 shadow-xl">
                          <img src={item.image} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow text-right">
                          <div className="flex justify-between items-start mb-1">
                            <button 
                              onClick={() => onRemove(item.id, item.selectedSize)}
                              className="text-white/20 hover:text-red-500 transition-colors p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <h4 className="font-black text-lg leading-tight">{item.nameAr}</h4>
                          </div>
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
                    ))}
                  </div>
                  
                  <button 
                    onClick={onClose}
                    className="w-full py-4 border border-dashed border-white/10 text-white/60 font-bold rounded-2xl hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2 mt-4"
                  >
                    <Plus className="w-4 h-4" /> إضافة المزيد من الأصناف
                  </button>

                  {suggestedAddons.length > 0 && (
                    <div className="mt-12">
                      <h3 className="text-white/40 text-xs font-black uppercase tracking-widest mb-6 text-right">إضافات مقترحة</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {suggestedAddons.map(addon => (
                          <button
                            key={addon.id}
                            onClick={() => onAdd(addon)}
                            className="bg-white/5 border border-white/5 p-3 rounded-2xl flex items-center gap-3 hover:bg-white/10 transition-all text-right"
                          >
                            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                              <img src={addon.image} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-grow overflow-hidden">
                              <p className="text-white text-[10px] font-bold truncate">{addon.nameAr}</p>
                              <p className="text-primary text-[10px] font-black">{addon.price} SR</p>
                            </div>
                            <Plus className="w-4 h-4 text-primary shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
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
                  className="w-full py-6 bg-primary text-secondary font-black rounded-2xl text-2xl shadow-2xl shadow-primary/20 hover:bg-accent hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4"
                >
                  إتمام الطلب <ChevronRight className="w-8 h-8" />
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
  onSubmit,
  isSubmitting
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
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
        className="relative w-full max-w-lg glass rounded-[3rem] p-10 flex flex-col max-h-[90vh] border border-white/10 shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -z-10" />
        <h2 className="text-4xl font-black text-primary mb-8 text-right shrink-0">بيانات العميل</h2>
        
        <div className="space-y-8 text-right overflow-y-auto pr-2 no-scrollbar">
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
        </div>

        <div className="pt-8 shrink-0">
          <button 
            disabled={!form.name || !form.phone || isSubmitting}
            onClick={() => onSubmit(form)}
            className="w-full py-5 bg-primary text-secondary font-black rounded-2xl text-xl shadow-2xl shadow-primary/20 disabled:opacity-50 disabled:grayscale hover:bg-accent transition-all flex items-center justify-center gap-3"
          >
            {isSubmitting ? (
              <>
                <Clock className="w-6 h-6 animate-spin" /> جاري الإرسال...
              </>
            ) : (
              'تأكيد وإرسال الطلب'
            )}
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
    drinks: '🥤',
    sauces: '🍯',
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

const SuccessModal = ({ 
  isOpen, 
  onClose, 
  onWhatsApp,
  order,
  isWhatsAppClicked
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onWhatsApp: () => void;
  order: Order | null;
  isWhatsAppClicked: boolean;
}) => (
  <AnimatePresence>
    {isOpen && order && (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
          onClick={onClose}
        />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg glass rounded-[3rem] p-8 md:p-10 border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar"
        >
          {isWhatsAppClicked ? (
            <div className="text-center py-10">
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-3xl font-black text-white mb-4">شكراً لك!</h2>
              <p className="text-white/60 font-bold leading-relaxed text-lg">
                نحن بانتظار رسالتك الآن في الواتساب لتجهيز طلبك.
              </p>
              <button 
                onClick={onClose}
                className="mt-10 w-full py-4 bg-white/5 text-white font-black rounded-2xl hover:bg-white/10 transition-all"
              >
                إغلاق
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl font-black text-white mb-2">تم تسجيل طلبك!</h2>
                <p className="text-primary font-bold">خطوة واحدة وتستمتع بوجبتك!</p>
              </div>

              {/* Order Summary Card */}
              <div className="bg-white/5 rounded-3xl p-6 border border-white/10 mb-8 text-right">
                <h3 className="text-white/40 text-xs font-black uppercase tracking-widest mb-4">ملخص الطلب</h3>
                <div className="space-y-4 mb-6">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-primary font-black">{item.finalPrice * item.quantity} SR</span>
                      <div className="text-right">
                        <p className="text-white font-bold">{item.nameAr}</p>
                        <p className="text-white/40 text-xs">{item.quantity} x {item.finalPrice} SR {item.selectedSize && `(${item.selectedSize})`}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-2xl font-black text-primary">{order.total} SR</span>
                  <span className="text-white font-black">الإجمالي النهائي</span>
                </div>
              </div>

              {/* Customer Data */}
              <div className="grid grid-cols-2 gap-4 mb-8 text-right">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-white/40 text-[10px] font-black mb-1">نوع الطلب</p>
                  <p className="text-white font-bold">{order.orderType === 'delivery' ? 'توصيل للمنزل' : 'استلام من الفرع'}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-white/40 text-[10px] font-black mb-1">اسم العميل</p>
                  <p className="text-white font-bold truncate">{order.customerName}</p>
                </div>
              </div>

              <p className="text-white/60 text-center mb-8 font-bold leading-relaxed">
                يرجى الضغط على الزر أدناه لإرسال طلبك عبر الواتساب وتأكيده مع فريقنا.
              </p>

              <div className="space-y-4">
                <button 
                  onClick={onWhatsApp}
                  className="w-full py-6 bg-[#25D366] text-white font-black rounded-2xl text-xl shadow-2xl shadow-[#25D366]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  تأكيد الطلب عبر واتساب <ExternalLink className="w-6 h-6" />
                </button>
                <p className="text-[10px] text-white/30 text-center font-bold">
                  يجب الضغط على إرسال في تطبيق الواتساب بعد انتقالك إليه لضمان وصول الطلب
                </p>
              </div>

              <button 
                onClick={onClose}
                className="mt-8 w-full text-white/20 font-bold hover:text-white transition-colors text-sm"
              >
                إلغاء
              </button>
            </>
          )}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const Home = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isWhatsAppClicked, setIsWhatsAppClicked] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

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

  const removeFromCart = (id: string, size: string | undefined) => {
    setCart(prev => prev.filter(i => !(i.id === id && i.selectedSize === size)));
  };

  const handleCheckout = async (formData: any) => {
    setIsSubmitting(true);
    const total = cart.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);
    const orderData: Order = {
      customerName: formData.name,
      customerPhone: formData.phone,
      orderType: formData.type,
      googleMapsLink: formData.maps || '',
      items: cart,
      total,
      status: 'pending',
      createdAt: serverTimestamp()
    };

    const path = 'orders';
    const sanitizedOrder = sanitizeForFirestore(orderData);
    console.log('Sending order data:', sanitizedOrder);
    try {
      await addDoc(collection(db, path), sanitizedOrder);
      setLastOrder(orderData);
      setCart([]);
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
      setIsWhatsAppClicked(false);
      setIsSuccessOpen(true);
    } catch (err) {
      const errInfo = handleFirestoreError(err, OperationType.CREATE, path);
      alert(`حدث خطأ أثناء إرسال الطلب: ${errInfo.error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppConfirm = () => {
    if (lastOrder) {
      const link = generateWhatsAppLink(lastOrder);
      window.open(link, '_blank');
      setIsWhatsAppClicked(true);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <SuccessModal 
        isOpen={isSuccessOpen} 
        onClose={() => setIsSuccessOpen(false)} 
        onWhatsApp={handleWhatsAppConfirm}
        order={lastOrder}
        isWhatsAppClicked={isWhatsAppClicked}
      />

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
            مرحباً بكم في مأكولاتي
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-7xl md:text-9xl font-black mb-6 md:mb-10 leading-tight tracking-normal px-2"
          >
            ذوق أصيل<br />
            <span className="text-primary">تجربة لا تُنسى</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl font-bold text-white/60 mb-10 md:mb-16 max-w-3xl mx-auto tracking-wide leading-relaxed px-4 text-center"
          >
            شاورما | بيتزا | باستا | برجر | فطاير | مشروبات | صوصات <br className="md:hidden" /> كلها بنكهة ماكولاتي المميزة
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
        onRemove={removeFromCart}
        onAdd={addToCart}
        onCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        onSubmit={handleCheckout} 
        isSubmitting={isSubmitting}
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
    const path = 'orders';
    const unsub = onSnapshot(q, (snap) => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
      setOrders(docs);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, path);
    });
    return () => unsub();
  }, [user]);

  const handleLogin = () => {
    signInWithPopup(auth, new GoogleAuthProvider());
  };

  const updateStatus = async (id: string, status: string) => {
    const path = `orders/${id}`;
    try {
      await updateDoc(doc(db, 'orders', id), { status });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
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
            className="w-full py-4 bg-primary text-secondary font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-accent transition-all"
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
                    className="col-span-2 py-3 bg-primary text-secondary font-black rounded-xl flex items-center justify-center gap-2 hover:bg-accent transition-all"
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
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/staff" element={<StaffDashboard />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}
