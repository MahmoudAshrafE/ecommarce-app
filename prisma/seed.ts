import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL || process.env.DIRECT_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const categories = [
    { name: 'Classic Burgers', nameAr: 'برجر كلاسيك' },
    { name: 'Special Burgers', nameAr: 'برجر مميز' },
    { name: 'Chicken Burgers', nameAr: 'برجر دجاج' },
    { name: 'Beef Burgers', nameAr: 'برجر لحم' },
    { name: 'Veggie Burgers', nameAr: 'برجر نباتي' },
    { name: 'Soft Drinks', nameAr: 'مشروبات غازية' },
    { name: 'Shakes & Malts', nameAr: 'ميلك شيك' },
    { name: 'Juices', nameAr: 'عصائر' },
    { name: 'Sides', nameAr: 'أطباق جانبية' },
    { name: 'Desserts', nameAr: 'حلويات' },
];

const burgerDetails = [
    { name: 'Classic Beef Burger', nameAr: 'برجر لحم كلاسيك', desc: 'Juicy beef patty with lettuce, tomato, and our secret sauce.', descAr: 'قطعة لحم بقري مغطاة بالخس والطماطم مع صوصنا السري.' },
    { name: 'Cheese Explosion', nameAr: 'انفجار الجبن', desc: 'Triple cheese blend melted over a premium beef patty.', descAr: 'مزيج من ثلاثة أنواع جبن ذائبة فوق قطعة لحم بقري ممتازة.' },
    { name: 'Smoky BBQ Burger', nameAr: 'برجر باربيكيو مدخن', desc: 'Crispy onions, bacon, and smoky BBQ sauce on beef.', descAr: 'بصل مقرمش، بيكون، وصوص باربيكيو مدخن على اللحم.' },
    { name: 'Spicy Jalapeño', nameAr: 'جالبينو حار', desc: 'Fiery jalapeños with spicy mayo and pepper jack cheese.', descAr: 'فلفل جالبينو حار مع مايونيز حار وجبن بيبر جاك.' },
    { name: 'Monster Double Stack', nameAr: 'برجر الوحش طبقتين', desc: 'Two premium beef patties with all the fixings.', descAr: 'قطعتين لحم بقري فاخر مع كافة الإضافات.' },
    { name: 'Swiss Mushroom', nameAr: 'عيش الغراب سويسري', desc: 'Sautéed mushrooms and melted Swiss cheese.', descAr: 'فطر سوتيه وجبن سويسري ذائب.' },
    { name: 'Crispy Chicken Deluxe', nameAr: 'دجاج كريسبي ديلاكس', desc: 'Hand-breaded chicken breast with pickles and slaw.', descAr: 'صدر دجاج مغطى بالخبز يدوياً مع مخلل وسلطة كول سلو.' },
    { name: 'Buffalo Soul Chicken', nameAr: 'دجاج بافلو سول', desc: 'Spicy buffalo sauce with cool ranch and crispy chicken.', descAr: 'صوص بافلو حار مع رانش بارد ودجاج مقرمش.' },
    { name: 'Truffle Beef Royale', nameAr: 'ترافل لحم رويال', desc: 'Beef patty topped with truffle oil and caramelized onions.', descAr: 'قطعة لحم بقري مغطاة بزيت الترافل وبصل مكرمل.' },
    { name: 'Avocado Green Burger', nameAr: 'برجر افوكادو نباتي', desc: 'Plant-based patty with fresh avocado and sprouts.', descAr: 'قطعة نباتية مع أفوكادو طازج وبراعم.' },
];

const drinkDetails = [
    { name: 'Classic Cola', nameAr: 'كولا كلاسيك', desc: 'Refreshing ice-cold classic cola.', descAr: 'كولا كلاسيكية منعشة ومثلجة.' },
    { name: 'Lemon Mint Splash', nameAr: 'ليمون بالنعناع', desc: 'Freshly squeezed lemons with garden mint.', descAr: 'ليمون معصور طازجاً مع نعناع من الحديقة.' },
    { name: 'Strawberry Milkshake', nameAr: 'ميلك شيك فراولة', desc: 'Creamy shake made with real strawberries.', descAr: 'ميلك شيك كريمي مصنوع من فراولة حقيقية.' },
    { name: 'Chocolate Fudge Shake', nameAr: 'ميلك شيك شوكولاتة', desc: 'Rich chocolate blended with premium milk.', descAr: 'شوكولاتة غنية ممزوجة بحليب فاخر.' },
    { name: 'Fresh Orange Juice', nameAr: 'عصير برتقال طازج', desc: '100% natural freshly squeezed oranges.', descAr: 'عصير برتقال طبيعي 100% معصور طازجاً.' },
    { name: 'Tropical Pineapple', nameAr: 'اناناس استوائي', desc: 'Sweet and tangy tropical pineapple juice.', descAr: 'عصير أناناس استوائي حلو ومنعش.' },
    { name: 'Iced Peach Tea', nameAr: 'شاي مثلج بالخوخ', desc: 'Smooth black tea infused with peach essence.', descAr: 'شاي أسود مع خلاصة الخوخ.' },
];

const sideDetails = [
    { name: 'Golden French Fries', nameAr: 'بطاطس مقلية ذهبية', desc: 'Crispy, hand-cut golden potatoes.', descAr: 'بطاطس ذهبية مقرمشة مقطعة يدوياً.' },
    { name: 'Cheesy Loaded Fries', nameAr: 'بطاطس محملة بالجبن', desc: 'Fries topped with melted cheese and bacon bits.', descAr: 'بطاطس مغطاة بالجبن الذائب وقطع البيكون.' },
    { name: 'Crispy Onion Rings', nameAr: 'حلقات بصل مقرمشة', desc: 'Beer-battered onions fried to perfection.', descAr: 'حلقات بصل مقلية ومغلفة بالدقيق المقرمش.' },
    { name: 'Hot Fudge Brownie', nameAr: 'براوني شوكولاتة ساخنة', desc: 'Warm chocolate brownie with a gooey center.', descAr: 'براوني شوكولاتة دافئ بقلب ذائب.' },
    { name: 'New York Cheesecake', nameAr: 'تشيز كيك نيويورك', desc: 'Classic creamy cheesecake with a graham crust.', descAr: 'تشيز كيك كريمي كلاسيكي مع قاعدة جراهام.' },
];

const burgerImages = [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1499125562588-29fb8a56b5d5?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1565299507177-b0ac66763828?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1521305916504-4a1121188589?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1547584385-8cd4368468ef?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512152272829-e3139592d56f?q=80&w=1000&auto=format&fit=crop',
];

const drinkImages = [
    'https://images.unsplash.com/photo-1622483767028-3f66f344507c?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1543253687-c931c8e01820?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1541658016709-827b585824ad?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1536935338218-84127270ad11?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1570598912132-0ba199514f0d?q=80&w=1000&auto=format&fit=crop',
];

const sideImages = [
    'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1585109641754-586bc96181fc?q=80&w=1000&auto=format&fit=crop',
];

async function main() {
    console.log('Cleaning up database...');
    await prisma.review.deleteMany();
    await prisma.orderProduct.deleteMany();
    await prisma.extra.deleteMany();
    await prisma.size.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    console.log('Cleanup finished.');

    console.log('Seeding categories...');
    const createdCategories = [];
    for (let i = 0; i < categories.length; i++) {
        const cat = await prisma.category.create({
            data: {
                ...categories[i],
                order: i + 1,
            },
        });
        createdCategories.push(cat);
    }
    console.log('Categories seeded.');

    console.log('Seeding 50 products with real names...');
    for (let i = 1; i <= 50; i++) {
        const isBurger = i <= 25;
        const isDrink = i > 25 && i <= 40;
        const isSide = i > 40;

        let details;
        let image = '';
        let categoryId;

        if (isBurger) {
            details = burgerDetails[Math.floor(Math.random() * burgerDetails.length)];
            image = burgerImages[Math.floor(Math.random() * burgerImages.length)];
            categoryId = createdCategories[Math.floor(Math.random() * 5)].id; // First 5 are burger cats
        } else if (isDrink) {
            details = drinkDetails[Math.floor(Math.random() * drinkDetails.length)];
            image = drinkImages[Math.floor(Math.random() * drinkImages.length)];
            categoryId = createdCategories[5 + Math.floor(Math.random() * 3)].id; // Cats 6-8 are drinks
        } else {
            details = sideDetails[Math.floor(Math.random() * sideDetails.length)];
            image = sideImages[Math.floor(Math.random() * sideImages.length)];
            categoryId = createdCategories[8 + Math.floor(Math.random() * 2)].id; // Cats 9-10 are sides
        }

        const product = await prisma.product.create({
            data: {
                name: `${details.name} ${i > 10 ? i : ''}`,
                nameAr: `${details.nameAr} ${i > 10 ? i : ''}`,
                description: details.desc,
                descriptionAr: details.descAr,
                basePrice: Math.floor(Math.random() * 50) + 10,
                image,
                order: i,
                categoryId,
                onOffer: Math.random() > 0.8,
                sizes: {
                    create: [
                        { name: 'SMALL', price: 0 },
                        { name: 'MEDIUM', price: 5 },
                        { name: 'LARGE', price: 10 },
                    ],
                },
                extras: {
                    create: [
                        { name: 'CHEESE', price: 2 },
                        { name: 'TOMATO', price: 1 },
                        { name: 'ONION', price: 1 },
                    ],
                },
            },
        });
    }
    console.log('50 products seeded.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
