export interface MenuSize {
  name: string;
  price: number;
  calories?: number;
}

export interface MenuItem {
  id: string;
  nameAr: string;
  nameEn: string;
  category: string;
  price: number;
  calories?: number;
  image: string;
  sizes?: MenuSize[];
  isAvailable?: boolean;
  sortOrder?: number;
}

export interface SelectedAddOn {
  id: 'extra-cheese' | 'extra-chicken' | 'shawarma-extra-cheese';
  nameAr: string;
  nameEn: string;
  price: number;
}

export interface CartItem extends MenuItem {
  quantity: number;
  selectedSize?: string;
  finalPrice: number;
  basePrice: number;
  addOns?: SelectedAddOn[];
  ketchupLevel?: number; // 0=none, 1=regular, 2=extra
  mayoLevel?: number;    // 0=none, 1=regular, 2=extra
  spicyLevel?: number;   // 0=none, 1=regular, 2=extra
}

export interface Order {
  id?: string;
  customerName: string;
  customerPhone: string;
  orderType: 'pickup' | 'delivery';
  googleMapsLink?: string;
  items: CartItem[];
  subtotal?: number;
  deliveryFee?: number;
  deliveryDistanceKm?: number;
  total: number;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: any;
}

export const CATEGORIES = [
  { id: 'shawarma', nameAr: 'شاورما', nameEn: 'Shawarma' },
  { id: 'pastries', nameAr: 'معجنات/فطاير', nameEn: 'Pastries' },
  { id: 'pizza', nameAr: 'بيتزا', nameEn: 'Pizza' },
  { id: 'meals', nameAr: 'برقر', nameEn: 'Burgers' },
  { id: 'broast', nameAr: 'بروست', nameEn: 'Broast' },
  { id: 'sandwiches', nameAr: 'ساندوتشات', nameEn: 'Sandwiches' },
  { id: 'pasta', nameAr: 'باستا', nameEn: 'Pasta' },
  { id: 'appetizers', nameAr: 'مقبلات', nameEn: 'Appetizers' },
  { id: 'drinks', nameAr: 'مشروبات', nameEn: 'Drinks' },
  { id: 'sauces', nameAr: 'صوصات', nameEn: 'Sauces' },
];

export const STAFF_WHATSAPP = '+966535110460';
