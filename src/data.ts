import { MenuItem, MenuSize } from './types';

const sizes = (...entries: Array<[string, number, number?]>): MenuSize[] => (
  entries.map(([name, price, calories]) => ({
    name,
    price,
    ...(calories === undefined ? {} : { calories }),
  }))
);

const RAW_INITIAL_MENU: MenuItem[] = [
  // Shawarma — the printed menu plus the "New" section.
  { id: 'sh-6', nameAr: 'صاروخ دجاج', nameEn: 'Chicken Rocket', category: 'shawarma', price: 11, calories: 650, image: '/menu/shawarma/chicken-shawarma.jpeg' },
  { id: 'sh-10', nameAr: 'صاروخ أمريكي', nameEn: 'American Rocket', category: 'shawarma', price: 16, calories: 700, image: '/menu/shawarma/american-rocket.jpeg' },
  { id: 'sh-15', nameAr: 'صاروخ شامي', nameEn: 'Levant Rocket', category: 'shawarma', price: 11, calories: 720, image: '/menu/shawarma/shami-rocket.jpeg' },
  { id: 'sh-12', nameAr: 'شاورما تورتيلا', nameEn: 'Tortilla Shawarma', category: 'shawarma', price: 12, calories: 740, image: '/menu/shawarma/tortilla-shawarma.jpeg' },
  { id: 'sh-11', nameAr: 'صامولي دجاج', nameEn: 'Chicken Samoli', category: 'shawarma', price: 4, calories: 378, image: '/menu/shawarma/samoli-shawarma.jpeg' },
  { id: 'sh-9', nameAr: 'مفرود دجاج', nameEn: 'Chicken Mafrood', category: 'shawarma', price: 5, calories: 320, image: '/menu/shawarma/mafrood-shawarma.jpeg' },
  { id: 'sh-18', nameAr: 'صاروخ قرصان دجاج', nameEn: 'Chicken Pirate Rocket', category: 'shawarma', price: 12, calories: 580, image: '' },
  { id: 'sh-14', nameAr: 'شاورما صغير صاج', nameEn: 'Small Shawarma Saj', category: 'shawarma', price: 6, calories: 300, image: '/menu/shawarma/small-saj.jpeg' },
  { id: 'sh-1', nameAr: 'صاروخ مأكولاتي', nameEn: 'Makolaty Rocket', category: 'shawarma', price: 11, calories: 660, image: '/menu/shawarma/makolaty-rocket.jpeg' },
  { id: 'sh-7', nameAr: 'جامبو دجاج', nameEn: 'Chicken Jumbo', category: 'shawarma', price: 10, calories: 470, image: '/menu/shawarma/jumbo-shawarma.jpeg' },
  { id: 'sh-4', nameAr: 'صحن شاورما دجاج', nameEn: 'Chicken Shawarma Plate', category: 'shawarma', price: 19, calories: 1311, image: '/menu/shawarma/arabic-shawarma-plate.jpeg' },
  { id: 'sh-22', nameAr: 'صحن عربي دجاج', nameEn: 'Arabic Chicken Plate', category: 'shawarma', price: 16, calories: 1095, image: '' },
  { id: 'sh-5', nameAr: 'صحن عربي قرصان', nameEn: 'Arabic Pirate Plate', category: 'shawarma', price: 17, calories: 900, image: '/menu/shawarma/arabic-pirate-plate.jpeg' },
  { id: 'sh-8', nameAr: 'لغاويص شاورما', nameEn: 'Shawarma Ghwais', category: 'shawarma', price: 13, calories: 1811, image: '/menu/shawarma/laghawis-shawarma.jpeg' },
  { id: 'sh-19', nameAr: 'شاورما صاروخ تركي', nameEn: 'Turkish Shawarma Rocket', category: 'shawarma', price: 11, calories: 949, image: '' },
  { id: 'sh-20', nameAr: 'شاورما عربي تركي', nameEn: 'Turkish Arabic Shawarma', category: 'shawarma', price: 16, calories: 1100, image: '' },
  { id: 'sh-3', nameAr: 'شاورما عربي تركي دبل', nameEn: 'Double Turkish Arabic Shawarma', category: 'shawarma', price: 20, calories: 1300, image: '/menu/shawarma/arabic-turkish-double.jpeg' },
  {
    id: 'sh-16', nameAr: 'شاورما تبولة', nameEn: 'Tabbouleh Shawarma', category: 'shawarma', price: 11, calories: 480,
    image: '/menu/shawarma/tabbouleh-shawarma.jpeg', sizes: sizes(['عادي', 11, 480], ['بازوكا', 16, 985]),
  },
  { id: 'sh-2', nameAr: 'صاروخ مقمر', nameEn: 'Bazooka', category: 'shawarma', price: 11, calories: 715, image: '/menu/shawarma/bazooka-shawarma.jpeg' },
  { id: 'sh-21', nameAr: 'صاروخ إسبيشل مكسيكي', nameEn: 'Special Mexican Rocket', category: 'shawarma', price: 13, calories: 890, image: '' },
  {
    id: 'sh-23', nameAr: 'إضافة دجاج شاورما', nameEn: 'Extra Shawarma Chicken', category: 'shawarma', price: 3,
    image: '', sizes: sizes(['صغير', 3], ['كبير', 5]),
  },

  // Pastries.
  {
    id: 'pt-12', nameAr: 'صحن فطائر مشكل', nameEn: 'Mixed Pastries Plate', category: 'pastries', price: 5, image: '/menu/pastries/mixed-pastries-plate.jpg',
    sizes: sizes(['الحبة', 5], ['صحن مشكل', 30, 2238]),
  },
  { id: 'pt-6', nameAr: 'دجاج', nameEn: 'Chicken Pastry', category: 'pastries', price: 8, calories: 709, image: '/menu/pastries/chicken.jpg', sizes: sizes(['صغير', 8, 709], ['وسط', 13, 802], ['كبير', 18, 1347]) },
  { id: 'pt-1', nameAr: 'سبانخ', nameEn: 'Spinach Pastry', category: 'pastries', price: 7, calories: 428, image: '/menu/pastries/spinach.jpg', sizes: sizes(['صغير', 7, 428], ['وسط', 11, 668], ['كبير', 17, 900]) },
  { id: 'pt-5', nameAr: 'لبنة', nameEn: 'Labaneh Pastry', category: 'pastries', price: 8, calories: 578, image: '/menu/pastries/labneh.jpg', sizes: sizes(['صغير', 8, 578], ['وسط', 13, 1097], ['كبير', 18, 1101]) },
  { id: 'pt-11', nameAr: 'لبنة بالزعتر', nameEn: 'Labaneh with Thyme', category: 'pastries', price: 9, calories: 653, image: '/menu/pastries/labneh-zaatar.jpg', sizes: sizes(['صغير', 9, 653], ['وسط', 16, 1170], ['كبير', 22, 1494]) },
  { id: 'pt-9', nameAr: 'زعتر', nameEn: 'Thyme Pastry', category: 'pastries', price: 7, calories: 500, image: '/menu/pastries/zaatar.jpg', sizes: sizes(['صغير', 7, 500], ['وسط', 12, 1091], ['كبير', 17, 1215]) },
  { id: 'pt-10', nameAr: 'بيض بالجبن', nameEn: 'Eggs with Cheese', category: 'pastries', price: 9, calories: 676, image: '/menu/pastries/egg-cheese.jpg', sizes: sizes(['صغير', 9, 676], ['وسط', 16, 1210], ['كبير', 22, 1816]) },
  { id: 'pt-15', nameAr: 'جبن عسل', nameEn: 'Cheese and Honey', category: 'pastries', price: 9, calories: 805, image: '', sizes: sizes(['صغير', 9, 805], ['وسط', 16, 1075], ['كبير', 22, 1728]) },
  { id: 'pt-16', nameAr: 'لبنة بالعسل', nameEn: 'Labaneh with Honey', category: 'pastries', price: 9, calories: 604, image: '', sizes: sizes(['صغير', 9, 604], ['وسط', 16, 1137], ['كبير', 22, 1585]) },
  { id: 'pt-7', nameAr: 'لبنة بالزيتون', nameEn: 'Labaneh with Olives', category: 'pastries', price: 9, calories: 653, image: '/menu/pastries/labneh-olive.jpg', sizes: sizes(['صغير', 9, 653], ['وسط', 16, 1418], ['كبير', 22, 1751]) },
  { id: 'pt-3', nameAr: 'جبن', nameEn: 'Cheese Pastry', category: 'pastries', price: 8, calories: 605, image: '/menu/pastries/kraft-liquid-cheese.jpg', sizes: sizes(['صغير', 8, 605], ['وسط', 13, 1418], ['كبير', 18, 1793]) },
  { id: 'pt-2', nameAr: 'فطيرة لحم', nameEn: 'Meat Pie', category: 'pastries', price: 10, calories: 479, image: '/menu/pastries/meat.jpg', sizes: sizes(['صغير', 10, 479], ['وسط', 16, 767], ['كبير', 22, 1377]) },
  { id: 'pt-8', nameAr: 'محمرة', nameEn: 'Muhammara Pastry', category: 'pastries', price: 7, calories: 619, image: '/menu/pastries/muhammara.jpg', sizes: sizes(['صغير', 7, 619], ['وسط', 12, 780], ['كبير', 17, 1220]) },
  { id: 'pt-4', nameAr: 'عش البلبل', nameEn: "Nightingale's Nest", category: 'pastries', price: 9, calories: 927, image: '/menu/pastries/ash-albulbul.jpg', sizes: sizes(['صغير', 9, 927], ['وسط', 17, 1201], ['كبير', 23, 1440]) },
  { id: 'pt-14', nameAr: 'فطيرة شاورما وجبن', nameEn: 'Shawarma and Cheese Pie', category: 'pastries', price: 15, calories: 1674, image: '/menu/pastries/chicken-shawarma.jpg' },
  { id: 'pt-13', nameAr: 'فطيرة جبن عكاوي', nameEn: 'Akkawi Cheese Pie', category: 'pastries', price: 8, calories: 805, image: '/menu/pastries/akkawi-cheese.jpg', sizes: sizes(['صغير', 8, 805], ['وسط', 13, 1416], ['كبير', 18, 1792]) },

  // Pizza.
  { id: 'pz-6', nameAr: 'ماكولاتي سبيشل', nameEn: 'Makolaty Special Pizza', category: 'pizza', price: 13, calories: 693, image: '/menu/pizza/makolaty-special.jpeg', sizes: sizes(['صغير', 13, 693], ['وسط', 24, 1131], ['كبير', 29, 1797]) },
  { id: 'pz-1', nameAr: 'سبيشل شاورما', nameEn: 'Special Shawarma Pizza', category: 'pizza', price: 16, calories: 709, image: '/menu/pizza/special-shawarma.jpeg', sizes: sizes(['صغير', 16, 709], ['وسط', 27, 1217], ['كبير', 32, 2000]) },
  { id: 'pz-5', nameAr: 'خضار', nameEn: 'Vegetables Pizza', category: 'pizza', price: 9, calories: 461, image: '/menu/pizza/vegetables.jpeg', sizes: sizes(['صغير', 9, 461], ['وسط', 16, 879], ['كبير', 22, 927]) },
  { id: 'pz-4', nameAr: 'دجاج', nameEn: 'Chicken Pizza', category: 'pizza', price: 10, calories: 576, image: '/menu/pizza/chicken.jpeg', sizes: sizes(['صغير', 10, 576], ['وسط', 17, 1009], ['كبير', 23, 1217]) },
  { id: 'pz-2', nameAr: 'مشكل', nameEn: 'Mixed Pizza', category: 'pizza', price: 10, calories: 624, image: '/menu/pizza/mixed.jpeg', sizes: sizes(['صغير', 10, 624], ['وسط', 17, 1057], ['كبير', 23, 1019]) },
  { id: 'pz-3', nameAr: 'شاورما', nameEn: 'Shawarma Pizza', category: 'pizza', price: 13, calories: 244, image: '/menu/pizza/shawarma.jpeg', sizes: sizes(['صغير', 13, 244], ['وسط', 24, 942], ['كبير', 29, 1494]) },
  { id: 'pz-7', nameAr: 'ببروني', nameEn: 'Pepperoni Pizza', category: 'pizza', price: 13, calories: 428, image: '/menu/pizza/pepperoni.jpeg', sizes: sizes(['صغير', 13, 428], ['وسط', 24, 776], ['كبير', 29, 902]) },
  { id: 'pz-12', nameAr: 'لحم', nameEn: 'Meat Pizza', category: 'pizza', price: 10, calories: 591, image: '', sizes: sizes(['صغير', 10, 591], ['وسط', 17, 1035], ['كبير', 23, 1249]) },
  { id: 'pz-11', nameAr: 'باربكيو', nameEn: 'Barbecue Pizza', category: 'pizza', price: 13, calories: 613, image: '/menu/pizza/barbecue.jpeg', sizes: sizes(['صغير', 13, 613], ['وسط', 24, 1150], ['كبير', 29, 1464]) },
  { id: 'pz-10', nameAr: 'جبن (مارجريتا)', nameEn: 'Cheese Margherita Pizza', category: 'pizza', price: 10, calories: 459, image: '/menu/pizza/margherita-cheese.jpeg', sizes: sizes(['صغير', 10, 459], ['وسط', 17, 791], ['كبير', 23, 1048]) },
  { id: 'pz-8', nameAr: 'بيتزا رانش', nameEn: 'Ranch Pizza', category: 'pizza', price: 13, calories: 470, image: '/menu/pizza/chicken-ranch.jpeg', sizes: sizes(['صغير', 13, 470], ['وسط', 24, 799], ['كبير', 29, 1010]) },
  { id: 'pz-9', nameAr: 'بيتزا جمبري', nameEn: 'Shrimp Pizza', category: 'pizza', price: 15, calories: 709, image: '/menu/pizza/shrimp.jpeg', sizes: sizes(['صغير', 15, 709], ['وسط', 25, 802], ['كبير', 30, 1947]) },

  // Meals — names include "Meal" so they are never confused with sandwiches.
  { id: 'ml-6', nameAr: 'وجبة كرسبي جامبو', nameEn: 'Crispy Jumbo Meal', category: 'meals', price: 20, calories: 2033, image: '' },
  { id: 'ml-7', nameAr: 'وجبة ساندويتش تورتيلا', nameEn: 'Tortilla Sandwich Meal', category: 'meals', price: 20, calories: 800, image: '' },
  { id: 'ml-3', nameAr: 'وجبة كلاسيك كرسبي', nameEn: 'Classic Crispy Meal', category: 'meals', price: 23, calories: 480, image: '/menu/burgers/crispy.jpeg' },
  { id: 'ml-8', nameAr: 'وجبة سبيشل كرسبي', nameEn: 'Special Crispy Meal', category: 'meals', price: 23, calories: 480, image: '' },
  { id: 'ml-9', nameAr: 'وجبة كلاسيك كرسبي حراق', nameEn: 'Classic Spicy Crispy Meal', category: 'meals', price: 23, calories: 480, image: '' },
  { id: 'ml-2', nameAr: 'وجبة برجر لحم مشوي', nameEn: 'Grilled Beef Burger Meal', category: 'meals', price: 23, calories: 465, image: '/menu/burgers/grilled-beef.jpeg' },
  { id: 'ml-10', nameAr: 'وجبة برجر لحم كراميل', nameEn: 'Caramel Beef Burger Meal', category: 'meals', price: 23, calories: 460, image: '' },
  { id: 'ml-11', nameAr: 'وجبة برجر لحم كراميل دبل', nameEn: 'Double Caramel Beef Burger Meal', category: 'meals', price: 33, calories: 720, image: '' },
  { id: 'ml-1', nameAr: 'وجبة برجر دجاج مشوي', nameEn: 'Grilled Chicken Burger Meal', category: 'meals', price: 18, calories: 580, image: '/menu/burgers/grilled-chicken.jpeg' },
  { id: 'ml-5', nameAr: 'وجبة برجر دجاج', nameEn: 'Chicken Burger Meal', category: 'meals', price: 16, calories: 300, image: '/menu/burgers/fried-chicken.jpeg' },
  { id: 'ml-12', nameAr: 'وجبة برجر لحم مشوي دبل', nameEn: 'Double Grilled Beef Burger Meal', category: 'meals', price: 33, calories: 660, image: '' },
  { id: 'ml-13', nameAr: 'وجبة برجر دجاج مشوي دبل', nameEn: 'Double Grilled Chicken Burger Meal', category: 'meals', price: 26, calories: 470, image: '' },
  { id: 'ml-4', nameAr: 'وجبة زنجر برجر', nameEn: 'Zinger Burger Meal', category: 'meals', price: 18, calories: 850, image: '/menu/burgers/zinger.jpeg' },
  { id: 'ml-14', nameAr: 'وجبة فاهيتا دجاج', nameEn: 'Chicken Fajita Meal', category: 'meals', price: 20, calories: 850, image: '' },
  { id: 'ml-15', nameAr: 'وجبة روست دجاج', nameEn: 'Roast Chicken Meal', category: 'meals', price: 18, calories: 630, image: '' },
  { id: 'ml-16', nameAr: 'وجبة صاروخ دجاج', nameEn: 'Chicken Rocket Meal', category: 'meals', price: 18, calories: 850, image: '' },
  { id: 'ml-17', nameAr: 'وجبة عربي دجاج', nameEn: 'Arabic Chicken Meal', category: 'meals', price: 22, calories: 850, image: '' },

  // Sandwiches.
  { id: 'sw-3', nameAr: 'كرسبي جامبو', nameEn: 'Jumbo Crispy Sandwich', category: 'sandwiches', price: 12, calories: 2033, image: '/menu/sandwiches/jumbo-crispy.jpg' },
  { id: 'sw-4', nameAr: 'ساندويتش تورتيلا', nameEn: 'Tortilla Sandwich', category: 'sandwiches', price: 12, calories: 800, image: '' },
  { id: 'sw-5', nameAr: 'كلاسيك كرسبي', nameEn: 'Classic Crispy Sandwich', category: 'sandwiches', price: 15, calories: 480, image: '' },
  { id: 'sw-6', nameAr: 'سبيشل كرسبي', nameEn: 'Special Crispy Sandwich', category: 'sandwiches', price: 15, calories: 480, image: '' },
  { id: 'sw-7', nameAr: 'كلاسيك كرسبي حراق', nameEn: 'Classic Spicy Crispy Sandwich', category: 'sandwiches', price: 15, calories: 480, image: '' },
  { id: 'sw-8', nameAr: 'برجر لحم مشوي', nameEn: 'Grilled Beef Burger', category: 'sandwiches', price: 15, calories: 465, image: '' },
  { id: 'sw-9', nameAr: 'برجر لحم كراميل', nameEn: 'Caramel Beef Burger', category: 'sandwiches', price: 15, calories: 352, image: '' },
  { id: 'sw-10', nameAr: 'برجر لحم كراميل دبل', nameEn: 'Double Caramel Beef Burger', category: 'sandwiches', price: 25, calories: 555, image: '' },
  { id: 'sw-11', nameAr: 'برجر دجاج مشوي', nameEn: 'Grilled Chicken Burger', category: 'sandwiches', price: 10, calories: 580, image: '' },
  { id: 'sw-12', nameAr: 'برجر دجاج', nameEn: 'Chicken Burger', category: 'sandwiches', price: 8, calories: 300, image: '' },
  { id: 'sw-13', nameAr: 'برجر لحم مشوي دبل', nameEn: 'Double Grilled Beef Burger', category: 'sandwiches', price: 25, calories: 660, image: '' },
  { id: 'sw-14', nameAr: 'برجر دجاج مشوي دبل', nameEn: 'Double Grilled Chicken Burger', category: 'sandwiches', price: 18, calories: 470, image: '' },
  { id: 'sw-15', nameAr: 'زنجر برجر', nameEn: 'Zinger Burger', category: 'sandwiches', price: 10, calories: 650, image: '' },
  { id: 'sw-1', nameAr: 'فاهيتا دجاج', nameEn: 'Chicken Fajita Sandwich', category: 'sandwiches', price: 12, calories: 850, image: '/menu/sandwiches/fajita.jpg' },
  { id: 'sw-2', nameAr: 'روست دجاج', nameEn: 'Roast Chicken Sandwich', category: 'sandwiches', price: 10, calories: 433, image: '/menu/sandwiches/roast-chicken.jpg' },

  // Broast and boneless nuggets.
  {
    id: 'broast-chicken', nameAr: 'بروست دجاج', nameEn: 'Chicken Broast', category: 'broast', price: 18, calories: 1647,
    image: '/menu/broast/chicken-broast.jpeg', sizes: sizes(['عادي', 18, 1647], ['حراق', 18, 1637]),
  },
  { id: 'broast-nuggets-regular', nameAr: 'مسحب عادي', nameEn: 'Regular Chicken Nuggets', category: 'broast', price: 18, calories: 1642, image: '/menu/broast/chicken-nuggets.jpeg' },
  { id: 'broast-nuggets-spicy', nameAr: 'مسحب حراق', nameEn: 'Spicy Chicken Nuggets', category: 'broast', price: 18, calories: 1630, image: '/menu/broast/chicken-nuggets.jpeg' },

  // Pasta.
  { id: 'ps-5', nameAr: 'مكرونة بالجبن', nameEn: 'Cheese Pasta', category: 'pasta', price: 10, calories: 450, image: '/menu/pasta/cheese.jpg', sizes: sizes(['صغير', 10, 450], ['كبير', 20, 925]) },
  { id: 'ps-6', nameAr: 'باستا دجاج بالكريمة فيتوتشيني', nameEn: 'Creamy Chicken Fettuccine Pasta', category: 'pasta', price: 15, calories: 750, image: '/menu/pasta/fettuccine.jpg', sizes: sizes(['صغير', 15, 750], ['كبير', 25, 1559]) },
  { id: 'ps-7', nameAr: 'باستا بولونيز', nameEn: 'Bolognese Pasta', category: 'pasta', price: 20, calories: 450, image: '/menu/pasta/bolognese.jpg', sizes: sizes(['صغير', 20, 450], ['كبير', 31, 931]) },
  { id: 'ps-8', nameAr: 'مكرونة البيني', nameEn: 'Penne Pasta', category: 'pasta', price: 10, calories: 320, image: '/menu/pasta/penne.jpg', sizes: sizes(['صغير', 10, 320], ['كبير', 20, 694]) },
  { id: 'ps-9', nameAr: 'باستا لازانيا', nameEn: 'Lasagna Pasta', category: 'pasta', price: 15, calories: 470, image: '/menu/pasta/lasagna.jpg', sizes: sizes(['صغير', 15, 470], ['كبير', 25, 964]) },
  { id: 'ps-1', nameAr: 'باستا بالخضار', nameEn: 'Pasta with Vegetables', category: 'pasta', price: 10, calories: 310, image: '/menu/pasta/vegetables.jpg', sizes: sizes(['صغير', 10, 310], ['كبير', 20, 668]) },
  { id: 'ps-2', nameAr: 'باستا ألفريدو', nameEn: 'Alfredo Pasta', category: 'pasta', price: 15, calories: 400, image: '/menu/pasta/alfredo.jpg', sizes: sizes(['صغير', 15, 400], ['كبير', 25, 718]) },
  { id: 'ps-3', nameAr: 'باستا بشاميل', nameEn: 'Bechamel Pasta', category: 'pasta', price: 15, calories: 435, image: '/menu/pasta/bechamel.jpg', sizes: sizes(['صغير', 15, 435], ['كبير', 25, 830]) },
  { id: 'ps-4', nameAr: 'باستا جمبري', nameEn: 'Shrimp Pasta', category: 'pasta', price: 20, calories: 460, image: '/menu/pasta/shrimp.jpg', sizes: sizes(['صغير', 20, 460], ['كبير', 30, 930]) },

  // Appetizers.
  { id: 'ap-1', nameAr: 'بطاطس جبن', nameEn: 'Potatoes and Cheese', category: 'appetizers', price: 10, calories: 350, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80' },
  { id: 'ap-2', nameAr: 'بطاطس', nameEn: 'Potatoes', category: 'appetizers', price: 6, calories: 311, image: '/menu/appetizers/french-fries.png', sizes: sizes(['صغير', 6, 311], ['وسط', 8, 540], ['كبير', 14, 630]) },
  { id: 'ap-5', nameAr: 'ورق عنب', nameEn: 'Vine Leaves', category: 'appetizers', price: 6, calories: 433, image: '/menu/appetizers/vine-leaves.jpeg', sizes: sizes(['صغير', 6, 433], ['كبير', 15, 650]) },
  { id: 'ap-7', nameAr: 'حمص', nameEn: 'Hummus', category: 'appetizers', price: 7, calories: 210, image: '/menu/appetizers/mixed-appetizers.jpeg' },
  { id: 'ap-8', nameAr: 'مقبلات مشكلة', nameEn: 'Mixed Appetizers', category: 'appetizers', price: 7, calories: 349, image: '/menu/appetizers/mixed-appetizers.jpeg' },
  { id: 'ap-9', nameAr: 'حلقات بصل', nameEn: 'Onion Rings', category: 'appetizers', price: 6, calories: 279, image: '/menu/appetizers/onion-rings.jpeg' },

  // Sauces.
  { id: 'sc-1', nameAr: 'صوص كوكتيل', nameEn: 'Cocktail Sauce', category: 'sauces', price: 2, calories: 144, image: '/menu/sauces/cocktail-sauce.jpeg' },
  { id: 'sc-2', nameAr: 'صوص ثوم حار', nameEn: 'Hot Garlic Sauce', category: 'sauces', price: 1, calories: 150, image: '/menu/sauces/hot-garlic-sauce.jpeg' },
  { id: 'sc-3', nameAr: 'صوص ثوم', nameEn: 'Garlic Sauce', category: 'sauces', price: 1, calories: 140, image: '/menu/sauces/garlic-sauce.jpeg' },
  { id: 'sc-4', nameAr: 'صوص مأكولاتي', nameEn: 'Makolaty Sauce', category: 'sauces', price: 1, calories: 140, image: '/menu/sauces/makolaty-sauce.jpeg' },
  { id: 'sc-5', nameAr: 'صوص الديناميت', nameEn: 'Dynamite Sauce', category: 'sauces', price: 2, calories: 145, image: '/menu/sauces/dynamite-sauce.jpeg' },
  { id: 'sc-6', nameAr: 'صوص مدخن', nameEn: 'Smoked Sauce', category: 'sauces', price: 2, calories: 153, image: '/menu/sauces/smoked-sauce.jpeg' },
  { id: 'sc-7', nameAr: 'جبنة شيدر', nameEn: 'Cheddar Cheese Sauce', category: 'sauces', price: 2, calories: 160, image: '/menu/sauces/cheese-sauce.jpeg' },

  // Drinks shown on the printed menu.
  { id: 'dr-1', nameAr: 'بيبسي', nameEn: 'Pepsi', category: 'drinks', price: 3, calories: 150, sizes: sizes(['صغير', 3, 150], ['وسط', 5], ['كبير', 9]), image: '/menu/drinks/pepsi-bottle.png' },
  { id: 'dr-2', nameAr: 'الربيع', nameEn: 'Rabeea Juice', category: 'drinks', price: 2, calories: 135, image: '/menu/drinks/rabeea-orange.png' },
  { id: 'dr-3', nameAr: 'ماء', nameEn: 'Water', category: 'drinks', price: 1, calories: 0, image: '/menu/drinks/water-bottle.png' },
  { id: 'dr-4', nameAr: 'مونتن ديو', nameEn: 'Mountain Dew', category: 'drinks', price: 3, calories: 170, image: '/menu/drinks/mountain-dew-can.png' },
  { id: 'dr-5', nameAr: 'سفن أب', nameEn: '7 Up', category: 'drinks', price: 3, calories: 140, image: '/menu/drinks/7up-can.png' },
  { id: 'dr-6', nameAr: 'سفن أب زيرو', nameEn: '7 Up Zero', category: 'drinks', price: 3, calories: 0, image: '/menu/drinks/7up-zero-can.png' },
  { id: 'dr-7', nameAr: 'ميرندا حمضيات', nameEn: 'Mirinda Citrus', category: 'drinks', price: 3, calories: 150, image: '/menu/drinks/mirinda-citrus-can.png' },
];

export const INITIAL_MENU: MenuItem[] = RAW_INITIAL_MENU.filter((item) => item.image.trim().length > 0);
