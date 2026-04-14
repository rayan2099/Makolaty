import { MenuItem } from './types';

export const INITIAL_MENU: MenuItem[] = [
  // --- Shawarma ---
  {
    id: 'sh-1',
    nameAr: 'شاورما صغير صاج',
    nameEn: 'Small Shawarma Saj',
    category: 'shawarma',
    price: 6,
    calories: 300,
    image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sh-2',
    nameAr: 'صاروخ مأكولاتي',
    nameEn: 'My Food Rocket',
    category: 'shawarma',
    price: 11,
    calories: 660,
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sh-3',
    nameAr: 'جامبو دجاج',
    nameEn: 'Chicken Jumbo',
    category: 'shawarma',
    price: 10,
    calories: 470,
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sh-4',
    nameAr: 'صحن شاورما دجاج',
    nameEn: 'Chicken Shawarma Plate',
    category: 'shawarma',
    price: 19,
    calories: 1311,
    image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sh-5',
    nameAr: 'صحن عربي دجاج',
    nameEn: 'Arabic Chicken Plate',
    category: 'shawarma',
    price: 16,
    calories: 1095,
    image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sh-6',
    nameAr: 'لغاويص شاورما',
    nameEn: 'Shawarma Ghwais',
    category: 'shawarma',
    price: 13,
    calories: 1311,
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sh-7',
    nameAr: 'صاروخ دجاج',
    nameEn: 'Chicken Rocket',
    category: 'shawarma',
    price: 11,
    calories: 650,
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sh-8',
    nameAr: 'صاروخ أمريكي',
    nameEn: 'American Rocket',
    category: 'shawarma',
    price: 16,
    calories: 800,
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sh-9',
    nameAr: 'شاورما تورتيلا',
    nameEn: 'Tortilla Shawarma',
    category: 'shawarma',
    price: 12,
    calories: 740,
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80'
  },

  // --- Pastries ---
  {
    id: 'pt-1',
    nameAr: 'لبنة بالعسل',
    nameEn: 'Labaneh with Honey',
    category: 'pastries',
    price: 9,
    calories: 654,
    image: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?auto=format&fit=crop&w=800&q=80',
    sizes: [
      { name: 'صغير', price: 9 },
      { name: 'وسط', price: 16 },
      { name: 'كبير', price: 22 }
    ]
  },
  {
    id: 'pt-2',
    nameAr: 'لبنة بالزعتر',
    nameEn: 'Labaneh with Thyme',
    category: 'pastries',
    price: 9,
    calories: 623,
    image: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?auto=format&fit=crop&w=800&q=80',
    sizes: [
      { name: 'صغير', price: 9 },
      { name: 'وسط', price: 16 },
      { name: 'كبير', price: 22 }
    ]
  },
  {
    id: 'pt-5',
    nameAr: 'لبنة بالزيتون',
    nameEn: 'Labaneh with Olives',
    category: 'pastries',
    price: 9,
    calories: 653,
    image: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?auto=format&fit=crop&w=800&q=80',
    sizes: [
      { name: 'صغير', price: 9 },
      { name: 'وسط', price: 16 },
      { name: 'كبير', price: 22 }
    ]
  },
  {
    id: 'pt-6',
    nameAr: 'فطيرة لحم',
    nameEn: 'Meat Pie',
    category: 'pastries',
    price: 10,
    calories: 479,
    image: 'https://images.unsplash.com/photo-1512152272829-e3139592d56f?auto=format&fit=crop&w=800&q=80',
    sizes: [
      { name: 'صغير', price: 10 },
      { name: 'وسط', price: 16 },
      { name: 'كبير', price: 22 }
    ]
  },
  {
    id: 'pt-7',
    nameAr: 'عش البلبل',
    nameEn: "Nightingale's Nest",
    category: 'pastries',
    price: 9,
    calories: 927,
    image: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?auto=format&fit=crop&w=800&q=80',
    sizes: [
      { name: 'صغير', price: 9 },
      { name: 'وسط', price: 17 },
      { name: 'كبير', price: 23 }
    ]
  },
  {
    id: 'pt-8',
    nameAr: 'صحن مشكل',
    nameEn: 'Mixed Platter',
    category: 'pastries',
    price: 30,
    calories: 2238,
    image: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pt-3',
    nameAr: 'جبن',
    nameEn: 'Cheese Pastry',
    category: 'pastries',
    price: 8,
    calories: 805,
    image: 'https://images.unsplash.com/photo-1512152272829-e3139592d56f?auto=format&fit=crop&w=800&q=80',
    sizes: [
      { name: 'صغير', price: 8 },
      { name: 'وسط', price: 13 },
      { name: 'كبير', price: 18 }
    ]
  },
  {
    id: 'pt-4',
    nameAr: 'زعتر',
    nameEn: 'Thyme Pastry',
    category: 'pastries',
    price: 7,
    calories: 500,
    image: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?auto=format&fit=crop&w=800&q=80',
    sizes: [
      { name: 'صغير', price: 7 },
      { name: 'وسط', price: 12 },
      { name: 'كبير', price: 17 }
    ]
  },

  // --- Pizza ---
  {
    id: 'pz-1',
    nameAr: 'مأكولاتي سبيشل',
    nameEn: 'My Special Food Pizza',
    category: 'pizza',
    price: 13,
    calories: 693,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    sizes: [
      { name: 'صغير', price: 13 },
      { name: 'وسط', price: 24 },
      { name: 'كبير', price: 29 }
    ]
  },
  {
    id: 'pz-4',
    nameAr: 'بيتزا لحم',
    nameEn: 'Meat Pizza',
    category: 'pizza',
    price: 10,
    calories: 591,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    sizes: [
      { name: 'صغير', price: 10 },
      { name: 'وسط', price: 17 },
      { name: 'كبير', price: 23 }
    ]
  },
  {
    id: 'pz-5',
    nameAr: 'بيتزا رنش',
    nameEn: 'Ranch Pizza',
    category: 'pizza',
    price: 13,
    calories: 470,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    sizes: [
      { name: 'صغير', price: 13 },
      { name: 'وسط', price: 24 },
      { name: 'كبير', price: 29 }
    ]
  },
  {
    id: 'pz-6',
    nameAr: 'بيتزا جمبري',
    nameEn: 'Shrimp Pizza',
    category: 'pizza',
    price: 15,
    calories: 709,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    sizes: [
      { name: 'صغير', price: 15 },
      { name: 'وسط', price: 25 },
      { name: 'كبير', price: 30 }
    ]
  },
  {
    id: 'pz-2',
    nameAr: 'بيتزا خضار',
    nameEn: 'Vegetables Pizza',
    category: 'pizza',
    price: 9,
    calories: 461,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    sizes: [
      { name: 'صغير', price: 9 },
      { name: 'وسط', price: 16 },
      { name: 'كبير', price: 22 }
    ]
  },
  {
    id: 'pz-3',
    nameAr: 'بيتزا دجاج',
    nameEn: 'Chicken Pizza',
    category: 'pizza',
    price: 10,
    calories: 576,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    sizes: [
      { name: 'صغير', price: 10 },
      { name: 'وسط', price: 17 },
      { name: 'كبير', price: 23 }
    ]
  },

  // --- Meals ---
  {
    id: 'ml-1',
    nameAr: 'وجبة برجر دجاج',
    nameEn: 'Chicken Burger Meal',
    category: 'meals',
    price: 16,
    calories: 300,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ml-4',
    nameAr: 'وجبة برجر لحم مشوي دبل',
    nameEn: 'Double Grilled Beef Burger Meal',
    category: 'meals',
    price: 33,
    calories: 660,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ml-5',
    nameAr: 'وجبة فاهيتا دجاج',
    nameEn: 'Chicken Fajita Meal',
    category: 'meals',
    price: 20,
    calories: 850,
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ml-6',
    nameAr: 'وجبة كلاسيك كرسبي',
    nameEn: 'Classic Crispy Meal',
    category: 'meals',
    price: 23,
    calories: 480,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ml-7',
    nameAr: 'وجبة برجر لحم كراميل',
    nameEn: 'Caramel Beef Burger Meal',
    category: 'meals',
    price: 23,
    calories: 460,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ml-2',
    nameAr: 'وجبة كرسبي جامبو',
    nameEn: 'Crispy Jumbo Meal',
    category: 'meals',
    price: 20,
    calories: 2033,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ml-3',
    nameAr: 'وجبة ساندويتش تورتيلا',
    nameEn: 'Tortilla Sandwich Meal',
    category: 'meals',
    price: 20,
    calories: 800,
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80'
  },

  // --- Sandwiches ---
  {
    id: 'sw-1',
    nameAr: 'برجر دجاج',
    nameEn: 'Chicken Burger',
    category: 'sandwiches',
    price: 8,
    calories: 300,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sw-2',
    nameAr: 'برجر لحم مشوي',
    nameEn: 'Grilled Beef Burger',
    category: 'sandwiches',
    price: 15,
    calories: 465,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'
  },

  // --- Pasta ---
  {
    id: 'ps-1',
    nameAr: 'باستا دجاج بالكريمة فيتوتشيني',
    nameEn: 'Creamy Chicken Fettuccine',
    category: 'pasta',
    price: 15,
    calories: 750,
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80',
    sizes: [
      { name: 'صغير', price: 15 },
      { name: 'كبير', price: 25 }
    ]
  },
  {
    id: 'ps-2',
    nameAr: 'باستا الفريدو',
    nameEn: 'Alfredo Pasta',
    category: 'pasta',
    price: 15,
    calories: 400,
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80',
    sizes: [
      { name: 'صغير', price: 15 },
      { name: 'كبير', price: 25 }
    ]
  },

  // --- Appetizers ---
  {
    id: 'ap-1',
    nameAr: 'بطاطس جبن',
    nameEn: 'Potatoes and Cheese',
    category: 'appetizers',
    price: 10,
    calories: 350,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ap-2',
    nameAr: 'ورق عنب',
    nameEn: 'Vine Leaves',
    category: 'appetizers',
    price: 6,
    calories: 433,
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=800&q=80',
    sizes: [
      { name: 'صغير', price: 6 },
      { name: 'كبير', price: 15 }
    ]
  },
  {
    id: 'ap-3',
    nameAr: 'حمص',
    nameEn: 'Hummus',
    category: 'appetizers',
    price: 7,
    calories: 210,
    image: 'https://images.unsplash.com/photo-1577906030551-59758a51244f?auto=format&fit=crop&w=800&q=80'
  }
];
