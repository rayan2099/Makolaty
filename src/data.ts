import { MenuItem } from './types';

export const INITIAL_MENU: MenuItem[] = [
  // --- Shawarma (شاورما) ---
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
    nameAr: 'صحن عربي قرصان',
    nameEn: 'Arabic Pirate Plate',
    category: 'shawarma',
    price: 17,
    calories: 900,
    image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sh-7',
    nameAr: 'لغاویص شاورما',
    nameEn: 'Shawarma Ghwais',
    category: 'shawarma',
    price: 13,
    calories: 1311,
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sh-8',
    nameAr: 'صاروخ دجاج',
    nameEn: 'Chicken Rocket',
    category: 'shawarma',
    price: 11,
    calories: 650,
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sh-9',
    nameAr: 'صاروخ أمریكي',
    nameEn: 'American Rocket',
    category: 'shawarma',
    price: 16,
    calories: 800,
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sh-10',
    nameAr: 'صاروخ شامي',
    nameEn: 'Levant Rocket',
    category: 'shawarma',
    price: 11,
    calories: 720,
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sh-11',
    nameAr: 'شاورما تورتیلا',
    nameEn: 'Tortilla Shawarma',
    category: 'shawarma',
    price: 12,
    calories: 740,
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sh-12',
    nameAr: 'صامولي دجاج',
    nameEn: 'Chicken Samoli',
    category: 'shawarma',
    price: 4,
    calories: 378,
    image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sh-13',
    nameAr: 'مفرود دجاج',
    nameEn: 'Chicken Mafrod',
    category: 'shawarma',
    price: 5,
    calories: 320,
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sh-14',
    nameAr: 'صاروخ قرصان دجاج',
    nameEn: 'Chicken Pirate Rocket',
    category: 'shawarma',
    price: 12,
    calories: 580,
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=80'
  },

  // --- Appetizers (مقبلات) ---
  {
    id: 'ap-1',
    nameAr: 'بطاطس جبن',
    nameEn: 'Potatoes and cheese',
    category: 'appetizers',
    price: 10,
    calories: 350,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ap-2',
    nameAr: 'بطاطس',
    nameEn: 'Potatoes',
    category: 'appetizers',
    price: 6,
    calories: 311,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80',
    sizes: [
      { name: 'صغير', price: 6 },
      { name: 'وسط', price: 8 },
      { name: 'كبير', price: 14 }
    ]
  },
  {
    id: 'ap-5',
    nameAr: 'ورق عنب',
    nameEn: 'Vine leaves',
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
    id: 'ap-7',
    nameAr: 'حمص',
    nameEn: 'Hummus',
    category: 'appetizers',
    price: 7,
    calories: 210,
    image: 'https://images.unsplash.com/photo-1577906030551-59758a51244f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ap-8',
    nameAr: 'مقبلات مشكل',
    nameEn: 'Appetizers Mixed',
    category: 'appetizers',
    price: 7,
    calories: 349,
    image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ap-9',
    nameAr: 'حلقات بصل',
    nameEn: 'Onion rings',
    category: 'appetizers',
    price: 6,
    calories: 279,
    image: 'https://images.unsplash.com/photo-1639024471283-035188835118?auto=format&fit=crop&w=800&q=80'
  },

  // --- Sauces (الصوصات) ---
  {
    id: 'sc-1',
    nameAr: 'صوص مشكل',
    nameEn: 'Mixed sauce',
    category: 'sauces',
    price: 2,
    calories: 144,
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sc-2',
    nameAr: 'صوص ثوم حار',
    nameEn: 'Hot garlic sauce',
    category: 'sauces',
    price: 1,
    calories: 150,
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sc-3',
    nameAr: 'ثوم',
    nameEn: 'Garlic',
    category: 'sauces',
    price: 1,
    calories: 140,
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sc-4',
    nameAr: 'صوص مأكولاتي',
    nameEn: 'Food sauce',
    category: 'sauces',
    price: 1,
    calories: 140,
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sc-5',
    nameAr: 'صوص حار',
    nameEn: 'Hot sauce',
    category: 'sauces',
    price: 2,
    calories: 145,
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sc-6',
    nameAr: 'صوص مدخن',
    nameEn: 'Smoker sauce',
    category: 'sauces',
    price: 2,
    calories: 153,
    image: 'https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sc-7',
    nameAr: 'صوص جبن',
    nameEn: 'Cheese sauce',
    category: 'sauces',
    price: 2,
    calories: 160,
    image: 'https://images.unsplash.com/photo-1639129937330-fb3fb44f00d6?auto=format&fit=crop&w=800&q=80'
  },

  // --- Pasta (باستا) ---
  {
    id: 'ps-1',
    nameAr: 'باستا بالخضار',
    nameEn: 'Pasta With Vegetables',
    category: 'pasta',
    price: 10,
    calories: 330,
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80',
    sizes: [
      { name: 'صغير', price: 10 },
      { name: 'كبير', price: 20 }
    ]
  },
  {
    id: 'ps-2',
    nameAr: 'باستا الفریدو',
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
  {
    id: 'ps-3',
    nameAr: 'بشامیل',
    nameEn: 'Bechamel Pasta',
    category: 'pasta',
    price: 15,
    calories: 435,
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80',
    sizes: [
      { name: 'صغير', price: 15 },
      { name: 'كبير', price: 25 }
    ]
  },
  {
    id: 'ps-4',
    nameAr: 'باستا جمبري',
    nameEn: 'Shrimp Pasta',
    category: 'pasta',
    price: 20,
    calories: 460,
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80',
    sizes: [
      { name: 'صغير', price: 20 },
      { name: 'كبير', price: 30 }
    ]
  },
  {
    id: 'ps-5',
    nameAr: 'مكرونة بالجبن',
    nameEn: 'Cheese Pasta',
    category: 'pasta',
    price: 10,
    calories: 450,
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80',
    sizes: [
      { name: 'صغير', price: 10 },
      { name: 'كبير', price: 20 }
    ]
  },
  {
    id: 'ps-6',
    nameAr: 'باستا دجاج بالكریمة فیتوتشينی',
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
    id: 'ps-7',
    nameAr: 'باستا بولینيس',
    nameEn: 'Bolognese Pasta',
    category: 'pasta',
    price: 20,
    calories: 430,
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80',
    sizes: [
      { name: 'صغير', price: 20 },
      { name: 'كبير', price: 31 }
    ]
  },
  {
    id: 'ps-8',
    nameAr: 'مكرونة البیني',
    nameEn: 'Penne Pasta',
    category: 'pasta',
    price: 10,
    calories: 320,
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80',
    sizes: [
      { name: 'صغير', price: 10 },
      { name: 'كبير', price: 20 }
    ]
  },
  {
    id: 'ps-9',
    nameAr: 'باستا لازانيا',
    nameEn: 'Lasagna Pasta',
    category: 'pasta',
    price: 15,
    calories: 470,
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80',
    sizes: [
      { name: 'صغير', price: 15 },
      { name: 'كبير', price: 25 }
    ]
  },

  // --- Meals (الوجبات) ---
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
    id: 'ml-2',
    nameAr: 'وجبة برجر لحم مشوي دبل',
    nameEn: 'Double Grilled Beef Burger Meal',
    category: 'meals',
    price: 33,
    calories: 660,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ml-3',
    nameAr: 'وجبة برجر دجاج مشوي دبل',
    nameEn: 'Double Grilled Chicken Burger Meal',
    category: 'meals',
    price: 26,
    calories: 470,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ml-4',
    nameAr: 'وجبة برجر زنجر',
    nameEn: 'Zinger Burger Meal',
    category: 'meals',
    price: 18,
    calories: 850,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ml-5',
    nameAr: 'وجبة فاھیتا دجاج',
    nameEn: 'Chicken Fajita Meal',
    category: 'meals',
    price: 20,
    calories: 850,
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ml-6',
    nameAr: 'وجبة روست دجاج',
    nameEn: 'Roast Chicken Meal',
    category: 'meals',
    price: 18,
    calories: 630,
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ml-7',
    nameAr: 'وجبة صاروخ دجاج',
    nameEn: 'Chicken Rocket Meal',
    category: 'meals',
    price: 19,
    calories: 850,
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ml-8',
    nameAr: 'وجبة عربي دجاج',
    nameEn: 'Arabic Chicken Meal',
    category: 'meals',
    price: 22,
    calories: 850,
    image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ml-9',
    nameAr: 'وجبة كرسبي جامعو',
    nameEn: 'Jumbo Crispy Meal',
    category: 'meals',
    price: 20,
    calories: 2033,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ml-10',
    nameAr: 'وجبة سندویش تورتیلا',
    nameEn: 'Tortilla Sandwich Meal',
    category: 'meals',
    price: 20,
    calories: 800,
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ml-11',
    nameAr: 'وجبة كلاسیك كرسبي',
    nameEn: 'Classic Crispy Meal',
    category: 'meals',
    price: 23,
    calories: 480,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ml-12',
    nameAr: 'وجبة سبیشل كرسبي',
    nameEn: 'Special Crispy Meal',
    category: 'meals',
    price: 23,
    calories: 480,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ml-13',
    nameAr: 'وجبة كلاسیك كرسبي حراق',
    nameEn: 'Classic Spicy Crispy Meal',
    category: 'meals',
    price: 23,
    calories: 480,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ml-14',
    nameAr: 'وجبة برجر لحم مشوي',
    nameEn: 'Grilled Beef Burger Meal',
    category: 'meals',
    price: 23,
    calories: 465,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ml-15',
    nameAr: 'وجبة برجر لحم كرامیل',
    nameEn: 'Caramel Beef Burger Meal',
    category: 'meals',
    price: 23,
    calories: 460,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ml-16',
    nameAr: 'وجبة برجر لحم كراميل دبل',
    nameEn: 'Double Caramel Beef Burger Meal',
    category: 'meals',
    price: 33,
    calories: 720,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ml-17',
    nameAr: 'وجبة برجر دجاج مشوي',
    nameEn: 'Grilled Chicken Burger Meal',
    category: 'meals',
    price: 18,
    calories: 580,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'
  },

  // --- Sandwiches (السندویشات) ---
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
    nameAr: 'برجر لحم مشوي دبل',
    nameEn: 'Double Grilled Beef Burger',
    category: 'sandwiches',
    price: 25,
    calories: 660,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sw-3',
    nameAr: 'برجر دجاج مشوي دبل',
    nameEn: 'Double Grilled Chicken Burger',
    category: 'sandwiches',
    price: 18,
    calories: 470,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sw-4',
    nameAr: 'برجر زنجر',
    nameEn: 'Zinger Burger',
    category: 'sandwiches',
    price: 10,
    calories: 650,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sw-5',
    nameAr: 'فاھیتا دجاج',
    nameEn: 'Chicken Fajita',
    category: 'sandwiches',
    price: 12,
    calories: 850,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sw-6',
    nameAr: 'روست دجاج',
    nameEn: 'Roast Chicken',
    category: 'sandwiches',
    price: 10,
    calories: 433,
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sw-7',
    nameAr: 'بروست دجاج حراق',
    nameEn: 'Chicken Broast (Spicy)',
    category: 'sandwiches',
    price: 18,
    calories: 1647,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sw-8',
    nameAr: 'بروست دجاج عادي',
    nameEn: 'Chicken Broast (Normal)',
    category: 'sandwiches',
    price: 18,
    calories: 1637,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sw-9',
    nameAr: 'بروست سمك',
    nameEn: 'Fish Broast',
    category: 'sandwiches',
    price: 18,
    calories: 1400,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sw-10',
    nameAr: 'مسحب دجاج حراق',
    nameEn: 'Boneless Chicken (Spicy)',
    category: 'sandwiches',
    price: 18,
    calories: 1660,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sw-11',
    nameAr: 'مسحب دجاج عادي',
    nameEn: 'Boneless Chicken (Normal)',
    category: 'sandwiches',
    price: 18,
    calories: 1650,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sw-12',
    nameAr: 'كرسبي جامبو',
    nameEn: 'Jumbo Crispy',
    category: 'sandwiches',
    price: 12,
    calories: 2033,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sw-13',
    nameAr: 'سندویش تورتیلا',
    nameEn: 'Tortilla Sandwich',
    category: 'sandwiches',
    price: 12,
    calories: 800,
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sw-14',
    nameAr: 'كلاسیك كرسبي',
    nameEn: 'Classic Crispy',
    category: 'sandwiches',
    price: 15,
    calories: 480,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sw-15',
    nameAr: 'سبیشل كرسبي',
    nameEn: 'Special Crispy',
    category: 'sandwiches',
    price: 15,
    calories: 480,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sw-16',
    nameAr: 'كلاسیك كرسبي حراق',
    nameEn: 'Classic Crispy Spicy',
    category: 'sandwiches',
    price: 15,
    calories: 480,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sw-17',
    nameAr: 'برجر لحم مشوي',
    nameEn: 'Grilled Beef Burger',
    category: 'sandwiches',
    price: 15,
    calories: 465,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sw-18',
    nameAr: 'برجر لحم كرامیل',
    nameEn: 'Caramel Beef Burger',
    category: 'sandwiches',
    price: 15,
    calories: 352,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sw-19',
    nameAr: 'برجر لحم كرامیل دبل',
    nameEn: 'Double Caramel Beef Burger',
    category: 'sandwiches',
    price: 25,
    calories: 555,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sw-20',
    nameAr: 'برجر دجاج مشوي',
    nameEn: 'Grilled Chicken Burger',
    category: 'sandwiches',
    price: 10,
    calories: 580,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'
  },

  // --- Pizza (البیتزا) ---
  {
    id: 'pz-1',
    nameAr: 'لحم',
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
    id: 'pz-2',
    nameAr: 'باربیكيو',
    nameEn: 'Barbecue',
    category: 'pizza',
    price: 13,
    calories: 613,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    sizes: [
      { name: 'صغير', price: 13 },
      { name: 'وسط', price: 24 },
      { name: 'كبير', price: 29 }
    ]
  },
  {
    id: 'pz-3',
    nameAr: 'جبن (مارجريتا)',
    nameEn: 'Cheese (Margherita)',
    category: 'pizza',
    price: 10,
    calories: 459,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    sizes: [
      { name: 'صغير', price: 10 },
      { name: 'وسط', price: 17 },
      { name: 'كبير', price: 23 }
    ]
  },
  {
    id: 'pz-4',
    nameAr: 'رنش بيتزا',
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
    id: 'pz-5',
    nameAr: 'جمبري بيتزا',
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
    id: 'pz-6',
    nameAr: 'سبيشل مأكولاتي',
    nameEn: 'My Special Food',
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
    id: 'pz-7',
    nameAr: 'شاورما سبيشل',
    nameEn: 'Special Shawarma',
    category: 'pizza',
    price: 16,
    calories: 709,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    sizes: [
      { name: 'صغير', price: 16 },
      { name: 'وسط', price: 27 },
      { name: 'كبير', price: 32 }
    ]
  },
  {
    id: 'pz-8',
    nameAr: 'خضار',
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
    id: 'pz-9',
    nameAr: 'دجاج',
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
  {
    id: 'pz-10',
    nameAr: 'مشكل',
    nameEn: 'Mixed Pizza',
    category: 'pizza',
    price: 10,
    calories: 624,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    sizes: [
      { name: 'صغير', price: 10 },
      { name: 'وسط', price: 17 },
      { name: 'كبير', price: 23 }
    ]
  },
  {
    id: 'pz-11',
    nameAr: 'شاورما',
    nameEn: 'Shawarma Pizza',
    category: 'pizza',
    price: 13,
    calories: 744,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    sizes: [
      { name: 'صغير', price: 13 },
      { name: 'وسط', price: 24 },
      { name: 'كبير', price: 29 }
    ]
  },
  {
    id: 'pz-12',
    nameAr: 'ببروني',
    nameEn: 'Pepperoni Pizza',
    category: 'pizza',
    price: 13,
    calories: 428,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    sizes: [
      { name: 'صغير', price: 13 },
      { name: 'وسط', price: 24 },
      { name: 'كبير', price: 29 }
    ]
  },

  // --- Pastries (الفطایر) ---
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
    id: 'pt-3',
    nameAr: 'جبن',
    nameEn: 'Cheese',
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
    id: 'pt-5',
    nameAr: 'محمرة',
    nameEn: 'Muhammara',
    category: 'pastries',
    price: 7,
    calories: 619,
    image: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?auto=format&fit=crop&w=800&q=80',
    sizes: [
      { name: 'صغير', price: 7 },
      { name: 'وسط', price: 12 },
      { name: 'كبير', price: 17 }
    ]
  },
  {
    id: 'pt-6',
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
    id: 'pt-7',
    nameAr: 'فطيرة شاورما جنن',
    nameEn: 'Shawarma and Cheese Pie',
    category: 'pastries',
    price: 15,
    calories: 1074,
    image: 'https://images.unsplash.com/photo-1512152272829-e3139592d56f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pt-8',
    nameAr: 'فطيرة جبن عكاوي',
    nameEn: 'Akkawi cheese pie',
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
    id: 'pt-9',
    nameAr: 'صحن فطائر مشكل',
    nameEn: 'Mixed Pastries Platter',
    category: 'pastries',
    price: 30,
    calories: 2238,
    image: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'pt-10',
    nameAr: 'دجاج',
    nameEn: 'Chicken Pastry',
    category: 'pastries',
    price: 8,
    calories: 709,
    image: 'https://images.unsplash.com/photo-1512152272829-e3139592d56f?auto=format&fit=crop&w=800&q=80',
    sizes: [
      { name: 'صغير', price: 8 },
      { name: 'وسط', price: 13 },
      { name: 'كبير', price: 18 }
    ]
  },
  {
    id: 'pt-11',
    nameAr: 'سبانخ',
    nameEn: 'Spinach Pastry',
    category: 'pastries',
    price: 7,
    calories: 428,
    image: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?auto=format&fit=crop&w=800&q=80',
    sizes: [
      { name: 'صغير', price: 7 },
      { name: 'وسط', price: 11 },
      { name: 'كبير', price: 17 }
    ]
  },
  {
    id: 'pt-12',
    nameAr: 'لبنة',
    nameEn: 'Labaneh Pastry',
    category: 'pastries',
    price: 8,
    calories: 578,
    image: 'https://images.unsplash.com/photo-1599599810694-b5b37304c041?auto=format&fit=crop&w=800&q=80',
    sizes: [
      { name: 'صغير', price: 8 },
      { name: 'وسط', price: 13 },
      { name: 'كبير', price: 18 }
    ]
  },
  {
    id: 'pt-13',
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
    id: 'pt-14',
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
  {
    id: 'pt-15',
    nameAr: 'بيض بالجبن',
    nameEn: 'Eggs with Cheese',
    category: 'pastries',
    price: 9,
    calories: 676,
    image: 'https://images.unsplash.com/photo-1512152272829-e3139592d56f?auto=format&fit=crop&w=800&q=80',
    sizes: [
      { name: 'صغير', price: 9 },
      { name: 'وسط', price: 16 },
      { name: 'كبير', price: 22 }
    ]
  },
  {
    id: 'pt-16',
    nameAr: 'جبن عسل',
    nameEn: 'Cheese and Honey',
    category: 'pastries',
    price: 9,
    calories: 803,
    image: 'https://images.unsplash.com/photo-1512152272829-e3139592d56f?auto=format&fit=crop&w=800&q=80',
    sizes: [
      { name: 'صغير', price: 9 },
      { name: 'وسط', price: 16 },
      { name: 'كبير', price: 22 }
    ]
  },

  // --- Drinks (المشروبات) ---
  {
    id: 'dr-1',
    nameAr: 'بيبسي',
    nameEn: 'Pepsi',
    category: 'drinks',
    price: 3,
    calories: 150,
    image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'dr-2',
    nameAr: 'سفن أب',
    nameEn: '7Up',
    category: 'drinks',
    price: 3,
    calories: 140,
    image: 'https://images.unsplash.com/photo-1622708782464-0106786579c8?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'dr-3',
    nameAr: 'ماء',
    nameEn: 'Water',
    category: 'drinks',
    price: 1,
    calories: 0,
    image: 'https://images.unsplash.com/photo-1548964856-ac521ad29d83?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'dr-4',
    nameAr: 'عصير برتقال طازج',
    nameEn: 'Fresh Orange Juice',
    category: 'drinks',
    price: 10,
    calories: 120,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80'
  }
];
