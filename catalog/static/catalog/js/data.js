const IMG = (file) => '../../static/catalog/images/' + file;

const CATEGORIES = [
    { id: 1, name: "Badiiy adabiyot", icon: "🎭", slug: "badiiy-adabiyot", count: 4, image: IMG('product-item3.jpg') },
    { id: 2, name: "Biznes va Rivojlanish", icon: "📈", slug: "biznes-va-rivojlanish", count: 1, image: IMG('product-item7.jpg') },
    { id: 3, name: "Ijod va hunar", icon: "📷", slug: "ijod-va-hunar", count: 1, image: IMG('tab-item1.jpg') },
    { id: 4, name: "Bolalar adabiyoti", icon: "🧸", slug: "bolalar-adabiyoti", count: 2, image: IMG('single-image.jpg') },
    { id: 5, name: "Tabiat va ilm", icon: "🔬", slug: "tabiat-va-ilm", count: 2, image: IMG('main-banner1.jpg') },
    { id: 6, name: "Psixologiya", icon: "🧠", slug: "psixologiya", count: 3, image: IMG('product-item5.jpg') },
    { id: 7, name: "Sarguzasht", icon: "⛵", slug: "sarguzasht", count: 2, image: IMG('tab-item7.jpg') },
    { id: 8, name: "Ma'naviyat", icon: "🕊️", slug: "manaviyat", count: 1, image: IMG('tab-item5.jpg') }
];

function book(partial) {
    return {
        oldPrice: partial.price,
        discount: 0,
        badge: null,
        inStock: true,
        variants: null,
        language: "Ingliz",
        publisher: "Booksaw Press",
        year: 2023,
        storeId: ((partial.id - 1) % 3) + 1,
        ...partial,
        features: [
            { label: "Sahifalar soni", value: String(partial.pages) },
            { label: "Til", value: partial.language || "Ingliz" },
            { label: "Muqova", value: "Qattiq muqova" },
            { label: "Nashriyot", value: partial.publisher || "Booksaw Press" },
            { label: "Yili", value: String(partial.year || 2023) },
            { label: "ISBN", value: partial.isbn },
            { label: "O'lchami", value: "14x21 sm" }
        ]
    };
}

const PRODUCTS = [
    book({
        id: 1,
        name: "Simple Way Of Peace Life",
        author: "Armor Ramsey",
        categoryId: 6,
        categoryName: "Psixologiya",
        price: 89000,
        oldPrice: 110000,
        discount: 19,
        rating: 4.8,
        reviewCount: 345,
        image: IMG('product-item1.jpg'),
        image2: IMG('product-item6.jpg'),
        badge: "bestseller",
        variants: { covers: ['Qattiq muqova', 'Yumshoq muqova'], colors: [] },
        pages: 256,
        year: 2022,
        isbn: "978-9943-55-101-1",
        description: "Sokin dengiz qirg'og'i ruhida yozilgan ushbu kitob hayotni soddalashtirish, ichki tinchlik va ongli yashash haqida. Armor Ramsey kundalik shovqindan uzoqlashib, o'zingizga qaytish yo'llarini ochib beradi.",
        sold: 4500
    }),
    book({
        id: 2,
        name: "Great Travel At Desert",
        author: "Sanchit Howdy",
        categoryId: 7,
        categoryName: "Sarguzasht",
        price: 75000,
        oldPrice: 95000,
        discount: 21,
        rating: 4.6,
        reviewCount: 210,
        image: IMG('product-item2.jpg'),
        image2: IMG('tab-item6.jpg'),
        badge: "sale",
        pages: 320,
        year: 2023,
        isbn: "978-9943-55-102-2",
        description: "Sahro qumlari orasidagi uzoq yo'l, jasorat va o'zini topish haqidagi sarguzasht roman. Sanchit Howdy o'quvchini issiq shamol va cheksiz ufqlar olamiga olib kiradi.",
        sold: 2800
    }),
    book({
        id: 3,
        name: "The Lady Beauty Scarlett",
        author: "Arthur Doyle",
        categoryId: 1,
        categoryName: "Badiiy adabiyot",
        price: 65000,
        oldPrice: 80000,
        discount: 18,
        rating: 4.9,
        reviewCount: 280,
        image: IMG('product-item3.jpg'),
        image2: IMG('product-item3.jpg'),
        pages: 412,
        year: 2021,
        isbn: "978-9943-55-103-3",
        description: "Klassik uslubdagi nainis romani. Scarlett xonimning nafis dunyosi, jamiyat qoidalari va yurak sirlari nozik qatlamlarda tasvirlangan.",
        sold: 3200
    }),
    book({
        id: 4,
        name: "Once Upon A Time",
        author: "Klein Marry",
        categoryId: 1,
        categoryName: "Badiiy adabiyot",
        price: 55000,
        oldPrice: 55000,
        rating: 4.9,
        reviewCount: 2,
        image: IMG('product-item4.jpg'),
        badge: "new",
        variants: null,
        pages: 180,
        year: 2024,
        isbn: "978-9943-55-104-4",
        description: "Tog'lar etagida, quyosh nuri va erkinlik haqidagi sehrli ertak. Bolalar va ota-onalar birga o'qishi uchun yozilgan iliqlik va umid kitobi.",
        sold: 2100
    }),
    book({
        id: 5,
        name: "Way Of Happiness",
        author: "Ananda Kumar",
        categoryId: 6,
        categoryName: "Psixologiya",
        price: 72000,
        oldPrice: 90000,
        discount: 20,
        rating: 4.8,
        reviewCount: 220,
        image: IMG('product-item5.jpg'),
        image2: IMG('product-item5.jpg'),
        badge: "bestseller",
        inStock: false,
        pages: 240,
        year: 2022,
        isbn: "978-9943-55-105-5",
        description: "Baxt yo'lini izlash, pok niyat va ongli fikrlash haqida amaliy qo'llanma. Ananda Kumar kundalik odatlar orqali kayfiyatni o'zgartirish sirlarini o'rgatadi.",
        sold: 4800
    }),
    book({
        id: 6,
        name: "Life Of Secrets",
        author: "Galista Marie",
        categoryId: 5,
        categoryName: "Tabiat va ilm",
        price: 68000,
        oldPrice: 85000,
        discount: 20,
        rating: 4.7,
        reviewCount: 165,
        image: IMG('product-item6.jpg'),
        image2: IMG('product-item6.jpg'),
        badge: "sale",
        variants: { covers: ['Qattiq muqova', 'Yumshoq muqova'], colors: [] },
        pages: 288,
        year: 2023,
        isbn: "978-9943-55-106-6",
        description: "Dengiz sirlari, sohil hayoti va tabiatning nozik go'zalligi haqidagi nasriy asar. Galista Marie suv va qum tilini she'riy ohangda so'zlaydi.",
        sold: 1900
    }),
    book({
        id: 7,
        name: "Fashion System",
        author: "Kevin Spear",
        categoryId: 2,
        categoryName: "Biznes va Rivojlanish",
        price: 125000,
        oldPrice: 125000,
        rating: 4.5,
        reviewCount: 98,
        image: IMG('product-item7.jpg'),
        image2: IMG('product-item7.jpg'),
        pages: 360,
        year: 2024,
        isbn: "978-9943-55-107-7",
        description: "Moda industriyasi, brend qurish va ijodiy biznes tizimi haqida. Kevin Spear tendensiyalar ortidagi iqtisodiy va madaniy mexanizmlarni tushuntiradi.",
        sold: 860
    }),
    book({
        id: 8,
        name: "Portrait Photography",
        author: "Adam Silber",
        categoryId: 3,
        categoryName: "Ijod va hunar",
        price: 145000,
        oldPrice: 170000,
        discount: 15,
        rating: 4.7,
        reviewCount: 134,
        image: IMG('tab-item1.jpg'),
        image2: IMG('tab-item1.jpg'),
        badge: "sale",
        pages: 304,
        year: 2023,
        isbn: "978-9943-55-108-8",
        description: "Portret suratga olishning asoslaridan professional natijagacha. Yorug'lik, kompozitsiya va inson bilan ishlash bo'yicha amaliy darslik.",
        sold: 1120
    }),
    book({
        id: 9,
        name: "Tips Of Simple Lifestyle",
        author: "Bratt Smith",
        categoryId: 6,
        categoryName: "Psixologiya",
        price: 59000,
        oldPrice: 59000,
        rating: 4.6,
        reviewCount: 176,
        image: IMG('tab-item3.jpg'),
        image2: IMG('tab-item3.jpg'),
        pages: 198,
        year: 2024,
        isbn: "978-9943-55-109-9",
        description: "Minimalizm, tartib va sodda yashash bo'yicha qisqa maslahatlar to'plami. Ortig'idan voz kechib, muhim narsaga e'tibor qaratishni o'rgatadi.",
        sold: 3400
    }),
    book({
        id: 10,
        name: "Just Felt From Outside",
        author: "Nicole Wilson",
        categoryId: 1,
        categoryName: "Badiiy adabiyot",
        price: 62000,
        oldPrice: 78000,
        discount: 20,
        rating: 4.4,
        reviewCount: 88,
        image: IMG('tab-item4.jpg'),
        image2: IMG('tab-item4.jpg'),
        badge: "sale",
        pages: 224,
        year: 2022,
        isbn: "978-9943-55-110-0",
        description: "Yoz, hovuz yoqasi va yoshlik xotirasi haqidagi yengil roman. Nicole Wilson tashqi dunyo va ichki hislar orasidagi nozik chiziqni chizadi.",
        sold: 1540
    }),
    book({
        id: 11,
        name: "Peaceful Enlightenment",
        author: "Marmik Lama",
        categoryId: 8,
        categoryName: "Ma'naviyat",
        price: 77000,
        oldPrice: 77000,
        rating: 4.9,
        reviewCount: 205,
        image: IMG('tab-item5.jpg'),
        image2: IMG('tab-item5.jpg'),
        pages: 272,
        year: 2021,
        isbn: "978-9943-55-111-1",
        description: "Tinch ma'rifat, meditatsiya va hayotni yorug' qilish yo'li. Marmik Lama qadimgi donolikni bugungi kun tilida tushuntiradi.",
        sold: 2650
    }),
    book({
        id: 12,
        name: "Life Among The Pirates",
        author: "David Woodard",
        categoryId: 7,
        categoryName: "Sarguzasht",
        price: 82000,
        oldPrice: 99000,
        discount: 17,
        rating: 4.8,
        reviewCount: 312,
        image: IMG('tab-item7.jpg'),
        image2: IMG('tab-item7.jpg'),
        badge: "bestseller",
        pages: 448,
        year: 2020,
        isbn: "978-9943-55-112-2",
        description: "Qaroqchilar davri, dengiz janglari va oltin izlash haqidagi epik sarguzasht. David Woodard o'quvchini quyosh botayotgan yelkanlar ortiga olib ketadi.",
        sold: 5100
    }),
    book({
        id: 13,
        name: "Life Of The Wild",
        author: "Sanchit Howdy",
        categoryId: 5,
        categoryName: "Tabiat va ilm",
        price: 95000,
        oldPrice: 95000,
        rating: 4.7,
        reviewCount: 142,
        image: IMG('main-banner1.jpg'),
        image2: IMG('main-banner1.jpg'),
        badge: "new",
        pages: 336,
        year: 2025,
        isbn: "978-9943-55-113-3",
        description: "Yovvoyi tabiat, qushlar va o'simliklar olami haqidagi ilmiy-badiiy kitob. Muallif tabiatning jimjit go'zalligini nafis tasvirlar bilan jonlantiradi.",
        sold: 980
    }),
    book({
        id: 14,
        name: "Birds Gonna Be Happy",
        author: "Timbur Hood",
        categoryId: 4,
        categoryName: "Bolalar adabiyoti",
        price: 48000,
        oldPrice: 48000,
        rating: 4.8,
        reviewCount: 167,
        image: IMG('single-image.jpg'),
        image2: IMG('main-banner2.jpg'),
        pages: 96,
        year: 2024,
        isbn: "978-9943-55-114-4",
        description: "Bug'doyzor va osmon ostidagi kichik uy haqidagi iliqlik ertagi. Bolalarga umid, erkinlik va baxt qushlari haqida so'zlaydi.",
        sold: 2300
    })
];

CATEGORIES.forEach(c => {
    c.count = PRODUCTS.filter(p => p.categoryId === c.id).length;
});

const REVIEWS = {
    1: [
        { id: 101, userId: 1, userName: "Sardor Aliyev", rating: 5, date: "2024-03-12T10:30:00Z", text: "Juda osoyishta kitob. O'qib bo'lgach, hayotga boshqacha nazar tashlaysiz.", helpful: 24, images: [] },
        { id: 102, userId: 2, userName: "Malika Karimova", rating: 4, date: "2024-05-20T14:15:00Z", text: "Muqovasi chiroyli, matni yengil. Tavsiya qilaman.", helpful: 12, images: [] },
        { id: 103, userId: 3, userName: "Jamshid Qodirov", rating: 5, date: "2025-01-05T09:45:00Z", text: "Dam olish kunlarimda qayta-qayta ochib o'qiyman.", helpful: 35, images: [] }
    ],
    2: [
        { id: 301, userId: 9, userName: "Aziza T.", rating: 5, date: "2025-04-02T12:00:00Z", text: "Sahro tasvirlari jonli. Yo'lda o'qishga mos.", helpful: 11, images: [] }
    ],
    3: [
        { id: 302, userId: 10, userName: "Bekzod", rating: 5, date: "2025-06-18T09:10:00Z", text: "Klassik ohang, tarjimasi ravon. Sovg'aga oldim.", helpful: 7, images: [] }
    ],
    4: [
        { id: 303, userId: 11, userName: "Nilufar", rating: 5, date: "2025-08-01T18:20:00Z", text: "Qiziqarli ertak, bolalar kechasi uchun zo'r.", helpful: 4, images: [] },
        { id: 304, userId: 12, userName: "Otabek", rating: 4, date: "2025-08-14T11:00:00Z", text: "Muqovasi chiroyli, matn qisqa va iliqlik bilan yozilgan.", helpful: 2, images: [] }
    ],
    12: [
        { id: 501, userId: 7, userName: "Nodir", rating: 5, date: "2024-07-22T19:30:00Z", text: "Sarguzashtni sevuvchilar uchun ajoyib tanlov. Oxirigacha qo'yib yubormaydi.", helpful: 52, images: [] },
        { id: 502, userId: 8, userName: "Feruza", rating: 4, date: "2024-09-15T10:05:00Z", text: "Syujeti qiziq, tarjimasi ravon.", helpful: 8, images: [] }
    ],
    14: [
        { id: 201, userId: 4, userName: "Zilola Vohidova", rating: 5, date: "2024-08-30T16:00:00Z", text: "Farzandimga oldim — ertak ruhi zo'r, kechqurun birga o'qiymiz.", helpful: 18, images: [] },
        { id: 202, userId: 5, userName: "Dilshodbek", rating: 5, date: "2024-02-18T11:20:00Z", text: "Ertak o'qishni yoqtiradiganlar uchun durdona.", helpful: 9, images: [] }
    ]
};

const QNA = {
    1: [
        { id: 1, userName: "Kamola", date: "2025-11-02T10:00:00Z", text: "Elektron versiyasi bormi?", answer: "Hozircha faqat qog'oz nashr. Tez orada e-book ham chiqadi." }
    ],
    12: [
        { id: 2, userName: "Javohir", date: "2025-09-20T14:00:00Z", text: "Yoshga oid cheklov bormi?", answer: "12+ tavsiya etiladi, zo'ravonlik sahnalari o'rtacha." }
    ]
};

PRODUCTS.forEach(p => {
    const revs = REVIEWS[p.id] || [];
    if (revs.length) {
        p.reviewCount = revs.length;
        p.rating = Math.round((revs.reduce((s, r) => s + r.rating, 0) / revs.length) * 10) / 10;
    }
});

const BANNERS = [
    {
        id: 1,
        image: IMG('post-img1.jpg'),
        title: "Kitob — eng yaxshi sovg'a",
        subtitle: "Yaqinlaringizga ilm va iliqlik ulashing",
        buttonText: "Xarid qilish",
        link: "book_list.html?gift=true"
    },
    {
        id: 2,
        image: IMG('post-img3.jpg'),
        title: "Kuzgi katta chegirmalar",
        subtitle: "Tanlangan bestsellerlarga 30% gacha chegirma",
        buttonText: "Chegirmalar",
        link: "book_list.html?sale=true"
    },
    {
        id: 3,
        image: IMG('post-img2.jpg'),
        title: "Yangi mavsum kitoblari",
        subtitle: "Harakatdagi ong va sokin o'qish oqshomlari uchun",
        buttonText: "Katalog",
        link: "book_list.html?all=1"
    }
];

const POSTS = [
    {
        id: 1,
        image: IMG('post-img1.jpg'),
        title: "Farzandingiz bilan birga o'qing",
        excerpt: "Oilaviy o'qish odatini qanday shakllantirish va qaysi kitoblardan boshlash kerak.",
        date: "2026-03-12",
        body: "<p>Har kechqurun 15 daqiqa — farzandingiz bilan kitob o'qish uchun yetarli. Avval qisqa ertaklardan boshlang, keyin birga savol bering: qahramon nima his qildi?</p><p>Booksaw bolalar bo'limida 4–10 yosh uchun tanlov bor. Ovoz chiqarib o'qish lug'atni ham oshiradi.</p>"
    },
    {
        id: 2,
        image: IMG('post-img2.jpg'),
        title: "Tinch oqshom: 15 daqiqa kitob",
        excerpt: "Kunlik shovqindan keyin qisqa, ongli o'qish amaliyoti haqida.",
        date: "2026-02-28",
        body: "<p>Telefonni chetga qo'ying. Bir bob — va xotirjamlik. Ongli o'qish meditatsiyaga o'xshaydi: nafas, sahifa, e'tibor.</p><p>Psixologiya va ma'naviyat bo'limidagi qisqa kitoblar shu odat uchun mos.</p>"
    },
    {
        id: 3,
        image: IMG('post-img3.jpg'),
        title: "Do'stlar bilan adabiyot",
        excerpt: "Kitob klubi tuzish, muhokama qilish va sevimli asarlarni ulashish.",
        date: "2026-01-19",
        body: "<p>Oyiga bitta kitob, 4–6 kishi, choy va ochiq savol. Klub qoidasi oddiy: spoiler berishdan oldin ogohlantiring.</p><p>Badiiy adabiyot va sarguzasht bo'limidan oy kitobini tanlang.</p>"
    }
];

const BRANDS = [
    { id: 1, name: "Booksaw", logo: IMG('client-image1.png') },
    { id: 2, name: "Flaprise", logo: IMG('client-image2.png') },
    { id: 3, name: "Bookstore", logo: IMG('client-image3.png') },
    { id: 4, name: "Bookdoor", logo: IMG('client-image4.png') },
    { id: 5, name: "Library House", logo: IMG('client-image5.png') }
];

const PROMO_CODES = [
    { code: "KITOB20", type: "percent", value: 20, minOrder: 100000 },
    { code: "YANGI10", type: "percent", value: 10, minOrder: 50000 },
    { code: "BEPUL", type: "freeShipping", value: 0, minOrder: 200000 }
];

const DELIVERY_OPTIONS = [
    { id: 1, name: "Standart yetkazib berish", price: 15000, days: "3-5 kun", icon: "🚚" },
    { id: 2, name: "Ekspress yetkazib berish", price: 35000, days: "1-2 kun", icon: "⚡" },
    { id: 3, name: "Olib ketish (Pikap)", price: 0, days: "Bugun", icon: "🏪" }
];

const PAYMENT_METHODS = [
    { id: 1, name: "Payme", icon: "💳", description: "Payme orqali tezkor to'lov" },
    { id: 2, name: "Click", icon: "📱", description: "Click Evolution orqali to'lov" },
    { id: 3, name: "Naqd pul", icon: "💵", description: "Qabul qilib olganda to'lash" },
    { id: 4, name: "Uzum Nasiya", icon: "⏳", description: "Bo'lib to'lash imkoniyati" }
];

const INFO_PAGES = {
    about: { title: "Biz haqimizda", body: "<p>Booksaw — kitobxonlar uchun onlayn vitrina. Tanlangan nashrlar, tezkor yetkazib berish va ochiq narxlar.</p>" },
    delivery: { title: "Yetkazib berish", body: "<p>Standart yetkazib berish: 3–5 kun, 15 000 so‘m.</p><p>Ekspress: 1–2 kun, 35 000 so‘m.</p><p>Olib ketish (pikap): bepul, shu kun.</p>" },
    returns: { title: "Qaytarish siyosati", body: "<p>Kitob zararlanmagan va o‘qilmagan holatda 14 kun ichida qaytarilishi mumkin. Yetkazib berish to‘lovi qaytarilmaydi.</p>" },
    help: { title: "Yordam markazi", body: "<p>Savollar uchun: info@bookscatalog.uz yoki +998 (71) 200-00-00. Ish vaqti: 09:00–18:00.</p>" },
    terms: { title: "Foydalanish shartlari", body: "<p>Saytdan foydalanish orqali siz buyurtma, to‘lov va qaytarish qoidalariga rozilik bildirgan bo‘lasiz.</p>" },
    privacy: { title: "Maxfiylik siyosati", body: "<p>Shaxsiy ma’lumotlar faqat buyurtmani bajarish uchun ishlatiladi va uchinchi tomonga sotilmaydi.</p>" }
};

const STORES = [
    {
        id: 1,
        name: "Booksaw rasmiy do'koni",
        logo: IMG('client-image1.png'),
        banner: IMG('post-img1.jpg'),
        rating: 4.9,
        reviewCount: 12500,
        productCount: 14,
        verified: true,
        joinedDate: "2020-05-12",
        description: "Booksaw nashrlarining rasmiy vitrinasi. Barcha muqovalar original, yetkazib berish tezkor."
    },
    {
        id: 2,
        name: "Flaprise",
        logo: IMG('client-image2.png'),
        banner: IMG('post-img2.jpg'),
        rating: 5.0,
        reviewCount: 8400,
        productCount: 8,
        verified: true,
        joinedDate: "2018-09-01",
        description: "Tanlangan badiiy va ma'naviy nashrlar. Sifatli qog'oz va chiroyli dizayn."
    },
    {
        id: 3,
        name: "Bookstore",
        logo: IMG('client-image3.png'),
        banner: IMG('post-img3.jpg'),
        rating: 4.6,
        reviewCount: 3200,
        productCount: 11,
        verified: false,
        joinedDate: "2022-01-15",
        description: "Turli nashriyotlarning kitoblari bitta joyda. Hamyonbop narx va keng tanlov."
    }
];
