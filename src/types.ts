export interface MenuItem {
  id: string;
  nameAr: string;
  nameEn: string;
  category: string;
  price: number;
  calories?: number;
  image: string;
  sizes?: { name: string; price: number }[];
}

export interface CartItem extends MenuItem {
  quantity: number;
  selectedSize?: string;
  finalPrice: number;
}

export interface Order {
  id?: string;
  customerName: string;
  customerPhone: string;
  orderType: 'pickup' | 'delivery';
  googleMapsLink?: string;
  items: CartItem[];
  total: number;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: any;
}

export const CATEGORIES = [
  { id: 'shawarma', nameAr: 'شاورما', nameEn: 'Shawarma' },
  { id: 'pastries', nameAr: 'معجنات/فطاير', nameEn: 'Pastries' },
  { id: 'pizza', nameAr: 'بيتزا', nameEn: 'Pizza' },
  { id: 'meals', nameAr: 'وجبات', nameEn: 'Meals' },
  { id: 'sandwiches', nameAr: 'ساندوتشات', nameEn: 'Sandwiches' },
  { id: 'pasta', nameAr: 'باستا', nameEn: 'Pasta' },
  { id: 'appetizers', nameAr: 'مقبلات', nameEn: 'Appetizers' },
  { id: 'drinks', nameAr: 'مشروبات', nameEn: 'Drinks' },
  { id: 'sauces', nameAr: 'صوصات', nameEn: 'Sauces' },
];

export const STAFF_WHATSAPP = '+966535110460';
