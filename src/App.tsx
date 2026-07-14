/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Component, createContext, useContext } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
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
  Check, 
  Clock,
  ExternalLink,
  LogOut,
  Trash2,
  Upload,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from './supabase';
import { cn } from './lib/utils';
import { MenuItem, CartItem, Order, CATEGORIES, STAFF_WHATSAPP } from './types';
import { INITIAL_MENU } from './data';
import { extractCoordinatesFromMapsLink, getDeliveryQuote, isShortMapsLink, type DeliveryQuote } from './delivery';
import { useResolveMapsLink } from './hooks/useResolveMapsLink';

type Language = 'ar' | 'en';

const LanguageContext = createContext<{
  language: Language;
  setLanguage: (language: Language) => void;
  t: (arabic: string, english: string) => string;
}>({ language: 'ar', setLanguage: () => undefined, t: arabic => arabic });

const useLanguage = () => useContext(LanguageContext);

const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => (
    localStorage.getItem('makolaty_language') === 'en' ? 'en' : 'ar'
  ));

  const setLanguage = (nextLanguage: Language) => {
    localStorage.setItem('makolaty_language', nextLanguage);
    setLanguageState(nextLanguage);
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t: (arabic, english) => language === 'ar' ? arabic : english,
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

const LanguageSwitch = () => {
  const { language, setLanguage } = useLanguage();
  return (
    <button
      type="button"
      onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
      className="rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-black text-primary transition-all hover:bg-primary hover:text-secondary"
      aria-label={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      {language === 'ar' ? 'English' : 'العربية'}
    </button>
  );
};

const localizedSize = (size: string, language: Language) => {
  if (language === 'ar') return size;
  return ({ صغير: 'Small', وسط: 'Medium', كبير: 'Large' } as Record<string, string>)[size] || size;
};

// --- Error Handling ---

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface SupabaseErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
  }
}

async function handleSupabaseError(error: unknown, operationType: OperationType, path: string | null) {
  const { data } = await supabase.auth.getUser();
  const errInfo: SupabaseErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: data.user?.id,
      email: data.user?.email,
    },
    operationType,
    path
  };
  console.error('Supabase Error: ', JSON.stringify(errInfo));
  return errInfo;
}

function sanitizeForSupabase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(v => sanitizeForSupabase(v));
  } else if (obj !== null && typeof obj === 'object' && !(obj instanceof Date)) {
    const proto = Object.getPrototypeOf(obj);
    if (proto === null || proto === Object.prototype) {
      return Object.fromEntries(
        Object.entries(obj)
          .filter(([_, v]) => v !== undefined)
          .map(([k, v]) => [k, sanitizeForSupabase(v)])
      );
    }
  }
  return obj;
}

const BUILT_IN_MENU_OVERRIDES = new Map(
  INITIAL_MENU
    .filter(item => item.image.startsWith('/menu/'))
    .map(item => [item.id, item])
);

const applyBuiltInMenuOverrides = (items: MenuItem[]) => (
  items.map(item => {
    const override = BUILT_IN_MENU_OVERRIDES.get(item.id);
    if (!override) return item;

    return {
      ...item,
      nameAr: override.nameAr,
      nameEn: override.nameEn,
      image: override.image,
    };
  })
);

const normalizeSearchText = (value: string) => (
  value
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
);

async function testConnection() {
  const { error } = await supabase.from('orders').select('id').limit(1);
  if (error) console.error('Please check your Supabase configuration.', error.message);
}
testConnection();

const formatOrderTime = (createdAt: Order['createdAt']) => {
  if (!createdAt) return '';
  if (typeof createdAt === 'string') return new Date(createdAt).toLocaleTimeString();
  if (createdAt instanceof Date) return createdAt.toLocaleTimeString();
  if (typeof createdAt?.toDate === 'function') return createdAt.toDate().toLocaleTimeString();
  return '';
};

// --- Helpers ---
const formatPhone = (phone: string) => {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) cleaned = cleaned.substring(1);
  if (!cleaned.startsWith('966')) cleaned = '966' + cleaned;
  return cleaned;
};

const MenuItemImage = ({ item }: { item: MenuItem }) => {
  const { language } = useLanguage();
  const [hasImageError, setHasImageError] = useState(false);
  const shouldShowFullArtwork = item.image.startsWith('/menu/');

  if (!item.image || hasImageError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#3a3028] via-secondary to-[#130707] px-6 text-center">
        <span className="text-primary text-2xl font-black leading-tight">{language === 'ar' ? item.nameAr : item.nameEn}</span>
        <span className="mt-2 text-white/45 text-[10px] font-bold uppercase tracking-widest">{language === 'ar' ? item.nameEn : item.nameAr}</span>
      </div>
    );
  }

  return (
    <img
      src={item.image}
      alt={language === 'ar' ? item.nameAr : item.nameEn}
      className={cn(
        "w-full h-full transition-transform duration-500",
        shouldShowFullArtwork ? "object-contain p-1" : "object-cover group-hover:scale-110"
      )}
      referrerPolicy="no-referrer"
      onError={() => setHasImageError(true)}
    />
  );
};

const generateWhatsAppLink = (order: Order) => {
  const staffPhone = formatPhone(STAFF_WHATSAPP);
  
  const itemsList = order.items
    .map(i => {
      const sizeStr = i.selectedSize ? ` (${i.selectedSize})` : '';
      const options = [];
      if (i.ketchupLevel === 1) options.push('كاتشب');
      if (i.ketchupLevel === 2) options.push('كاتشب اكسترا');
      if (i.mayoLevel === 1) options.push('مايونيز');
      if (i.mayoLevel === 2) options.push('مايونيز اكسترا');
      if (i.spicyLevel === 1) options.push('حراق');
      if (i.spicyLevel === 2) options.push('حراق اكسترا');
      const optionsStr = options.length > 0 ? ` [${options.join(' + ')}]` : '';
      
      return `• ${i.quantity} ${i.nameAr}${sizeStr}${optionsStr}`;
    })
    .join('\n');

  const sep = '────────────────';
  
  const message = [
    `*طلب جديد 🛒*`,
    sep,
    `👤 *العميل:* ${order.customerName}`,
    `📦 *نوع الطلب:* ${order.orderType === 'delivery' ? 'توصيل للمنزل' : 'استلام من الفرع'}`,
    order.orderType === 'delivery' ? `📍 *الموقع:* ${order.googleMapsLink}` : `استلام من الفرع 🏪`,
    sep,
    itemsList,
    sep,
    order.notes?.trim() ? `📝 *ملاحظات:* ${order.notes}\n${sep}` : '',
    order.orderType === 'delivery' ? `🚚 *رسوم التوصيل:* SR ${order.deliveryFee ?? 0}` : '',
    order.orderType === 'delivery' && order.deliveryDistanceKm ? `📏 *المسافة:* ${order.deliveryDistanceKm} كم` : '',
    `💰 *الإجمالي:* SR ${order.total}`,
    sep
  ].filter(Boolean).join('\n');

  return `https://wa.me/${staffPhone}?text=${encodeURIComponent(message)}`;
};

const STAFF_PASSCODE = '200346272';

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

const Navbar = ({ cartCount, onOpenCart }: { cartCount: number; onOpenCart: () => void }) => {
  const { t } = useLanguage();
  return (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-secondary/80 backdrop-blur-lg border-b border-white/5 px-4 py-3 md:py-4">
    <div className="max-w-7xl mx-auto flex justify-between items-center flex-row-reverse">
      {/* Cart on the Right */}
      <div className="flex items-center gap-4">
        <LanguageSwitch />
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
        <Link to="/" className="text-white hover:text-primary transition-colors">{t('الرئيسية', 'Home')}</Link>
        <a href="#menu" className="text-white/60 hover:text-primary transition-colors">{t('القائمة', 'Menu')}</a>
        <Link to="/staff" className="text-white/60 hover:text-primary transition-colors">{t('الموظفون', 'Staff')}</Link>
        <a href={`https://wa.me/${formatPhone(STAFF_WHATSAPP)}`} className="text-white/60 hover:text-primary transition-colors">{t('تواصل معنا', 'Contact us')}</a>
      </div>

      {/* Logo on the Left */}
      <Link to="/" className="flex items-center gap-2 md:gap-3">
        <div className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center bg-primary rounded-xl overflow-hidden p-1 shadow-lg shadow-primary/20">
          <img 
            src="/logo.png" 
            alt={t('مأكولاتي', 'Makolaty')}
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
        <span className="font-black text-xl md:text-2xl tracking-tighter text-primary">{t('مأكولاتي', 'Makolaty')}</span>
      </Link>
    </div>
  </nav>
  );
};

const MenuCard = ({ item, onAdd }: { item: MenuItem; onAdd: (item: MenuItem, size?: string) => void; key?: string }) => {
  const { language, t } = useLanguage();
  const [selectedSize, setSelectedSize] = useState(item.sizes?.[0]?.name);
  const shouldShowFullArtwork = item.image.startsWith('/menu/');
  const isUnavailable = item.isAvailable === false;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "glass relative rounded-3xl overflow-hidden flex flex-col group transition-all",
        isUnavailable && "border-red-500/40 grayscale-[35%]"
      )}
    >
      {isUnavailable ? (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center overflow-hidden bg-secondary/25">
          <div className="absolute h-1.5 w-[145%] rotate-[-24deg] bg-red-500 shadow-[0_0_18px_rgba(239,68,68,0.75)]" />
          <div className="relative rounded-2xl border border-red-400/40 bg-red-600/95 px-6 py-3 text-center shadow-2xl shadow-black/50">
            <p className="text-lg font-black text-white">{t('غير متاح', 'Not available')}</p>
          </div>
        </div>
      ) : null}
      <div className={cn(
        "relative overflow-hidden",
        shouldShowFullArtwork ? "aspect-[3/4] bg-[#f8f1e8]" : "aspect-[4/3]"
      )}>
        <MenuItemImage item={item} />
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent",
          shouldShowFullArtwork ? "opacity-25" : "opacity-60"
        )} />
        {item.calories && (
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold border border-white/10">
            {item.calories} Kcal
          </div>
        )}
      </div>
      <div className={cn(
        "p-6 flex flex-col flex-grow relative bg-secondary/80 backdrop-blur-xl rounded-t-3xl border-t border-white/10",
        shouldShowFullArtwork ? "mt-0" : "-mt-8"
      )}>
        <div className="mb-4 text-right">
          <h3 className="font-black text-xl leading-tight text-primary mb-1">{language === 'ar' ? item.nameAr : item.nameEn}</h3>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest">{language === 'ar' ? item.nameEn : item.nameAr}</p>
        </div>
        
        {item.sizes && (
          <div className="flex gap-2 mb-6">
            {item.sizes.map(s => (
              <button
                key={s.name}
                onClick={() => setSelectedSize(s.name)}
                disabled={isUnavailable}
                className={cn(
                  "flex-1 py-2 rounded-xl text-xs font-black transition-all border",
                  selectedSize === s.name ? "bg-primary text-secondary border-primary shadow-lg shadow-primary/20" : "bg-white/5 text-white/40 border-white/10"
                )}
              >
                {localizedSize(s.name, language)}
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
            disabled={isUnavailable}
            aria-label={isUnavailable ? t('الصنف غير متاح', 'Item not available') : t('إضافة إلى السلة', 'Add to cart')}
            className="w-12 h-12 bg-primary text-secondary rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30 disabled:shadow-none disabled:hover:scale-100"
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
  menuItems,
  onUpdateQty, 
  onRemove,
  onUpdateOption,
  onAdd,
  onCheckout,
  notes,
  onNotesChange
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  items: CartItem[]; 
  menuItems: MenuItem[];
  onUpdateQty: (id: string, size: string | undefined, delta: number) => void;
  onRemove: (id: string, size: string | undefined) => void;
  onUpdateOption: (id: string, size: string | undefined, option: 'ketchup' | 'mayo' | 'spicy', level: number) => void;
  onAdd: (item: MenuItem) => void;
  onCheckout: () => void;
  notes: string;
  onNotesChange: (val: string) => void;
}) => {
  const { language, t } = useLanguage();
  const [viewingCategory, setViewingCategory] = useState<string | null>(null);
  const total = items.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);
  
  const suggestedDrinks = menuItems.filter(item => item.category === 'drinks');
  
  const suggestedSauces = menuItems.filter(item => item.category === 'sauces');

  const handleAddItem = (item: MenuItem) => {
    onAdd(item);
  };

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
              <div className="flex items-center gap-4">
                {viewingCategory && (
                  <button 
                    onClick={() => setViewingCategory(null)}
                    className="p-2 hover:bg-white/5 rounded-full text-primary transition-colors"
                  >
                    <ChevronRight className="w-6 h-6 rotate-180" />
                  </button>
                )}
                <h2 className="text-3xl font-black text-primary">
                  {viewingCategory === 'drinks' ? t('المشروبات', 'Drinks') : viewingCategory === 'sauces' ? t('الصوصات', 'Sauces') : t('سلة الطلبات', 'Your cart')}
                </h2>
              </div>
              <button onClick={onClose} className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 rounded-xl transition-colors text-white/60 font-bold">
                <span>{t('إغلاق', 'Close')}</span>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-8 space-y-8">
              {viewingCategory ? (
                <div className="grid grid-cols-1 gap-4">
                  {(viewingCategory === 'drinks' ? suggestedDrinks : suggestedSauces).map(addon => (
                    <button
                      key={addon.id}
                      onClick={() => handleAddItem(addon)}
                      className="bg-white/5 border border-white/5 p-4 rounded-3xl flex items-center gap-4 hover:bg-white/10 transition-all text-right group"
                    >
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-lg">
                        <img src={addon.image} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow">
                        <p className="text-white font-black text-lg">{addon.nameAr}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-primary font-black">{addon.price} SR</p>
                          {items.find(i => i.id === addon.id) && (
                            <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full font-black">
                              {t('تمت الإضافة', 'Added')} {items.find(i => i.id === addon.id)?.quantity}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-secondary transition-all">
                        <Plus className="w-5 h-5" />
                      </div>
                    </button>
                  ))}
                  { (viewingCategory === 'drinks' ? suggestedDrinks : suggestedSauces).length === 0 && (
                    <p className="text-white/20 text-center py-10 font-bold">{t('تمت إضافة جميع الأصناف المتوفرة', 'All available items have been added')}</p>
                  )}
                </div>
              ) : items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-white/10">
                  <ShoppingBag className="w-24 h-24 mb-6" />
                  <p className="font-black text-xl mb-8">{t('السلة فارغة حالياً', 'Your cart is empty')}</p>
                  <button 
                    onClick={onClose}
                    className="px-8 py-4 bg-primary text-secondary font-black rounded-2xl hover:bg-accent transition-all flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" /> {t('تصفح القائمة', 'Browse menu')}
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-6">
                    {items.map((item, idx) => (
                      <div key={`${item.id}-${item.selectedSize}-${idx}`} className="flex flex-row items-center gap-3 relative pb-4 border-b border-white/5 last:border-0">
                        {/* Far Right: Product Image */}
                        <div className="relative w-[56px] h-[56px] rounded-xl overflow-hidden flex-shrink-0 shadow-lg border border-white/10">
                          <img src={item.image} className="w-full h-full object-cover" />
                        </div>

                        {/* Right-Center: Name + Options (Right next to image) */}
                        <div className="text-right flex-1">
                          <div className="flex items-center justify-start gap-2 mb-1">
                            <h4 className="font-bold text-sm text-white">{item.nameAr}</h4>
                            <button 
                              onClick={() => onRemove(item.id, item.selectedSize)}
                              className="text-white/20 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {item.selectedSize && <p className="text-[10px] text-primary font-bold mb-1">{item.selectedSize}</p>}
                          
                          <div className="flex flex-row flex-wrap gap-1 justify-start">
                            {[
                              { label: t('سبايسي', 'Spicy'), key: 'spicy', level: item.spicyLevel || 0 },
                              { label: t('مايونيز', 'Mayo'), key: 'mayo', level: item.mayoLevel || 0 },
                              { label: t('كاتشب', 'Ketchup'), key: 'ketchup', level: item.ketchupLevel || 0 }
                            ].map(opt => (
                              <div key={opt.key} className="flex items-center gap-0.5">
                                {opt.level > 0 && (
                                  <button
                                    onClick={() => onUpdateOption(item.id, item.selectedSize, opt.key as any, opt.level === 2 ? 1 : 2)}
                                    className="w-4 h-4 rounded-full bg-primary text-secondary flex items-center justify-center hover:scale-110 active:scale-90 transition-all shadow-md"
                                  >
                                    {opt.level === 2 ? <Minus className="w-2.5 h-2.5" /> : <Plus className="w-2.5 h-2.5" />}
                                  </button>
                                )}
                                <button
                                  onClick={() => onUpdateOption(item.id, item.selectedSize, opt.key as any, opt.level === 0 ? 1 : 0)}
                                  className={cn(
                                    "px-2 py-0.5 rounded-lg text-[9px] font-bold border transition-all flex items-center gap-1",
                                    opt.level > 0 
                                      ? "bg-primary border-primary text-secondary" 
                                      : "bg-white/5 border-white/10 text-white/30"
                                  )}
                                >
                                  {opt.level === 2 && <span className="text-[7px] bg-secondary/10 px-0.5 rounded">{t('اكسترا', 'Extra')}</span>}
                                  {opt.label}
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Far Left: Quantity stepper and price */}
                        <div className="flex flex-col items-center gap-2 min-w-[70px] shrink-0">
                          <div className="flex items-center gap-2.5 bg-white/5 rounded-lg px-3 py-1.5 border border-white/10 shadow-lg">
                            <button onClick={() => onUpdateQty(item.id, item.selectedSize, 1)} className="hover:text-primary transition-colors">
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-black text-base w-5 text-center text-white">{item.quantity}</span>
                            <button onClick={() => onUpdateQty(item.id, item.selectedSize, -1)} className="hover:text-primary transition-colors">
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="font-black text-base text-primary">{item.finalPrice * item.quantity} SR</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button 
                    onClick={onClose}
                    className="w-full py-3 border border-dashed border-white/10 text-white/40 font-bold rounded-xl hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2 mt-4 text-sm"
                  >
                    <Plus className="w-3.5 h-3.5" /> {t('إضافة المزيد من الأصناف', 'Add more items')}
                  </button>

                  <div className="mt-8">
                    <h3 className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-4 text-right">{t('إضافات مقترحة', 'Suggested add-ons')}</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setViewingCategory('drinks')}
                        className="bg-white/5 border border-white/10 py-5 rounded-3xl flex flex-col items-center gap-2 hover:bg-white/10 transition-all group relative overflow-hidden"
                      >
                        <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-secondary">
                          <Plus className="w-3 h-3" />
                        </div>
                        <span className="text-3xl">🥤</span>
                        <span className="text-white font-black text-sm">{t('مشروبات', 'Drinks')}</span>
                      </button>

                      <button
                        onClick={() => setViewingCategory('sauces')}
                        className="bg-white/5 border border-white/10 py-5 rounded-3xl flex flex-col items-center gap-2 hover:bg-white/10 transition-all group relative overflow-hidden"
                      >
                        <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-secondary">
                          <Plus className="w-3 h-3" />
                        </div>
                        <span className="text-3xl">🍯</span>
                        <span className="text-white font-black text-sm">{t('صوصات', 'Sauces')}</span>
                      </button>
                    </div>
                  </div>

                  {/* Notes Section */}
                  <div className="mt-6 px-2 text-right">
                    <label className="text-xs text-white/40 block mb-2 font-bold">
                      {t('ملاحظات إضافية (اختياري)', 'Additional notes (optional)')}
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => onNotesChange(e.target.value)}
                      placeholder={t('مثال: بدون بصل، صوص زيادة...', 'Example: no onions, extra sauce...')}
                      dir="rtl"
                      rows={1}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl p-3 text-white font-bold placeholder:text-white/10 focus:outline-none focus:border-primary/30 transition-all resize-none text-sm"
                      maxLength={200}
                    />
                    <div className="flex justify-between mt-1">
                      <p className="text-[10px] text-white/20">{notes.length}/200</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-xl shrink-0">
                <div className="flex justify-between items-center mb-2 px-2">
                  <span className="text-white/40 font-black text-sm">{t('المجموع الكلي', 'Total')}</span>
                  <span className="text-2xl font-black text-primary">{total} SR</span>
                </div>
                {viewingCategory ? (
                  <button 
                    onClick={() => setViewingCategory(null)}
                    className="w-full py-4 bg-primary text-secondary font-black rounded-2xl text-xl shadow-2xl shadow-primary/20 hover:bg-accent hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4"
                  >
                    {t('تأكيد الإضافات', 'Confirm add-ons')} <CheckCircle2 className="w-6 h-6" />
                  </button>
                ) : (
                  <button 
                    onClick={onCheckout}
                    className="w-full py-4 bg-primary text-secondary font-black rounded-2xl text-xl shadow-2xl shadow-primary/20 hover:bg-accent hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4"
                  >
                    {t('إتمام الطلب', 'Checkout')} <ChevronRight className="w-6 h-6" />
                  </button>
                )}
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
  isSubmitting,
  orderSubtotal
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
  orderSubtotal: number;
}) => {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    type: 'pickup' as 'pickup' | 'delivery',
    maps: ''
  });
  const [locationError, setLocationError] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [showManualLocation, setShowManualLocation] = useState(false);
  const [mapsLinkInput, setMapsLinkInput] = useState('');
  const { resolveLink, isResolving, error: resolveError, clearError: clearResolveError } = useResolveMapsLink();

  const customerCoordinates = form.type === 'delivery'
    ? extractCoordinatesFromMapsLink(form.maps)
    : null;
  const hasShortMapsLink = form.type === 'delivery' && isShortMapsLink(mapsLinkInput);
  const deliveryQuote: DeliveryQuote | null = form.type === 'delivery' && customerCoordinates
    ? getDeliveryQuote(orderSubtotal, customerCoordinates)
    : null;
  const finalTotal = orderSubtotal + (deliveryQuote?.isAllowed ? deliveryQuote.fee : 0);
  const isDeliveryBlocked = form.type === 'delivery' && (!customerCoordinates || !deliveryQuote?.isAllowed);

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('المتصفح لا يدعم تحديد الموقع.');
      return;
    }

    setLocationError('');
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setForm(prev => ({
          ...prev,
          maps: `https://www.google.com/maps?q=${latitude},${longitude}`
        }));
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        setLocationError('تعذر تحديد موقعك. يرجى السماح بالوصول للموقع أو استخدام خيار الرابط اليدوي.');
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 60000,
      }
    );
  };

  const handleResolveMapsLink = async () => {
    setLocationError('');
    const localCoordinates = extractCoordinatesFromMapsLink(mapsLinkInput);
    if (localCoordinates) {
      setForm(prev => ({
        ...prev,
        maps: `https://www.google.com/maps?q=${localCoordinates.lat},${localCoordinates.lng}`
      }));
      return;
    }

    const coordinates = await resolveLink(mapsLinkInput);
    if (!coordinates) return;

    setForm(prev => ({
      ...prev,
      maps: `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`
    }));
  };

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
        <h2 className="text-4xl font-black text-primary mb-8 text-right shrink-0">{t('بيانات العميل', 'Customer details')}</h2>
        
        <div className="space-y-8 text-right overflow-y-auto pr-2 no-scrollbar">
          <div className="space-y-3">
            <label className="text-base font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2 justify-end">
              {t('الاسم الكامل', 'Full name')} <User className="w-3 h-3" />
            </label>
            <input 
              type="text" 
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary transition-all text-right font-bold text-lg"
              placeholder={t('أدخل اسمك هنا...', 'Enter your name...')}
            />
          </div>

          <div className="space-y-3">
            <label className="text-base font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2 justify-end">
              {t('رقم الجوال (واتساب)', 'Mobile number (WhatsApp)')} <Phone className="w-3 h-3" />
            </label>
            <input 
              type="tel" 
              value={form.phone}
              onChange={e => setForm({...form, phone: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary transition-all text-right font-bold text-lg"
              placeholder="05xxxxxxxx"
            />
          </div>

          <div className="space-y-3">
            <label className="text-base font-black text-white/40 uppercase tracking-[0.2em] text-right block">{t('نوع الطلب', 'Order type')}</label>
            <div className="flex gap-4">
              <button 
                onClick={() => setForm({...form, type: 'pickup'})}
                className={cn(
                  "flex-1 py-4 rounded-2xl font-black border transition-all",
                  form.type === 'pickup' ? "bg-primary text-secondary border-primary shadow-lg shadow-primary/20" : "bg-white/5 border-white/10 text-white/40"
                )}
              >
                {t('استلام من الفرع', 'Pickup')}
              </button>
              <button 
                onClick={() => setForm({...form, type: 'delivery'})}
                className={cn(
                  "flex-1 py-4 rounded-2xl font-black border transition-all",
                  form.type === 'delivery' ? "bg-primary text-secondary border-primary shadow-lg shadow-primary/20" : "bg-white/5 border-white/10 text-white/40"
                )}
              >
                {t('توصيل للمنزل', 'Delivery')}
              </button>
            </div>
          </div>

          {form.type === 'delivery' && (
            <div className="space-y-3">
              <label className="text-base font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2 justify-end">
                {t('موقع التوصيل', 'Delivery location')} <MapPin className="w-3 h-3" />
              </label>
              <button
                type="button"
                onClick={useCurrentLocation}
                disabled={isLocating}
                className="w-full py-5 bg-primary text-secondary rounded-2xl font-black text-xl shadow-2xl shadow-primary/20 hover:bg-accent disabled:opacity-60 transition-all flex items-center justify-center gap-3"
              >
                {isLocating ? (
                  <>
                    <Clock className="w-5 h-5 animate-spin" /> جاري تحديد الموقع...
                  </>
                ) : customerCoordinates ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" /> تم تحديد موقع التوصيل
                  </>
                ) : (
                  <>
                    <MapPin className="w-5 h-5" /> حدد موقعي للتوصيل
                  </>
                )}
              </button>
              {customerCoordinates && (
                <p className="text-primary text-xs font-bold leading-relaxed">
                  سنستخدم هذا الموقع لحساب المسافة ورسوم التوصيل.
                </p>
              )}
              {locationError && (
                <p className="text-red-400 text-xs font-bold leading-relaxed">{locationError}</p>
              )}
              <button
                type="button"
                onClick={() => setShowManualLocation(value => !value)}
                className="w-full py-3 text-white/40 hover:text-white font-bold transition-colors"
              >
                {showManualLocation ? 'إخفاء الرابط اليدوي' : 'استخدام رابط خرائط بدلاً من ذلك'}
              </button>
              {showManualLocation && (
                <div className="space-y-2">
                  <input 
                    type="url" 
                    value={mapsLinkInput}
                    onChange={e => {
                      const nextValue = e.target.value;
                      const localCoordinates = extractCoordinatesFromMapsLink(nextValue);
                      setLocationError('');
                      clearResolveError();
                      setMapsLinkInput(nextValue);
                      if (localCoordinates) {
                        setForm(prev => ({
                          ...prev,
                          maps: `https://www.google.com/maps?q=${localCoordinates.lat},${localCoordinates.lng}`
                        }));
                      }
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary transition-all text-right font-bold text-lg"
                    placeholder="https://maps.app.goo.gl/..."
                  />
                  <button
                    type="button"
                    onClick={handleResolveMapsLink}
                    disabled={!mapsLinkInput || isResolving}
                    className="w-full py-3 bg-white/5 border border-white/10 rounded-2xl font-black text-white/70 hover:bg-white/10 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {isResolving ? (
                      <>
                        <Clock className="w-4 h-4 animate-spin" /> جارٍ تحديد الموقع من الرابط...
                      </>
                    ) : (
                      <>
                        <MapPin className="w-4 h-4" /> قراءة الموقع من الرابط
                      </>
                    )}
                  </button>
                  {resolveError && (
                    <p className="text-red-400 text-xs font-bold leading-relaxed">
                      {resolveError} يمكنك استخدام زر تحديد موقعي للتوصيل بدلاً من ذلك.
                    </p>
                  )}
                  {mapsLinkInput && !customerCoordinates && !resolveError && !isResolving && (
                    <p className={cn(
                      "text-xs font-bold leading-relaxed",
                      hasShortMapsLink ? "text-primary" : "text-white/40"
                    )}>
                      {hasShortMapsLink
                        ? 'سنحاول قراءة الرابط المختصر من خلال الخادم. إذا لم ينجح، استخدم زر تحديد موقعي للتوصيل.'
                        : 'اضغط قراءة الموقع من الرابط لحساب المسافة ورسوم التوصيل، أو الصق رابطاً يحتوي على الإحداثيات ليتم حسابه تلقائياً.'}
                    </p>
                  )}
                </div>
              )}
              {deliveryQuote && (
                <div className={cn(
                  "rounded-2xl p-4 border text-right",
                  deliveryQuote.isAllowed ? "bg-primary/10 border-primary/20" : "bg-red-500/10 border-red-500/20"
                )}>
                  <p className={cn(
                    "font-black text-sm mb-1",
                    deliveryQuote.isAllowed ? "text-primary" : "text-red-400"
                  )}>
                    {deliveryQuote.messageAr}
                  </p>
                  <p className="text-white/50 text-xs font-bold">
                    المسافة التقريبية: {deliveryQuote.distanceKm} كم
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="pt-8 shrink-0">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4 text-right space-y-2">
            <div className="flex justify-between text-sm font-bold text-white/50">
              <span>{orderSubtotal} SR</span>
              <span>{t('قيمة الطلب', 'Order subtotal')}</span>
            </div>
            {form.type === 'delivery' && deliveryQuote?.isAllowed && (
              <div className="flex justify-between text-sm font-bold text-white/50">
                <span>{deliveryQuote.fee} SR</span>
                <span>{t('رسوم التوصيل', 'Delivery fee')}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-black text-primary pt-2 border-t border-white/10">
              <span>{finalTotal} SR</span>
              <span>{t('الإجمالي', 'Total')}</span>
            </div>
          </div>
          <button 
            disabled={!form.name || !form.phone || isSubmitting || isDeliveryBlocked}
            onClick={() => onSubmit(form)}
            className="w-full py-5 bg-primary text-secondary font-black rounded-2xl text-xl shadow-2xl shadow-primary/20 disabled:opacity-50 disabled:grayscale hover:bg-accent transition-all flex items-center justify-center gap-3"
          >
            {isSubmitting ? (
              <>
                <Clock className="w-6 h-6 animate-spin" /> جاري الإرسال...
              </>
            ) : (
              t('تأكيد وإرسال الطلب', 'Confirm and send order')
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const CategoryBar = ({ active, onChange }: { active: string; onChange: (id: string) => void }) => {
  const { language, t } = useLanguage();
  const icons: Record<string, string> = {
    shawarma: '🌯',
    pizza: '🍕',
    pasta: '🍝',
    sandwiches: '🥪',
    pastries: '🥟',
    meals: '🍔',
    broast: '🍗',
    appetizers: '🥗',
    drinks: '🥤',
    sauces: '🍯',
    all: '🍽️'
  };

  return (
    <div className="flex gap-6 md:gap-8 overflow-x-auto pb-10 no-scrollbar px-8 snap-x snap-mandatory cursor-grab active:cursor-grabbing">
      {[{ id: 'all', nameAr: 'الكل', nameEn: 'All' }, ...CATEGORIES].map((cat) => (
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
            {cat.id === 'all' ? t('الكل', 'All') : language === 'ar' ? cat.nameAr : cat.nameEn}
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
}) => {
  const { t } = useLanguage();
  return (
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
              <h2 className="text-3xl font-black text-white mb-4">{t('شكراً لك!', 'Thank you!')}</h2>
              <p className="text-white/60 font-bold leading-relaxed text-lg">
                {t('نحن بانتظار رسالتك الآن في الواتساب لتجهيز طلبك.', 'We are waiting for your WhatsApp message to prepare your order.')}
              </p>
              <button 
                onClick={onClose}
                className="mt-10 w-full py-4 bg-white/5 text-white font-black rounded-2xl hover:bg-white/10 transition-all"
              >
                {t('إغلاق', 'Close')}
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingBag className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl font-black text-white mb-2">{t('تم تسجيل طلبك!', 'Your order is recorded!')}</h2>
                <p className="text-primary font-bold">{t('خطوة واحدة وتستمتع بوجبتك!', 'One more step to enjoy your meal!')}</p>
              </div>

              {/* Order Summary Card */}
              <div className="bg-white/5 rounded-3xl p-6 border border-white/10 mb-8 text-right">
                <h3 className="text-white/40 text-xs font-black uppercase tracking-widest mb-4">{t('ملخص الطلب', 'Order summary')}</h3>
                <div className="space-y-4 mb-6">
                  {order.items.map((item, idx) => {
                    const options = [];
                    if (item.ketchupLevel === 1) options.push('كاتشب');
                    if (item.ketchupLevel === 2) options.push('كاتشب اكسترا');
                    if (item.mayoLevel === 1) options.push('مايونيز');
                    if (item.mayoLevel === 2) options.push('مايونيز اكسترا');
                    if (item.spicyLevel === 1) options.push('حراق');
                    if (item.spicyLevel === 2) options.push('حراق اكسترا');
                    const optionsStr = options.length > 0 ? ` [${options.join(' + ')}]` : '';
                    
                    return (
                      <div key={idx} className="text-right py-1">
                        <p className="text-white font-bold">
                          <span className="text-primary ml-1">{item.quantity}</span>
                          {item.nameAr}
                          {item.selectedSize && <span className="text-primary text-xs mr-1">({item.selectedSize})</span>}
                        </p>
                        {optionsStr && <p className="text-white/40 text-[10px] mt-0.5">{optionsStr}</p>}
                      </div>
                    );
                  })}
                </div>

                {order.notes && (
                  <div className="py-4 border-t border-white/5 mb-2 text-right">
                    <p className="text-white/40 text-[10px] font-black mb-1">الملاحظات</p>
                    <p className="text-white font-bold text-sm leading-relaxed">{order.notes}</p>
                  </div>
                )}

                <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                  <div className="text-left">
                    {order.orderType === 'delivery' && (
                      <p className="text-white/40 text-xs font-bold mb-1">
                        التوصيل: {order.deliveryFee ?? 0} SR
                        {order.deliveryDistanceKm ? ` | ${order.deliveryDistanceKm} كم` : ''}
                      </p>
                    )}
                    <span className="text-2xl font-black text-primary">{order.total} SR</span>
                  </div>
                  <span className="text-white font-black">{t('الإجمالي النهائي', 'Final total')}</span>
                </div>
              </div>

              {/* Customer Data */}
              <div className="grid grid-cols-2 gap-4 mb-8 text-right">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-white/40 text-base font-black mb-1">{t('نوع الطلب', 'Order type')}</p>
                  <p className="text-white font-bold">{order.orderType === 'delivery' ? t('توصيل للمنزل', 'Delivery') : t('استلام من الفرع', 'Pickup')}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                  <p className="text-white/40 text-base font-black mb-1">{t('اسم العميل', 'Customer name')}</p>
                  <p className="text-white font-bold truncate">{order.customerName}</p>
                </div>
              </div>

              <p className="text-white/60 text-center mb-8 font-bold leading-relaxed">
                {t('يرجى الضغط على الزر أدناه لإرسال طلبك عبر الواتساب وتأكيده مع فريقنا.', 'Use the button below to send and confirm your order on WhatsApp.')}
              </p>

              {/* Sticky confirm button — always visible */}
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/95 to-transparent pb-8 z-50">
                <button 
                  onClick={onWhatsApp}
                  className="w-full py-5 bg-[#25D366] text-white rounded-2xl font-bold text-xl flex items-center justify-center gap-3 active:scale-95 transition-transform shadow-2xl shadow-[#25D366]/40"
                >
                  <span>{t('تأكيد الطلب عبر واتساب', 'Confirm order on WhatsApp')}</span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.86L.054 23.05a.75.75 0 00.916.916l5.19-1.478A11.948 11.948 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.692-.518-5.22-1.42l-.374-.22-3.88 1.105 1.107-3.797-.243-.393A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                  </svg>
                </button>
                <p className="text-[10px] text-white/30 text-center font-bold mt-2">
                  يجب الضغط على إرسال في تطبيق الواتساب بعد انتقالك إليه لضمان وصول الطلب
                </p>
              </div>

              {/* Add padding at bottom so content isn't hidden behind sticky button */}
              <div className="h-28" />

              <button 
                onClick={onClose}
                className="mt-8 w-full text-white/20 font-bold hover:text-white transition-colors text-sm"
              >
                {t('إلغاء', 'Cancel')}
              </button>
            </>
          )}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
  );
};

const Home = () => {
  const { language, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isWhatsAppClicked, setIsWhatsAppClicked] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [orderNotes, setOrderNotes] = useState('');

  useEffect(() => {
    const loadMenuItems = async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('sortOrder', { ascending: true })
        .order('nameAr', { ascending: true });

      if (error) {
        console.warn('Using local fallback menu because Supabase menu_items could not be loaded.', error.message);
        setMenuItems(applyBuiltInMenuOverrides(INITIAL_MENU));
        return;
      }

      setMenuItems(applyBuiltInMenuOverrides(data && data.length > 0 ? data as MenuItem[] : INITIAL_MENU));
    };

    loadMenuItems();

    const channel = supabase
      .channel('menu-items-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menu_items' }, loadMenuItems)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const normalizedSearchQuery = normalizeSearchText(searchQuery);
  const filteredMenu = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    if (!matchesCategory) return false;
    if (!normalizedSearchQuery) return true;

    const category = CATEGORIES.find(cat => cat.id === item.category);
    const searchableText = normalizeSearchText([
      item.nameAr,
      item.nameEn,
      category?.nameAr,
      category?.nameEn,
    ].filter(Boolean).join(' '));

    return searchableText.includes(normalizedSearchQuery);
  });

  const addToCart = (item: MenuItem, size?: string) => {
    if (item.isAvailable === false) return;
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

  const updateOption = (id: string, size: string | undefined, option: 'ketchup' | 'mayo' | 'spicy', level: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id && item.selectedSize === size) {
        return { ...item, [`${option}Level`]: level };
      }
      return item;
    }));
  };

  const handleCheckout = async (formData: any) => {
    setIsSubmitting(true);
    const subtotal = cart.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);
    const customerCoordinates = formData.type === 'delivery'
      ? extractCoordinatesFromMapsLink(formData.maps)
      : null;
    const deliveryQuote = customerCoordinates ? getDeliveryQuote(subtotal, customerCoordinates) : null;

    if (formData.type === 'delivery' && (!deliveryQuote || !deliveryQuote.isAllowed)) {
      alert(deliveryQuote?.messageAr || 'يرجى إضافة موقع صحيح للتوصيل.');
      setIsSubmitting(false);
      return;
    }

    const deliveryFee = formData.type === 'delivery' ? deliveryQuote?.fee ?? 0 : 0;
    const total = subtotal + deliveryFee;
    const orderData: Order = {
      customerName: formData.name,
      customerPhone: formData.phone,
      orderType: formData.type,
      googleMapsLink: formData.maps || '',
      items: cart,
      subtotal,
      deliveryFee,
      deliveryDistanceKm: formData.type === 'delivery' ? deliveryQuote?.distanceKm : undefined,
      total,
      notes: orderNotes,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const path = 'orders';
    const sanitizedOrder = sanitizeForSupabase(orderData);
    console.log('Sending order data:', sanitizedOrder);
    try {
      const { error } = await supabase.from(path).insert(sanitizedOrder);
      if (error) throw error;
      setLastOrder(orderData);
      setCart([]);
      setOrderNotes('');
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
      setIsWhatsAppClicked(false);
      setIsSuccessOpen(true);
    } catch (err) {
      const errInfo = await handleSupabaseError(err, OperationType.CREATE, path);
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
            {t('مرحباً بكم في مأكولاتي', 'Welcome to Makolaty')}
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-7xl md:text-9xl font-black mb-6 md:mb-10 leading-tight tracking-normal px-2"
          >
            {t('ذوق أصيل', 'Authentic taste')}<br />
            <span className="text-primary">{t('تجربة لا تُنسى', 'An unforgettable experience')}</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl font-bold text-white/60 mb-10 md:mb-16 max-w-3xl mx-auto tracking-wide leading-relaxed px-4 text-center"
          >
            {t(
              'شاورما | بيتزا | باستا | برجر | فطاير | مشروبات | صوصات — كلها بنكهة مأكولاتي المميزة',
              'Shawarma | Pizza | Pasta | Burgers | Pastries | Drinks | Sauces — all with the special Makolaty flavor'
            )}
          </motion.p>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-stretch md:items-center max-w-[320px] sm:max-w-md md:max-w-none mx-auto px-4">
            <a 
              href="#menu"
              className="px-8 md:px-12 py-4 md:py-5 bg-primary text-secondary font-black rounded-2xl text-lg md:text-xl shadow-2xl shadow-primary/40 hover:scale-105 transition-transform flex items-center justify-center gap-3"
            >
              🍽️ {t('تصفح القائمة', 'Browse menu')}
            </a>
            <a 
              href={`https://wa.me/${formatPhone(STAFF_WHATSAPP)}`}
              className="px-8 md:px-12 py-4 md:py-5 glass text-white font-black rounded-2xl text-lg md:text-xl hover:bg-white/20 transition-all flex items-center justify-center gap-3"
            >
              📱 {t('اطلب عبر واتساب', 'Order via WhatsApp')}
            </a>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-8">
          <div className="text-center md:text-right">
            <h2 className="text-4xl font-black text-primary">{t('قائمة الطعام', 'Our menu')}</h2>
            <p className="text-white/40 font-bold">{t('اختر وجبتك المفضلة من أصنافنا المتنوعة', 'Choose your favorite from our selection')}</p>
          </div>
          
          <div className="w-full md:w-auto">
            <CategoryBar active={activeCategory} onChange={setActiveCategory} />
          </div>
        </div>

        <div className="relative mb-8 max-w-2xl mx-auto md:mx-0 md:mr-auto">
          <Search className="absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t('ابحث عن صنف...', 'Search menu...')}
            dir={language === 'ar' ? 'rtl' : 'ltr'}
            className="w-full rounded-3xl border border-white/10 bg-white/5 py-4 px-14 font-black text-white placeholder:text-white/35 outline-none transition-all focus:border-primary focus:bg-white/10"
          />
        </div>
        
        {filteredMenu.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center">
            <p className="text-xl font-black text-white">{t('لا توجد نتائج', 'No results')}</p>
            <p className="mt-2 text-sm font-bold text-white/40">{t('جرّب البحث باسم مختلف أو اختر تصنيف آخر.', 'Try another search or choose a different category.')}</p>
          </div>
        ) : (
          <div className="flex overflow-x-auto gap-6 md:gap-10 pb-12 no-scrollbar snap-x snap-mandatory px-4 md:px-8 cursor-grab active:cursor-grabbing scroll-smooth">
            {filteredMenu.map(item => (
              <div key={item.id} className="w-[280px] md:w-[350px] shrink-0 snap-start">
                <MenuCard item={item} onAdd={addToCart} />
              </div>
            ))}
          </div>
        )}
      </section>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart} 
        menuItems={menuItems}
        onUpdateQty={updateQty}
        onRemove={removeFromCart}
        onUpdateOption={updateOption}
        onAdd={addToCart}
        onCheckout={() => setIsCheckoutOpen(true)}
        notes={orderNotes}
        onNotesChange={setOrderNotes}
      />

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        onSubmit={handleCheckout} 
        isSubmitting={isSubmitting}
        orderSubtotal={cart.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0)}
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

const MENU_IMAGE_BUCKET = 'menu-images';
const MENU_IMAGE_SIZE = 900;

const resizeMenuImage = async (file: File) => {
  if (!file.type.startsWith('image/')) {
    throw new Error('unsupported-image-type');
  }

  if (file.size > 12 * 1024 * 1024) {
    throw new Error('image-too-large');
  }

  const objectUrl = URL.createObjectURL(file);
  const image = new Image();
  image.src = objectUrl;

  try {
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = MENU_IMAGE_SIZE;
    canvas.height = MENU_IMAGE_SIZE;

    const context = canvas.getContext('2d');
    if (!context) throw new Error('image-processing-failed');

    const sourceSize = Math.min(image.naturalWidth, image.naturalHeight);
    const sourceX = (image.naturalWidth - sourceSize) / 2;
    const sourceY = (image.naturalHeight - sourceSize) / 2;

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(
      image,
      sourceX,
      sourceY,
      sourceSize,
      sourceSize,
      0,
      0,
      MENU_IMAGE_SIZE,
      MENU_IMAGE_SIZE
    );

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) {
          reject(new Error('image-processing-failed'));
          return;
        }
        resolve(blob);
      }, 'image/webp', 0.86);
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

const uploadMenuImage = async (file: File, itemId: string) => {
  const resizedImage = await resizeMenuImage(file);
  const path = `items/${itemId}.webp`;

  const { error } = await supabase.storage
    .from(MENU_IMAGE_BUCKET)
    .upload(path, resizedImage, {
      cacheControl: '31536000',
      contentType: 'image/webp',
      upsert: true,
    });

  if (error) throw error;

  const { data } = supabase.storage.from(MENU_IMAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
};

const MenuManagement = () => {
  const { language, t } = useLanguage();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeMenuCategory, setActiveMenuCategory] = useState('all');
  const [isSaving, setIsSaving] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [form, setForm] = useState({
    nameAr: '',
    nameEn: '',
    category: CATEGORIES[0]?.id || 'shawarma',
    price: '',
    calories: '',
    sizes: [] as { name: string; price: string }[],
    isAvailable: true,
  });

  const loadItems = async () => {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('sortOrder', { ascending: true })
      .order('nameAr', { ascending: true });

    if (error) {
      await handleSupabaseError(error, OperationType.LIST, 'menu_items');
      setMessage('تعذر تحميل عناصر القائمة.');
      return;
    }

    setItems(applyBuiltInMenuOverrides((data || []) as MenuItem[]));
  };

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    if (!selectedImageFile) {
      setImagePreviewUrl('');
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImageFile);
    setImagePreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImageFile]);

  const categoryCounts = items.reduce<Record<string, number>>((counts, item) => {
    counts[item.category] = (counts[item.category] || 0) + 1;
    counts.all = (counts.all || 0) + 1;
    return counts;
  }, { all: 0 });

  const visibleItems = activeMenuCategory === 'all'
    ? items
    : items.filter(item => item.category === activeMenuCategory);

  const selectedItem = selectedItemId
    ? items.find(item => item.id === selectedItemId) || null
    : null;
  const isSuccessMessage = Boolean(message) && (
    message.includes('بنجاح') || message.startsWith('تم استيراد')
  );

  useEffect(() => {
    if (!isSuccessMessage) return;
    const timeout = window.setTimeout(() => setMessage(''), 5000);
    return () => window.clearTimeout(timeout);
  }, [isSuccessMessage, message]);

  const categoryFallbackImages: Record<string, string> = {
    all: 'https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&w=800&q=80',
    shawarma: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=80',
    broast: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
    rockets: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    burgers: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    sides: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80',
  };

  const getCategoryImage = (categoryId: string) => {
    if (categoryId === 'all') {
      return items[0]?.image || INITIAL_MENU[0]?.image || categoryFallbackImages.all;
    }

    return items.find(item => item.category === categoryId)?.image
      || INITIAL_MENU.find(item => item.category === categoryId)?.image
      || categoryFallbackImages[categoryId]
      || categoryFallbackImages.all;
  };

  const importCurrentMenu = async () => {
    setMessage('');
    setIsImporting(true);

    const now = new Date().toISOString();
    const payload = INITIAL_MENU.map((item, index) => sanitizeForSupabase({
      ...item,
      isAvailable: true,
      sortOrder: index,
      createdAt: now,
      updatedAt: now,
    }));

    try {
      const { error } = await supabase
        .from('menu_items')
        .upsert(payload, { onConflict: 'id' });

      if (error) throw error;

      setMessage(`تم استيراد ${payload.length} صنف من القائمة الحالية.`);
      await loadItems();
    } catch (error) {
      await handleSupabaseError(error, OperationType.CREATE, 'menu_items');
      setMessage('تعذر استيراد القائمة الحالية. تأكد من صلاحيات جدول menu_items.');
    } finally {
      setIsImporting(false);
    }
  };

  const addMenuItem = async () => {
    setMessage('');
    const price = Number(form.price);
    const calories = form.calories ? Number(form.calories) : undefined;
    const hasIncompleteSize = form.sizes.some(size => !size.name.trim() || !size.price.trim());
    const sizes = form.sizes.map(size => ({
      name: size.name.trim(),
      price: Number(size.price),
    }));

    if (!form.nameAr.trim() || !form.nameEn.trim() || !form.category || !Number.isFinite(price) || price <= 0) {
      setMessage('يرجى تعبئة الاسم والتصنيف والسعر بشكل صحيح.');
      return;
    }

    if (hasIncompleteSize || sizes.some(size => !Number.isFinite(size.price) || size.price < 0)) {
      setMessage(t('أكمل اسم وسعر كل حجم أو احذف الصف الفارغ.', 'Complete the name and price for every size, or remove the empty row.'));
      return;
    }

    setIsSaving(true);
    const id = selectedItem?.id || `item-${Date.now()}`;

    let saveStage: 'image' | 'item' = 'image';
    try {
      const uploadedImageUrl = selectedImageFile
        ? await uploadMenuImage(selectedImageFile, id)
        : selectedItem?.image || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80';

      saveStage = 'item';
      const payload = sanitizeForSupabase({
        id,
        nameAr: form.nameAr.trim(),
        nameEn: form.nameEn.trim(),
        category: form.category,
        price,
        calories: Number.isFinite(calories) ? calories : undefined,
        image: uploadedImageUrl,
        sizes: sizes.length ? sizes : null,
        isAvailable: form.isAvailable,
        sortOrder: selectedItem?.sortOrder ?? Date.now(),
        ...(selectedItem
          ? { updatedAt: new Date().toISOString() }
          : { createdAt: new Date().toISOString() }),
      });

      const { error } = selectedItem
        ? await supabase.from('menu_items').update(payload).eq('id', selectedItem.id)
        : await supabase.from('menu_items').insert(payload);
      if (error) throw error;
      setMessage(selectedItem ? `تم تحديث ${selectedItem.nameAr} بنجاح.` : 'تمت إضافة الصنف بنجاح.');
      setForm({
        nameAr: '',
        nameEn: '',
        category: CATEGORIES[0]?.id || 'shawarma',
        price: '',
        calories: '',
        sizes: [],
        isAvailable: true,
      });
      setSelectedItemId(null);
      setSelectedImageFile(null);
      await loadItems();
    } catch (error) {
      await handleSupabaseError(error, selectedItem ? OperationType.UPDATE : OperationType.CREATE, 'menu_items');
      if (error instanceof Error && error.message === 'unsupported-image-type') {
        setMessage('نوع الصورة غير مدعوم. ارفع صورة بصيغة PNG أو JPG أو WebP.');
      } else if (error instanceof Error && error.message === 'image-too-large') {
        setMessage('حجم الصورة كبير جداً. اختر صورة أقل من 12MB.');
      } else if (saveStage === 'image') {
        setMessage(t(
          'تعذر رفع الصورة. شغّل ملف supabase/menu_images_storage.sql في Supabase ثم حاول مرة أخرى.',
          'Image upload failed. Run supabase/menu_images_storage.sql in Supabase, then try again.'
        ));
      } else {
        const databaseError = error && typeof error === 'object'
          ? [
              'message' in error ? String(error.message) : '',
              'details' in error ? String(error.details) : '',
              'hint' in error ? String(error.hint) : '',
              'code' in error ? `(${String(error.code)})` : '',
            ].filter(Boolean).join(' ')
          : String(error);
        setMessage(t(
          `تم رفع الصورة، لكن تعذر حفظ الصنف. خطأ قاعدة البيانات: ${databaseError}`,
          `The image uploaded, but the item could not be saved. Database error: ${databaseError}`
        ));
      }
    } finally {
      setIsSaving(false);
    }
  };

  const selectItemForEditing = (item: MenuItem) => {
    setMessage('');
    setSelectedItemId(item.id);
    setSelectedImageFile(null);
    setForm({
      nameAr: item.nameAr,
      nameEn: item.nameEn,
      category: item.category,
      price: String(item.price),
      calories: item.calories === undefined ? '' : String(item.calories),
      sizes: item.sizes?.map(size => ({ name: size.name, price: String(size.price) })) || [],
      isAvailable: item.isAvailable !== false,
    });
  };

  const resetItemForm = () => {
    setSelectedItemId(null);
    setSelectedImageFile(null);
    setMessage('');
    setForm({
      nameAr: '',
      nameEn: '',
      category: CATEGORIES[0]?.id || 'shawarma',
      price: '',
      calories: '',
      sizes: [],
      isAvailable: true,
    });
  };

  return (
    <>
      <AnimatePresence>
        {isSuccessMessage ? (
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 0.96 }}
            className="fixed inset-x-4 top-5 z-[200] mx-auto max-w-lg overflow-hidden rounded-3xl border border-emerald-400/30 bg-[#10271d]/95 p-5 shadow-2xl shadow-black/50 backdrop-blur-xl"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-400 text-[#10271d] shadow-lg shadow-emerald-400/20">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div className="min-w-0 flex-1 text-right">
                <p className="text-lg font-black text-white">{t('تم الحفظ بنجاح', 'Saved successfully')}</p>
                <p className="mt-1 text-sm font-bold leading-relaxed text-emerald-100/70">{message}</p>
              </div>
              <button
                type="button"
                onClick={() => setMessage('')}
                aria-label={t('إغلاق', 'Close')}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 5, ease: 'linear' }}
              className="absolute inset-x-0 bottom-0 h-1 origin-left bg-emerald-400"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

    <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
      <div className="glass rounded-3xl p-6 text-right h-fit">
        <h2 className="text-2xl font-black text-primary mb-2">
          {selectedItem
            ? t(`تعديل ${selectedItem.nameAr}`, `Edit ${selectedItem.nameEn}`)
            : t('إضافة صنف جديد', 'Add new item')}
        </h2>
        <p className="text-white/40 text-sm font-bold mb-6">
          {selectedItem
            ? t('عدّل السعر أو تفاصيل الصنف ثم احفظ التغييرات.', 'Change the price or item details, then save.')
            : t('أضف أي صنف جديد وسيظهر في قائمة العملاء.', 'Add a new item and it will appear on the customer menu.')}
        </p>

        {selectedItem ? (
          <button
            type="button"
            onClick={resetItemForm}
            className="w-full py-3 mb-4 border border-white/15 text-white/70 font-black rounded-2xl hover:border-primary hover:text-primary transition-all"
          >
            {t('إلغاء التعديل وإضافة صنف جديد', 'Cancel editing and add a new item')}
          </button>
        ) : null}

        {!selectedItem ? <button
          onClick={importCurrentMenu}
          disabled={isImporting}
          className="w-full py-4 mb-6 bg-white/5 border border-primary/30 text-primary font-black rounded-2xl hover:bg-primary hover:text-secondary disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" /> {isImporting ? t('جاري استيراد القائمة...', 'Importing menu...') : t('استيراد القائمة الحالية', 'Import current menu')}
        </button> : null}

        <div className="space-y-4">
          <input
            value={form.nameAr}
            onChange={e => setForm({ ...form, nameAr: e.target.value })}
            placeholder={t('اسم الصنف بالعربي', 'Item name in Arabic')}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-right font-bold focus:outline-none focus:border-primary"
          />
          <input
            value={form.nameEn}
            onChange={e => setForm({ ...form, nameEn: e.target.value })}
            placeholder={t('اسم الصنف بالإنجليزي', 'Item name in English')}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-right font-bold focus:outline-none focus:border-primary"
          />
          <select
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
            className="w-full bg-secondary border border-white/10 rounded-2xl px-4 py-3 text-right font-bold focus:outline-none focus:border-primary"
          >
            {CATEGORIES.map(category => (
              <option key={category.id} value={category.id}>{category.nameAr}</option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-right text-sm font-black text-white/60">
              {t('السعر', 'Price')}
              <input
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                placeholder={t('أدخل السعر', 'Enter price')}
                type="number"
                min="0"
                step="0.5"
                className="mt-2 w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-right font-bold text-white focus:outline-none focus:border-primary"
              />
            </label>
            <label className="block text-right text-sm font-black text-white/60">
              {t('السعرات', 'Calories')}
              <input
                value={form.calories}
                onChange={e => setForm({ ...form, calories: e.target.value })}
                placeholder={t('أدخل السعرات', 'Enter calories')}
                type="number"
                min="0"
                className="mt-2 w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-right font-bold text-white focus:outline-none focus:border-primary"
              />
            </label>
          </div>
          <label className="block cursor-pointer rounded-3xl border border-dashed border-primary/40 bg-primary/5 p-4 transition-all hover:border-primary hover:bg-primary/10">
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/*"
              onChange={e => setSelectedImageFile(e.target.files?.[0] || null)}
              className="sr-only"
            />
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 overflow-hidden rounded-2xl border border-white/10 bg-secondary shrink-0">
                {imagePreviewUrl ? (
                  <img src={imagePreviewUrl} alt="معاينة صورة الصنف" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-primary">
                    <Upload className="h-7 w-7" />
                  </div>
                )}
              </div>
              <div className="flex-1 text-right">
                <p className="font-black text-white">
                  {selectedImageFile ? selectedImageFile.name : t('رفع صورة الصنف', 'Upload item image')}
                </p>
                <p className="mt-1 text-xs font-bold leading-relaxed text-white/45">
                  {t('PNG أو JPG أو WebP. سيتم ضبطها تلقائياً إلى مقاس موحد للقائمة.', 'PNG, JPG, or WebP. The image will be resized automatically.')}
                </p>
              </div>
            </div>
          </label>
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="text-right">
                <p className="font-black text-white">{t('الأحجام والأسعار', 'Sizes and prices')}</p>
                <p className="text-xs font-bold text-white/40">{t('اختياري — أضف صفاً لكل حجم', 'Optional — add one row per size')}</p>
              </div>
              <button
                type="button"
                onClick={() => setForm(current => ({
                  ...current,
                  sizes: [...current.sizes, { name: '', price: '' }],
                }))}
                className="flex shrink-0 items-center gap-1.5 rounded-xl bg-primary/10 px-3 py-2 text-xs font-black text-primary transition-all hover:bg-primary hover:text-secondary"
              >
                <Plus className="h-4 w-4" /> {t('إضافة حجم', 'Add size')}
              </button>
            </div>

            {form.sizes.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-white/10 px-4 py-5 text-center text-xs font-bold text-white/30">
                {t('لا توجد أحجام إضافية', 'No additional sizes')}
              </p>
            ) : (
              <div className="space-y-2">
                {form.sizes.map((size, index) => (
                  <div key={index} className="grid grid-cols-[1fr_110px_42px] items-end gap-2 rounded-2xl bg-white/5 p-3">
                    <label className="text-xs font-black text-white/50">
                      {t('اسم الحجم', 'Size name')}
                      <input
                        value={size.name}
                        onChange={event => setForm(current => ({
                          ...current,
                          sizes: current.sizes.map((row, rowIndex) => rowIndex === index ? { ...row, name: event.target.value } : row),
                        }))}
                        placeholder={t('مثال: كبير', 'e.g. Large')}
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-secondary/60 px-3 py-2.5 font-bold text-white focus:border-primary focus:outline-none"
                      />
                    </label>
                    <label className="text-xs font-black text-white/50">
                      {t('السعر', 'Price')}
                      <input
                        value={size.price}
                        onChange={event => setForm(current => ({
                          ...current,
                          sizes: current.sizes.map((row, rowIndex) => rowIndex === index ? { ...row, price: event.target.value } : row),
                        }))}
                        type="number"
                        min="0"
                        step="0.5"
                        placeholder="0"
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-secondary/60 px-3 py-2.5 text-center font-black text-white focus:border-primary focus:outline-none"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setForm(current => ({
                        ...current,
                        sizes: current.sizes.filter((_, rowIndex) => rowIndex !== index),
                      }))}
                      aria-label={t('حذف الحجم', 'Remove size')}
                      className="flex h-[42px] items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 transition-all hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <label className="flex items-center justify-end gap-3 text-white/60 font-bold">
            {t('متاح للعملاء', 'Available to customers')}
            <input
              type="checkbox"
              checked={form.isAvailable}
              onChange={e => setForm({ ...form, isAvailable: e.target.checked })}
              className="w-5 h-5 accent-primary"
            />
          </label>
          {message && !isSuccessMessage ? (
            <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm font-bold leading-relaxed text-red-200" role="alert">
              {message}
            </div>
          ) : null}
          <button
            onClick={addMenuItem}
            disabled={isSaving}
            className="w-full py-4 bg-primary text-secondary font-black rounded-2xl hover:bg-accent disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {selectedItem ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {isSaving ? t('جاري الحفظ...', 'Saving...') : selectedItem ? t('حفظ التغييرات', 'Save changes') : t('إضافة الصنف', 'Add item')}
          </button>
        </div>
      </div>

      <div className="glass rounded-3xl p-6 text-right">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-primary">{t('الأصناف المضافة', 'Menu items')}</h2>
            <p className="text-white/40 text-sm font-bold">{t('اعرض الأصناف حسب التصنيف بدلاً من قائمة واحدة طويلة.', 'Browse items by category.')}</p>
          </div>
          <span className="text-white/40 font-black text-sm">{visibleItems.length} {t('صنف', 'items')}</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mb-6">
          {[{ id: 'all', nameAr: 'الكل', nameEn: 'All' }, ...CATEGORIES].map(category => {
            const isActive = activeMenuCategory === category.id;
            const count = categoryCounts[category.id] || 0;

            return (
              <button
                key={category.id}
                onClick={() => setActiveMenuCategory(category.id)}
                className={cn(
                  "group relative min-h-[120px] overflow-hidden rounded-3xl border text-right transition-all focus:outline-none focus:ring-2 focus:ring-primary/70",
                  isActive
                    ? "border-primary shadow-[0_18px_40px_rgba(255,210,0,0.22)]"
                    : "border-white/10 hover:border-primary/60"
                )}
              >
                <img
                  src={getCategoryImage(category.id)}
                  alt={category.nameAr}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className={cn(
                  "absolute inset-0 transition-colors",
                  isActive
                    ? "bg-gradient-to-t from-secondary via-secondary/60 to-primary/20"
                    : "bg-gradient-to-t from-secondary via-secondary/65 to-black/15"
                )} />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className={cn(
                    "text-lg font-black leading-tight",
                    isActive ? "text-primary" : "text-white"
                  )}>
                    {language === 'ar' ? category.nameAr : category.nameEn}
                  </p>
                  <p className="mt-1 text-xs font-black text-white/55">{count} {t('صنف', 'items')}</p>
                </div>
              </button>
            );
          })}
        </div>

        {items.length === 0 ? (
          <p className="text-white/40 font-bold">{t('لا توجد أصناف مضافة حتى الآن.', 'No menu items have been added yet.')}</p>
        ) : visibleItems.length === 0 ? (
          <p className="text-white/40 font-bold">{t('لا توجد أصناف في هذا التصنيف.', 'There are no items in this category.')}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleItems.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => selectItemForEditing(item)}
                className={cn(
                  "w-full bg-white/5 rounded-2xl p-4 border flex gap-4 items-center text-right transition-all hover:border-primary/60 hover:bg-primary/5",
                  selectedItemId === item.id ? "border-primary ring-2 ring-primary/20" : "border-white/10"
                )}
              >
                <img src={item.image} alt={item.nameEn} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="font-black text-white">{language === 'ar' ? item.nameAr : item.nameEn}</p>
                  <p className="text-white/40 text-xs font-bold">{language === 'ar' ? item.nameEn : item.nameAr}</p>
                  <p className="text-primary font-black mt-1">{item.price} SR</p>
                  {item.sizes?.length ? (
                    <p className="mt-1 text-[11px] font-bold text-white/45">
                      {item.sizes.map(size => `${size.name}: ${size.price} SR`).join(' • ')}
                    </p>
                  ) : null}
                </div>
                <span className={cn(
                  "text-[10px] px-2 py-1 rounded-full font-black",
                  item.isAvailable ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                )}>
                  {item.isAvailable ? t('متاح', 'Available') : t('مخفي', 'Hidden')}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

const StaffDashboard = () => {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isStaffUnlocked, setIsStaffUnlocked] = useState(() => sessionStorage.getItem('makolaty_staff_unlocked') === 'true');
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeView, setActiveView] = useState<'orders' | 'menu'>('menu');

  useEffect(() => {
    if (!isStaffUnlocked) return;
    const path = 'orders';

    const loadOrders = async () => {
      const { data, error } = await supabase
        .from(path)
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) {
        await handleSupabaseError(error, OperationType.LIST, path);
        return;
      }

      setOrders((data || []) as Order[]);
    };

    loadOrders();

    const channel = supabase
      .channel('orders-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: path }, loadOrders)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isStaffUnlocked]);

  const handleLogin = () => {
    if (passcode.trim() !== STAFF_PASSCODE) {
      setLoginError(t('رمز الدخول غير صحيح', 'Incorrect access code'));
      return;
    }

    sessionStorage.setItem('makolaty_staff_unlocked', 'true');
    setIsStaffUnlocked(true);
    setPasscode('');
    setLoginError('');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('makolaty_staff_unlocked');
    setIsStaffUnlocked(false);
    setOrders([]);
    setActiveView('menu');
  };

  const updateStatus = async (id: string, status: string) => {
    const path = `orders/${id}`;
    try {
      const { error } = await supabase.from('orders').update({ status }).eq('id', id);
      if (error) throw error;
    } catch (err) {
      await handleSupabaseError(err, OperationType.UPDATE, path);
    }
  };

  if (!isStaffUnlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass p-12 rounded-[3rem] text-center max-w-md w-full">
          <div className="mb-6 flex justify-end"><LanguageSwitch /></div>
          <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-secondary" />
          </div>
          <h2 className="text-3xl font-black mb-2">{t('دخول الموظفين', 'Staff login')}</h2>
          <p className="text-white/40 mb-8">{t('أدخل رمز الموظفين للوصول إلى لوحة الإدارة', 'Enter the staff access code to open the dashboard')}</p>
          <input
            value={passcode}
            onChange={e => {
              setPasscode(e.target.value);
              setLoginError('');
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') handleLogin();
            }}
            type="password"
            inputMode="numeric"
            autoFocus
            placeholder={t('رمز الدخول', 'Access code')}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-center font-black text-xl tracking-widest focus:outline-none focus:border-primary mb-4"
          />
          {loginError && <p className="text-red-400 font-bold text-sm mb-4">{loginError}</p>}
          <button 
            onClick={handleLogin}
            className="w-full py-4 bg-primary text-secondary font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-accent transition-all"
          >
            {t('دخول لوحة الموظفين', 'Open staff dashboard')}
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
            <h1 className="text-4xl font-black text-primary">{t('لوحة الموظفين', 'Staff dashboard')}</h1>
            <p className="text-white/40">{t('إدارة قائمة المطعم', 'Manage the restaurant menu')}</p>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitch />
            <button onClick={handleLogout} aria-label={t('تسجيل الخروج', 'Log out')} className="p-3 bg-white/5 rounded-xl hover:text-red-500 transition-colors">
              <LogOut />
            </button>
          </div>
        </div>

        {activeView === 'menu' ? (
          <MenuManagement />
        ) : (
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
                    {formatOrderTime(order.createdAt)}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-start items-center bg-white/5 p-3 rounded-xl gap-3">
                    <span className="w-8 h-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center font-black text-sm shrink-0">
                      {item.quantity}
                    </span>
                    <div className="text-right flex-1">
                      <p className="font-black text-sm text-white">{item.nameAr}</p>
                      {item.selectedSize && <p className="text-[10px] text-primary font-black">{item.selectedSize}</p>}
                      <div className="flex flex-wrap gap-1 mt-1 justify-end">
                        {item.spicyLevel === 1 && <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded text-[10px] font-bold">حراق</span>}
                        {item.spicyLevel === 2 && <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded text-[10px] font-bold">حراق اكسترا</span>}
                        {item.mayoLevel === 1 && <span className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded text-[10px] font-bold">مايونيز</span>}
                        {item.mayoLevel === 2 && <span className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded text-[10px] font-bold">مايونيز اكسترا</span>}
                        {item.ketchupLevel === 1 && <span className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded text-[10px] font-bold">كاتشب</span>}
                        {item.ketchupLevel === 2 && <span className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded text-[10px] font-bold">كاتشب اكسترا</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {order.notes && (
                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 mb-4 text-right">
                  <p className="text-primary text-[10px] font-black mb-1">الملاحظات</p>
                  <p className="text-white font-bold text-sm leading-relaxed">{order.notes}</p>
                </div>
              )}

              <div className="flex justify-between items-center mb-6 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-white/40 text-sm font-bold">
                  {order.orderType === 'delivery' ? (
                    <><MapPin className="w-4 h-4" /> توصيل</>
                  ) : (
                    <><ShoppingBag className="w-4 h-4" /> استلام</>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-white/40 font-black uppercase mb-1">الإجمالي</p>
                  {order.orderType === 'delivery' && (
                    <p className="text-[10px] text-white/40 font-bold mb-1">
                      التوصيل {order.deliveryFee ?? 0} SR
                      {order.deliveryDistanceKm ? ` | ${order.deliveryDistanceKm} كم` : ''}
                    </p>
                  )}
                  <span className="text-2xl font-black text-primary">{order.total} SR</span>
                </div>
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
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/staff" element={<StaffDashboard />} />
          </Routes>
        </ErrorBoundary>
      </Router>
    </LanguageProvider>
  );
}
