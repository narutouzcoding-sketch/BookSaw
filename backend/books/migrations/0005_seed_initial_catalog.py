# Generated manually for seeding initial catalog and admin accounts

import decimal
import sys
import os
from django.conf import settings
from django.db import migrations
from django.contrib.auth.hashers import make_password

IMG_BASE = 'https://raw.githubusercontent.com/narutouzcoding-sketch/BookSaw/main/catalog/static/catalog/images'
IMG = lambda f: f'{IMG_BASE}/{f}'

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
    {
        'id': 1, 'title': 'Simple Way Of Peace Life', 'author': 'Armor Ramsey', 'category_id': 6,
        'price': 89000, 'old_price': 110000, 'in_stock': True, 'stock_quantity': 15, 'badge': 'bestseller',
        'image': IMG('product-item1.jpg'), 'image2': IMG('product-item6.jpg'),
        'pages': 256, 'published_year': 2022, 'isbn': '978-9943-55-101-1', 'publisher': 'Booksaw Press',
        'language': 'Ingliz', 'sold': 4500,
        'description': "Sokin dengiz qirg'og'i ruhida yozilgan ushbu kitob hayotni soddalashtirish, ichki tinchlik va ongli yashash haqida.",
        'variants': {'covers': ['Qattiq muqova', 'Yumshoq muqova'], 'colors': []}, 'store_id': 1,
    },
    {
        'id': 2, 'title': 'Great Travel At Desert', 'author': 'Sanchit Howdy', 'category_id': 7,
        'price': 75000, 'old_price': 95000, 'in_stock': True, 'stock_quantity': 12, 'badge': 'sale',
        'image': IMG('product-item2.jpg'), 'image2': IMG('tab-item6.jpg'),
        'pages': 320, 'published_year': 2023, 'isbn': '978-9943-55-102-2', 'publisher': 'Booksaw Press',
        'language': 'Ingliz', 'sold': 2800,
        'description': "Sahro qumlari orasidagi uzoq yo'l, jasorat va o'zini topish haqidagi sarguzasht roman.",
        'variants': None, 'store_id': 2,
    },
    {
        'id': 3, 'title': 'The Lady Beauty Scarlett', 'author': 'Arthur Doyle', 'category_id': 1,
        'price': 65000, 'old_price': 80000, 'in_stock': True, 'stock_quantity': 20, 'badge': '',
        'image': IMG('product-item3.jpg'), 'image2': IMG('product-item3.jpg'),
        'pages': 412, 'published_year': 2021, 'isbn': '978-9943-55-103-3', 'publisher': 'Booksaw Press',
        'language': 'Ingliz', 'sold': 3200,
        'description': 'Klassik uslubdagi roman.',
        'variants': None, 'store_id': 3,
    },
    {
        'id': 4, 'title': 'Once Upon A Time', 'author': 'Klein Marry', 'category_id': 1,
        'price': 55000, 'old_price': 55000, 'in_stock': True, 'stock_quantity': 18, 'badge': 'new',
        'image': IMG('product-item4.jpg'), 'image2': IMG('product-item4.jpg'),
        'pages': 180, 'published_year': 2024, 'isbn': '978-9943-55-104-4', 'publisher': 'Booksaw Press',
        'language': 'Ingliz', 'sold': 2100,
        'description': "Tog'lar etagida sehrli ertak.",
        'variants': None, 'store_id': 1,
    },
    {
        'id': 5, 'title': 'Way Of Happiness', 'author': 'Ananda Kumar', 'category_id': 6,
        'price': 72000, 'old_price': 90000, 'in_stock': True, 'stock_quantity': 10, 'badge': 'bestseller',
        'image': IMG('product-item5.jpg'), 'image2': IMG('product-item5.jpg'),
        'pages': 240, 'published_year': 2022, 'isbn': '978-9943-55-105-5', 'publisher': 'Booksaw Press',
        'language': 'Ingliz', 'sold': 4800,
        'description': "Baxt yo'lini izlash haqida amaliy qo'llanma.",
        'variants': None, 'store_id': 2,
    },
    {
        'id': 6, 'title': 'Life Of Secrets', 'author': 'Galista Marie', 'category_id': 5,
        'price': 68000, 'old_price': 85000, 'in_stock': True, 'stock_quantity': 15, 'badge': 'sale',
        'image': IMG('product-item6.jpg'), 'image2': IMG('product-item6.jpg'),
        'pages': 288, 'published_year': 2023, 'isbn': '978-9943-55-106-6', 'publisher': 'Booksaw Press',
        'language': 'Ingliz', 'sold': 1900,
        'description': 'Dengiz sirlari haqidagi nasriy asar.',
        'variants': {'covers': ['Qattiq muqova', 'Yumshoq muqova'], 'colors': []}, 'store_id': 3,
    },
    {
        'id': 7, 'title': 'Fashion System', 'author': 'Kevin Spear', 'category_id': 2,
        'price': 125000, 'old_price': 125000, 'in_stock': True, 'stock_quantity': 8, 'badge': '',
        'image': IMG('product-item7.jpg'), 'image2': IMG('product-item7.jpg'),
        'pages': 360, 'published_year': 2024, 'isbn': '978-9943-55-107-7', 'publisher': 'Booksaw Press',
        'language': 'Ingliz', 'sold': 860,
        'description': 'Moda industriyasi haqida.',
        'variants': None, 'store_id': 1,
    },
    {
        'id': 8, 'title': 'Portrait Photography', 'author': 'Adam Silber', 'category_id': 3,
        'price': 145000, 'old_price': 170000, 'in_stock': True, 'stock_quantity': 10, 'badge': 'sale',
        'image': IMG('tab-item1.jpg'), 'image2': IMG('tab-item1.jpg'),
        'pages': 304, 'published_year': 2023, 'isbn': '978-9943-55-108-8', 'publisher': 'Booksaw Press',
        'language': 'Ingliz', 'sold': 1120,
        'description': 'Portret suratga olish darsligi.',
        'variants': None, 'store_id': 2,
    },
    {
        'id': 9, 'title': 'Tips Of Simple Lifestyle', 'author': 'Bratt Smith', 'category_id': 6,
        'price': 59000, 'old_price': 59000, 'in_stock': True, 'stock_quantity': 14, 'badge': '',
        'image': IMG('tab-item3.jpg'), 'image2': IMG('tab-item3.jpg'),
        'pages': 198, 'published_year': 2024, 'isbn': '978-9943-55-109-9', 'publisher': 'Booksaw Press',
        'language': 'Ingliz', 'sold': 3400,
        'description': 'Minimalizm haqida maslahatlar.',
        'variants': None, 'store_id': 3,
    },
    {
        'id': 10, 'title': 'Just Felt From Outside', 'author': 'Nicole Wilson', 'category_id': 1,
        'price': 62000, 'old_price': 78000, 'in_stock': True, 'stock_quantity': 11, 'badge': 'sale',
        'image': IMG('tab-item4.jpg'), 'image2': IMG('tab-item4.jpg'),
        'pages': 224, 'published_year': 2022, 'isbn': '978-9943-55-110-0', 'publisher': 'Booksaw Press',
        'language': 'Ingliz', 'sold': 1540,
        'description': 'Yoshlik xotirasi haqidagi yengil roman.',
        'variants': None, 'store_id': 1,
    },
    {
        'id': 11, 'title': 'Peaceful Enlightenment', 'author': 'Marmik Lama', 'category_id': 8,
        'price': 77000, 'old_price': 77000, 'in_stock': True, 'stock_quantity': 9, 'badge': '',
        'image': IMG('tab-item5.jpg'), 'image2': IMG('tab-item5.jpg'),
        'pages': 272, 'published_year': 2021, 'isbn': '978-9943-55-111-1', 'publisher': 'Booksaw Press',
        'language': 'Ingliz', 'sold': 2650,
        'description': "Tinch ma'rifat haqida.",
        'variants': None, 'store_id': 2,
    },
    {
        'id': 12, 'title': 'Life Among The Pirates', 'author': 'David Woodard', 'category_id': 7,
        'price': 82000, 'old_price': 99000, 'in_stock': True, 'stock_quantity': 16, 'badge': 'bestseller',
        'image': IMG('tab-item7.jpg'), 'image2': IMG('tab-item7.jpg'),
        'pages': 448, 'published_year': 2020, 'isbn': '978-9943-55-112-2', 'publisher': 'Booksaw Press',
        'language': 'Ingliz', 'sold': 5100,
        'description': 'Qaroqchilar davri haqidagi epik sarguzasht.',
        'variants': None, 'store_id': 3,
    },
    {
        'id': 13, 'title': 'Life Of The Wild', 'author': 'Sanchit Howdy', 'category_id': 5,
        'price': 95000, 'old_price': 95000, 'in_stock': True, 'stock_quantity': 10, 'badge': 'new',
        'image': IMG('main-banner1.jpg'), 'image2': IMG('main-banner1.jpg'),
        'pages': 336, 'published_year': 2025, 'isbn': '978-9943-55-113-3', 'publisher': 'Booksaw Press',
        'language': 'Ingliz', 'sold': 980,
        'description': 'Yovvoyi tabiat haqida.',
        'variants': None, 'store_id': 1,
    },
    {
        'id': 14, 'title': 'Birds Gonna Be Happy', 'author': 'Timbur Hood', 'category_id': 4,
        'price': 48000, 'old_price': 48000, 'in_stock': True, 'stock_quantity': 25, 'badge': '',
        'image': IMG('single-image.jpg'), 'image2': IMG('main-banner2.jpg'),
        'pages': 96, 'published_year': 2024, 'isbn': '978-9943-55-114-4', 'publisher': 'Booksaw Press',
        'language': 'Ingliz', 'sold': 2300,
        'description': 'Bolalar uchun iliqlik ertagi.',
        'variants': None, 'store_id': 2,
    },
]

PROMO_CODES = [
    {'code': 'KITOB20', 'type': 'percent', 'value': 20, 'min_order': 100000},
    {'code': 'YANGI10', 'type': 'percent', 'value': 10, 'min_order': 50000},
    {'code': 'BEPUL', 'type': 'freeShipping', 'value': 0, 'min_order': 200000},
]


def _features(b):
    return [
        {'label': 'Sahifalar soni', 'value': str(b.get('pages', 0))},
        {'label': 'Til', 'value': b.get('language', 'Ingliz')},
        {'label': 'Muqova', 'value': 'Qattiq muqova'},
        {'label': 'Nashriyot', 'value': b.get('publisher', 'Booksaw Press')},
        {'label': 'Yili', 'value': str(b.get('published_year', 2023))},
        {'label': 'ISBN', 'value': b.get('isbn', '')},
        {'label': "O'lchami", 'value': '14x21 sm'},
    ]


def seed_catalog(apps, schema_editor):
    if 'pytest' in sys.modules or 'test' in sys.argv or os.getenv('TESTING') == 'True':
        return

    User = apps.get_model('accounts', 'User')
    Category = apps.get_model('books', 'Category')
    Author = apps.get_model('books', 'Author')
    Book = apps.get_model('books', 'Book')
    PromoCode = apps.get_model('books', 'PromoCode')

    # 1. Superusers
    quvonch_user = User.objects.filter(username='QuvonchbekQosimov').first()
    if not quvonch_user:
        User.objects.create(
            username='QuvonchbekQosimov',
            email='qosimovquvonc@gmail.com',
            password='pbkdf2_sha256$1500000$J0BfZ3k3VGcG1CYyyobL0P$c9S1VqnfxhPLnMXFqYlnNbdFMS6d0u190LWSZ5EgMKI=',
            is_staff=True,
            is_superuser=True,
            is_active=True,
        )
    else:
        quvonch_user.is_staff = True
        quvonch_user.is_superuser = True
        quvonch_user.is_active = True
        quvonch_user.save()

    admin_user = User.objects.filter(username='admin').first()
    if not admin_user:
        User.objects.create(
            username='admin',
            email='admin@booksaw.uz',
            password=make_password('AdminBooksaw2026!'),
            is_staff=True,
            is_superuser=True,
            is_active=True,
        )
    else:
        admin_user.is_staff = True
        admin_user.is_superuser = True
        admin_user.is_active = True
        admin_user.password = make_password('AdminBooksaw2026!')
        admin_user.save()

    # 2. Categories
    for c in CATEGORIES:
        Category.objects.update_or_create(
            id=c['id'],
            defaults={'name': c['name'], 'slug': c['slug'], 'image': c['image']},
        )

    # 3. Authors and Books
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
                'stock_quantity': b.get('stock_quantity', 10),
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

    # 4. Promo codes
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

    # 5. Advance PostgreSQL sequences to prevent primary key collision
    if schema_editor.connection.vendor == 'postgresql':
        with schema_editor.connection.cursor() as cursor:
            cursor.execute("SELECT setval(pg_get_serial_sequence('books_book', 'id'), coalesce(max(id), 1)) FROM books_book;")
            cursor.execute("SELECT setval(pg_get_serial_sequence('books_category', 'id'), coalesce(max(id), 1)) FROM books_category;")
            cursor.execute("SELECT setval(pg_get_serial_sequence('books_author', 'id'), coalesce(max(id), 1)) FROM books_author;")


def reverse_func(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('books', '0004_order_unique_active_user_promo_code'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RunPython(seed_catalog, reverse_func),
    ]
