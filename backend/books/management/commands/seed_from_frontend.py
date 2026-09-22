"""Seed database with data matching frontend's data.js."""
import decimal
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from books.models import (
    Author, Book, Category, PromoCode, Question, Review,
)

User = get_user_model()

IMG = lambda f: f'../../static/catalog/images/{f}'

CATEGORIES = [
    {'id': 1, 'name': 'Badiiy adabiyot', 'slug': 'badiiy-adabiyot', 'image': IMG('product-item3.jpg')},
    {'id': 2, 'name': 'Biznes va Rivojlanish', 'slug': 'biznes-va-rivojlanish', 'image': IMG('product-item7.jpg')},
    {'id': 3, 'name': 'Ijod va hunar', 'slug': 'ijod-va-hunar', 'image': IMG('tab-item1.jpg')},
    {'id': 4, 'name': 'Bolalar adabiyoti', 'slug': 'bolalar-adabiyoti', 'image': IMG('single-image.jpg')},
    {'id': 5, 'name': 'Tabiat va ilm', 'slug': 'tabiat-va-ilm', 'image': IMG('main-banner1.jpg')},
    {'id': 6, 'name': 'Psixologiya', 'slug': 'psixologiya', 'image': IMG('product-item5.jpg')},
    {'id': 7, 'name': 'Sarguzasht', 'slug': 'sarguzasht', 'image': IMG('tab-item7.jpg')},
    {'id': 8, 'name': "Ma'naviyat", 'slug': 'manaviyat', 'image': IMG('tab-item5.jpg')},
]

BOOKS = [
    {'id': 1, 'title': 'Simple Way Of Peace Life', 'author': 'Armor Ramsey', 'category_id': 6, 'price': 89000, 'old_price': 110000, 'in_stock': True, 'badge': 'bestseller', 'image': IMG('product-item1.jpg'), 'image2': IMG('product-item6.jpg'), 'pages': 256, 'published_year': 2022, 'isbn': '978-9943-55-101-1', 'publisher': 'Booksaw Press', 'language': 'Ingliz', 'sold': 4500, 'description': "Sokin dengiz qirg'og'i ruhida yozilgan ushbu kitob hayotni soddalashtirish, ichki tinchlik va ongli yashash haqida.", 'variants': {'covers': ['Qattiq muqova', 'Yumshoq muqova'], 'colors': []}, 'store_id': 1},
    {'id': 2, 'title': 'Great Travel At Desert', 'author': 'Sanchit Howdy', 'category_id': 7, 'price': 75000, 'old_price': 95000, 'in_stock': True, 'badge': 'sale', 'image': IMG('product-item2.jpg'), 'image2': IMG('tab-item6.jpg'), 'pages': 320, 'published_year': 2023, 'isbn': '978-9943-55-102-2', 'publisher': 'Booksaw Press', 'language': 'Ingliz', 'sold': 2800, 'description': "Sahro qumlari orasidagi uzoq yo'l, jasorat va o'zini topish haqidagi sarguzasht roman.", 'variants': None, 'store_id': 2},
    {'id': 3, 'title': 'The Lady Beauty Scarlett', 'author': 'Arthur Doyle', 'category_id': 1, 'price': 65000, 'old_price': 80000, 'in_stock': True, 'badge': '', 'image': IMG('product-item3.jpg'), 'image2': IMG('product-item3.jpg'), 'pages': 412, 'published_year': 2021, 'isbn': '978-9943-55-103-3', 'publisher': 'Booksaw Press', 'language': 'Ingliz', 'sold': 3200, 'description': 'Klassik uslubdagi roman.', 'variants': None, 'store_id': 3},
    {'id': 4, 'title': 'Once Upon A Time', 'author': 'Klein Marry', 'category_id': 1, 'price': 55000, 'old_price': 55000, 'in_stock': True, 'badge': 'new', 'image': IMG('product-item4.jpg'), 'image2': IMG('product-item4.jpg'), 'pages': 180, 'published_year': 2024, 'isbn': '978-9943-55-104-4', 'publisher': 'Booksaw Press', 'language': 'Ingliz', 'sold': 2100, 'description': "Tog'lar etagida sehrli ertak.", 'variants': None, 'store_id': 1},
    {'id': 5, 'title': 'Way Of Happiness', 'author': 'Ananda Kumar', 'category_id': 6, 'price': 72000, 'old_price': 90000, 'in_stock': False, 'badge': 'bestseller', 'image': IMG('product-item5.jpg'), 'image2': IMG('product-item5.jpg'), 'pages': 240, 'published_year': 2022, 'isbn': '978-9943-55-105-5', 'publisher': 'Booksaw Press', 'language': 'Ingliz', 'sold': 4800, 'description': "Baxt yo'lini izlash haqida amaliy qo'llanma.", 'variants': None, 'store_id': 2},
    {'id': 6, 'title': 'Life Of Secrets', 'author': 'Galista Marie', 'category_id': 5, 'price': 68000, 'old_price': 85000, 'in_stock': True, 'badge': 'sale', 'image': IMG('product-item6.jpg'), 'image2': IMG('product-item6.jpg'), 'pages': 288, 'published_year': 2023, 'isbn': '978-9943-55-106-6', 'publisher': 'Booksaw Press', 'language': 'Ingliz', 'sold': 1900, 'description': 'Dengiz sirlari haqidagi nasriy asar.', 'variants': {'covers': ['Qattiq muqova', 'Yumshoq muqova'], 'colors': []}, 'store_id': 3},
    {'id': 7, 'title': 'Fashion System', 'author': 'Kevin Spear', 'category_id': 2, 'price': 125000, 'old_price': 125000, 'in_stock': True, 'badge': '', 'image': IMG('product-item7.jpg'), 'image2': IMG('product-item7.jpg'), 'pages': 360, 'published_year': 2024, 'isbn': '978-9943-55-107-7', 'publisher': 'Booksaw Press', 'language': 'Ingliz', 'sold': 860, 'description': 'Moda industriyasi haqida.', 'variants': None, 'store_id': 1},
    {'id': 8, 'title': 'Portrait Photography', 'author': 'Adam Silber', 'category_id': 3, 'price': 145000, 'old_price': 170000, 'in_stock': True, 'badge': 'sale', 'image': IMG('tab-item1.jpg'), 'image2': IMG('tab-item1.jpg'), 'pages': 304, 'published_year': 2023, 'isbn': '978-9943-55-108-8', 'publisher': 'Booksaw Press', 'language': 'Ingliz', 'sold': 1120, 'description': 'Portret suratga olish darsligi.', 'variants': None, 'store_id': 2},
    {'id': 9, 'title': 'Tips Of Simple Lifestyle', 'author': 'Bratt Smith', 'category_id': 6, 'price': 59000, 'old_price': 59000, 'in_stock': True, 'badge': '', 'image': IMG('tab-item3.jpg'), 'image2': IMG('tab-item3.jpg'), 'pages': 198, 'published_year': 2024, 'isbn': '978-9943-55-109-9', 'publisher': 'Booksaw Press', 'language': 'Ingliz', 'sold': 3400, 'description': 'Minimalizm haqida maslahatlar.', 'variants': None, 'store_id': 3},
    {'id': 10, 'title': 'Just Felt From Outside', 'author': 'Nicole Wilson', 'category_id': 1, 'price': 62000, 'old_price': 78000, 'in_stock': True, 'badge': 'sale', 'image': IMG('tab-item4.jpg'), 'image2': IMG('tab-item4.jpg'), 'pages': 224, 'published_year': 2022, 'isbn': '978-9943-55-110-0', 'publisher': 'Booksaw Press', 'language': 'Ingliz', 'sold': 1540, 'description': 'Yoshlik xotirasi haqidagi yengil roman.', 'variants': None, 'store_id': 1},
    {'id': 11, 'title': 'Peaceful Enlightenment', 'author': 'Marmik Lama', 'category_id': 8, 'price': 77000, 'old_price': 77000, 'in_stock': True, 'badge': '', 'image': IMG('tab-item5.jpg'), 'image2': IMG('tab-item5.jpg'), 'pages': 272, 'published_year': 2021, 'isbn': '978-9943-55-111-1', 'publisher': 'Booksaw Press', 'language': 'Ingliz', 'sold': 2650, 'description': "Tinch ma'rifat haqida.", 'variants': None, 'store_id': 2},
    {'id': 12, 'title': 'Life Among The Pirates', 'author': 'David Woodard', 'category_id': 7, 'price': 82000, 'old_price': 99000, 'in_stock': True, 'badge': 'bestseller', 'image': IMG('tab-item7.jpg'), 'image2': IMG('tab-item7.jpg'), 'pages': 448, 'published_year': 2020, 'isbn': '978-9943-55-112-2', 'publisher': 'Booksaw Press', 'language': 'Ingliz', 'sold': 5100, 'description': 'Qaroqchilar davri haqidagi epik sarguzasht.', 'variants': None, 'store_id': 3},
    {'id': 13, 'title': 'Life Of The Wild', 'author': 'Sanchit Howdy', 'category_id': 5, 'price': 95000, 'old_price': 95000, 'in_stock': True, 'badge': 'new', 'image': IMG('main-banner1.jpg'), 'image2': IMG('main-banner1.jpg'), 'pages': 336, 'published_year': 2025, 'isbn': '978-9943-55-113-3', 'publisher': 'Booksaw Press', 'language': 'Ingliz', 'sold': 980, 'description': 'Yovvoyi tabiat haqida.', 'variants': None, 'store_id': 1},
    {'id': 14, 'title': 'Birds Gonna Be Happy', 'author': 'Timbur Hood', 'category_id': 4, 'price': 48000, 'old_price': 48000, 'in_stock': True, 'badge': '', 'image': IMG('single-image.jpg'), 'image2': IMG('main-banner2.jpg'), 'pages': 96, 'published_year': 2024, 'isbn': '978-9943-55-114-4', 'publisher': 'Booksaw Press', 'language': 'Ingliz', 'sold': 2300, 'description': 'Bolalar uchun iliqlik ertagi.', 'variants': None, 'store_id': 2},
]

REVIEWS = {
    1: [
        {'user_name': 'Sardor Aliyev', 'rating': 5, 'text': "Juda osoyishta kitob.", 'helpful': 24},
        {'user_name': 'Malika Karimova', 'rating': 4, 'text': 'Muqovasi chiroyli, matni yengil.', 'helpful': 12},
        {'user_name': 'Jamshid Qodirov', 'rating': 5, 'text': 'Dam olish kunlarimda qayta o\'qiyman.', 'helpful': 35},
    ],
    2: [{'user_name': 'Aziza T.', 'rating': 5, 'text': 'Sahro tasvirlari jonli.', 'helpful': 11}],
    3: [{'user_name': 'Bekzod', 'rating': 5, 'text': 'Klassik ohang, ravon.', 'helpful': 7}],
    4: [
        {'user_name': 'Nilufar', 'rating': 5, 'text': 'Qiziqarli ertak.', 'helpful': 4},
        {'user_name': 'Otabek', 'rating': 4, 'text': 'Muqovasi chiroyli.', 'helpful': 2},
    ],
    12: [
        {'user_name': 'Nodir', 'rating': 5, 'text': 'Ajoyib tanlov.', 'helpful': 52},
        {'user_name': 'Feruza', 'rating': 4, 'text': 'Syujeti qiziq.', 'helpful': 8},
    ],
    14: [
        {'user_name': 'Zilola Vohidova', 'rating': 5, 'text': 'Ertak ruhi zo\'r.', 'helpful': 18},
        {'user_name': 'Dilshodbek', 'rating': 5, 'text': 'Ertak durdona.', 'helpful': 9},
    ],
}

QNA = {
    1: [{'user_name': 'Kamola', 'text': 'Elektron versiyasi bormi?', 'answer': 'Hozircha faqat qog\'oz nashr.'}],
    12: [{'user_name': 'Javohir', 'text': 'Yoshga oid cheklov bormi?', 'answer': '12+ tavsiya etiladi.'}],
}

PROMO_CODES = [
    {'code': 'KITOB20', 'type': 'percent', 'value': 20, 'min_order': 100000},
    {'code': 'YANGI10', 'type': 'percent', 'value': 10, 'min_order': 50000},
    {'code': 'BEPUL', 'type': 'freeShipping', 'value': 0, 'min_order': 200000},
]


def _features(b):
    """Build features list like data.js does."""
    return [
        {'label': 'Sahifalar soni', 'value': str(b.get('pages', 0))},
        {'label': 'Til', 'value': b.get('language', 'Ingliz')},
        {'label': 'Muqova', 'value': 'Qattiq muqova'},
        {'label': 'Nashriyot', 'value': b.get('publisher', 'Booksaw Press')},
        {'label': 'Yili', 'value': str(b.get('published_year', 2023))},
        {'label': 'ISBN', 'value': b.get('isbn', '')},
        {'label': "O'lchami", 'value': '14x21 sm'},
    ]


class Command(BaseCommand):
    help = 'Seed database with data matching frontend data.js'

    def handle(self, *args, **options):
        self.stdout.write('Seeding categories...')
        for c in CATEGORIES:
            Category.objects.update_or_create(
                id=c['id'],
                defaults={'name': c['name'], 'slug': c['slug'], 'image': c['image']},
            )

        self.stdout.write('Seeding authors and books...')
        for b in BOOKS:
            author, _ = Author.objects.get_or_create(name=b['author'])
            Book.objects.update_or_create(
                id=b['id'],
                defaults={
                    'title': b['title'],
                    'author': author,
                    'category_id': b['category_id'],
                    'price': decimal.Decimal(str(b['price'])),
                    'old_price': decimal.Decimal(str(b['old_price'])) if b.get('old_price') else None,
                    'in_stock': b.get('in_stock', True),
                    'badge': b.get('badge', ''),
                    'image': b.get('image', ''),
                    'image2': b.get('image2', ''),
                    'pages': b.get('pages', 0),
                    'published_year': b.get('published_year'),
                    'isbn': b.get('isbn', ''),
                    'publisher': b.get('publisher', ''),
                    'language': b.get('language', ''),
                    'sold': b.get('sold', 0),
                    'store_id': b.get('store_id', 1),
                    'features': _features(b),
                    'variants': b.get('variants'),
                    'description': b.get('description', ''),
                },
            )

        self.stdout.write('Seeding reviews...')
        for book_id, reviews in REVIEWS.items():
            book = Book.objects.get(id=book_id)
            for r in reviews:
                user, _ = User.objects.get_or_create(
                    username=r['user_name'].lower().replace(' ', '_').replace('.', ''),
                    defaults={
                        'first_name': r['user_name'].split()[0] if ' ' in r['user_name'] else r['user_name'],
                        'email': f"{r['user_name'].lower().replace(' ', '.')}@example.com",
                    },
                )
                Review.objects.update_or_create(
                    book=book,
                    user=user,
                    defaults={
                        'rating': r['rating'],
                        'text': r['text'],
                        'helpful': r.get('helpful', 0),
                    },
                )

        self.stdout.write('Seeding questions...')
        for book_id, questions in QNA.items():
            book = Book.objects.get(id=book_id)
            for q in questions:
                user, _ = User.objects.get_or_create(
                    username=q['user_name'].lower().replace(' ', '_'),
                    defaults={
                        'first_name': q['user_name'],
                        'email': f"{q['user_name'].lower().replace(' ', '.')}@example.com",
                    },
                )
                Question.objects.update_or_create(
                    book=book,
                    user=user,
                    text=q['text'],
                    defaults={'answer': q.get('answer', '')},
                )

        self.stdout.write('Seeding promo codes...')
        for p in PROMO_CODES:
            PromoCode.objects.update_or_create(
                code=p['code'],
                defaults={
                    'type': p['type'],
                    'value': p['value'],
                    'min_order': decimal.Decimal(str(p['min_order'])),
                    'active': True,
                },
            )

        self.stdout.write(self.style.SUCCESS(
            f'Done! {Category.objects.count()} categories, '
            f'{Book.objects.count()} books, {Review.objects.count()} reviews, '
            f'{Question.objects.count()} questions, {PromoCode.objects.count()} promo codes.'
        ))
