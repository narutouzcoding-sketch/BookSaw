import os
import sys
import threading
from decimal import Decimal

# Setup Django environment with real PostgreSQL database
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

from django.db import connection, connections
from rest_framework.test import APIClient
from accounts.models import User
from books.models import Author, Book, Cart, CartItem, Category, Order


def run_concurrency_test():
    print("=" * 65)
    print("REAL POSTGRESQL CONCURRENCY TEST (select_for_update + F expressions)")
    print(f"Database Engine: {connection.settings_dict['ENGINE']}")
    print(f"Database Name:   {connection.settings_dict['NAME']}")
    print(f"Database Host:   {connection.settings_dict['HOST']}:{connection.settings_dict['PORT']}")
    print("=" * 65)

    if 'sqlite' in connection.settings_dict['ENGINE']:
        print("ERROR: Test is running on SQLite, not PostgreSQL!")
        sys.exit(1)

    # Clean up previous run if any
    Order.objects.filter(user__username__startswith='concurrency_buyer_').delete()
    Cart.objects.filter(user__username__startswith='concurrency_buyer_').delete()
    Book.objects.filter(title="High Demand Book (Only 1 left)").delete()
    User.objects.filter(username__startswith='concurrency_buyer_').delete()

    # 1. Use existing category and author in PostgreSQL
    cat = Category.objects.first()
    author = Author.objects.first()

    # Create book with EXACTLY 1 item in stock
    book = Book.objects.create(
        title="High Demand Book (Only 1 left)",
        author=author,
        category=cat,
        price=Decimal('75000.00'),
        stock_quantity=1,
        in_stock=True,
        sold=0,
    )
    print(f"\n[INIT] Kitob yaratildi: '{book.title}', id={book.id}")
    print(f"       stock_quantity: {book.stock_quantity}, in_stock: {book.in_stock}, sold: {book.sold}")

    users = []
    for i in range(1, 6):
        u, _ = User.objects.get_or_create(
            username=f'concurrency_buyer_{i}',
            defaults={'email': f'buyer_{i}@example.com'}
        )
        u.set_password('Password123!')
        u.save()
        users.append(u)

        # Har bir xaridor savatiga 1 donadan kitob qo'shadi
        cart, _ = Cart.objects.get_or_create(user=u)
        CartItem.objects.filter(cart=cart).delete()
        CartItem.objects.create(cart=cart, book=book, quantity=1)

    print(f"[SETUP] 5 ta xaridor yaratildi va har birining savatiga 1 donadan kitob solindi.")
    print("\n[START] 5 ta parallel thread bir vaqtda /api/v1/orders/ ga buyurtma yubormoqda...\n")

    results = []
    barrier = threading.Barrier(5)

    def place_order(user):
        # Har bir thread o'zining mustaqil PostgreSQL connectioniga ega bo'lishi shart
        connections.close_all()
        client = APIClient()
        client.force_login(user)

        # Barcha 5 thread bir vaqtda (millisekund darajasida parallel) boshlashi uchun barrier
        barrier.wait()

        try:
            res = client.post('/api/v1/orders/', {
                'delivery_option_id': 1,
                'address': {'city': 'Tashkent', 'address': 'Amir Temur 15'},
                'payment_method': 'Click',
            }, format='json')
            if res.status_code == 201:
                order_id = res.data.get('id') if hasattr(res, 'data') else 'N/A'
                results.append(('SUCCESS', user.username, res.status_code, f"Order #{order_id}"))
            else:
                detail = res.data.get('detail', str(res.data)) if hasattr(res, 'data') else res.content.decode()[:80]
                results.append(('BLOCKED', user.username, res.status_code, detail))
        except Exception as e:
            results.append(('EXCEPTION', user.username, 500, str(e)))
        finally:
            connections.close_all()

    threads = [threading.Thread(target=place_order, args=(u,)) for u in users]
    for t in threads:
        t.start()
    for t in threads:
        t.join()

    # Natijalarni tartiblab chop etish
    print("-" * 65)
    print("THREAD NATIJALARI:")
    print("-" * 65)
    success_count = 0
    blocked_count = 0
    for status, username, code, msg in sorted(results, key=lambda x: (x[0] != 'SUCCESS', x[1])):
        if status == 'SUCCESS':
            success_count += 1
            print(f"  [OK 201]  {username:22} -> {msg}")
        else:
            blocked_count += 1
            print(f"  [{status} {code}] {username:22} -> {msg}")
    print("-" * 65)

    # Kitobning yakuniy holatini bazadan qayta tekshirish
    book.refresh_from_db()
    print(f"\n[FINAL DB STATE] '{book.title}':")
    print(f"  stock_quantity : {book.stock_quantity} (Kutilgan: 0)")
    print(f"  in_stock       : {book.in_stock} (Kutilgan: False)")
    print(f"  sold           : {book.sold} (Kutilgan: 1)")

    # Tekshiruv
    assert success_count == 1, f"Kutilgan 1 ta muvaffaqiyat, lekin {success_count} ta bo'ldi!"
    assert blocked_count == 4, f"Kutilgan 4 ta rad etish, lekin {blocked_count} ta bo'ldi!"
    assert book.stock_quantity == 0, f"stock_quantity 0 bo'lishi kerak, lekin {book.stock_quantity}!"
    assert book.in_stock is False, f"in_stock False bo'lishi kerak, lekin {book.in_stock}!"
    assert book.sold == 1, f"sold 1 bo'lishi kerak, lekin {book.sold}!"

    print("\n" + "=" * 65)
    print("XULOSA: REAL POSTGRESQL CONCURRENCY TEST 100% MUVAFFAQISHLANDI!")
    print("1 ta buyurtma ombor zaxirasini muvaffaqiyatli band qildi.")
    print("Qolgan 4 ta parallel buyurtma select_for_update qulfi ochilgach,")
    print("zaxira tugagani sababli xavfsiz tarzda 400 bilan to'xtatildi.")
    print("Hech qanday overselling yoki race condition yuz bermadi!")
    print("=" * 65)

    # Tozalash
    Order.objects.filter(user__in=users).delete()
    Cart.objects.filter(user__in=users).delete()
    book.delete()
    User.objects.filter(username__in=[u.username for u in users]).delete()
    print("\n[CLEANUP] Test yozuvlari tozalandi.")


if __name__ == '__main__':
    run_concurrency_test()
