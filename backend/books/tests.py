from decimal import Decimal
import pytest
from django.utils import timezone
from datetime import timedelta
from rest_framework import status

from accounts.models import User
from books.models import (
    Author, Book, Cart, CartItem, Category, Order, OrderItem,
    PromoCode, Question, Review, WishlistItem,
)


@pytest.fixture
def catalog_setup(db):
    cat1 = Category.objects.create(name='Badiiy', slug='badiiy')
    cat2 = Category.objects.create(name='Biznes', slug='biznes')

    a1 = Author.objects.create(name='Author One')
    a2 = Author.objects.create(name='Author Two')

    b1 = Book.objects.create(
        title='Book Alpha',
        author=a1,
        category=cat1,
        price=Decimal('100000.00'),
        old_price=Decimal('120000.00'),
        in_stock=True,
        published_year=2023,
        badge='bestseller',
    )
    b2 = Book.objects.create(
        title='Book Beta',
        author=a2,
        category=cat2,
        price=Decimal('50000.00'),
        old_price=None,
        in_stock=True,
        published_year=2024,
        badge='new',
    )
    b3 = Book.objects.create(
        title='Book Gamma',
        author=a1,
        category=cat1,
        price=Decimal('70000.00'),
        in_stock=False,
        published_year=2022,
    )
    return {
        'cat1': cat1, 'cat2': cat2,
        'a1': a1, 'a2': a2,
        'b1': b1, 'b2': b2, 'b3': b3,
    }


# ===========================================================================
# Books & Categories
# ===========================================================================

@pytest.mark.django_db
class TestBooksAPI:
    def test_book_list_200(self, api_client, catalog_setup):
        b1 = catalog_setup['b1']
        Review.objects.create(book=b1, user=User.objects.create_user('r1', 'r1@ex.com', 'pass'), rating=4, text='Great')
        Review.objects.create(book=b1, user=User.objects.create_user('r2', 'r2@ex.com', 'pass'), rating=5, text='Awesome')

        res = api_client.get('/api/v1/books/')
        assert res.status_code == status.HTTP_200_OK
        assert 'count' in res.data
        assert 'results' in res.data
        assert res.data['count'] == 3

        item = next(x for x in res.data['results'] if x['id'] == b1.id)
        assert item['title'] == 'Book Alpha'
        assert item['author_name'] == 'Author One'
        assert item['category_name'] == 'Badiiy'
        assert item['discount'] == 17  # round((1 - 100000/120000)*100)
        assert float(item['rating']) == 4.5
        assert item['review_count'] == 2
        assert item['price'] == '100000.00'

    def test_book_list_filter_category(self, api_client, catalog_setup):
        cat2 = catalog_setup['cat2']
        res = api_client.get(f'/api/v1/books/?category={cat2.id}')
        assert res.status_code == status.HTTP_200_OK
        assert res.data['count'] == 1
        assert res.data['results'][0]['title'] == 'Book Beta'

    def test_book_list_search(self, api_client, catalog_setup):
        res = api_client.get('/api/v1/books/?search=Alpha')
        assert res.status_code == status.HTTP_200_OK
        assert res.data['count'] == 1
        assert res.data['results'][0]['title'] == 'Book Alpha'

    def test_book_list_ordering(self, api_client, catalog_setup):
        res = api_client.get('/api/v1/books/?ordering=price')
        assert res.status_code == status.HTTP_200_OK
        prices = [float(b['price']) for b in res.data['results']]
        assert prices == sorted(prices)

    def test_book_list_pagination(self, api_client, catalog_setup):
        res = api_client.get('/api/v1/books/?pageSize=2&page=1')
        assert res.status_code == status.HTTP_200_OK
        assert len(res.data['results']) == 2
        assert res.data['next'] is not None

    def test_book_detail_200(self, api_client, catalog_setup):
        b1 = catalog_setup['b1']
        res = api_client.get(f'/api/v1/books/{b1.id}/')
        assert res.status_code == status.HTTP_200_OK
        assert res.data['id'] == b1.id
        assert res.data['title'] == 'Book Alpha'

    def test_book_detail_404(self, api_client):
        res = api_client.get('/api/v1/books/99999/')
        assert res.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
class TestCategoriesAPI:
    def test_category_list_200(self, api_client, catalog_setup):
        res = api_client.get('/api/v1/categories/')
        assert res.status_code == status.HTTP_200_OK
        cat1_data = next(c for c in res.data if c['slug'] == 'badiiy')
        assert cat1_data['products_count'] == 2  # Book Alpha and Book Gamma


# ===========================================================================
# Reviews & Questions
# ===========================================================================

@pytest.mark.django_db
class TestReviewsAPI:
    def test_review_list_200(self, api_client, catalog_setup, user):
        b1 = catalog_setup['b1']
        Review.objects.create(book=b1, user=user, rating=5, text='Zo\'r kitob')

        res = api_client.get(f'/api/v1/books/{b1.id}/reviews/')
        assert res.status_code == status.HTTP_200_OK
        assert len(res.data['results']) == 1
        assert res.data['results'][0]['text'] == 'Zo\'r kitob'

    def test_review_create_authenticated(self, auth_client, catalog_setup):
        b1 = catalog_setup['b1']
        payload = {'rating': 4, 'text': 'Tavsiya qilaman!'}
        res = auth_client.post(f'/api/v1/books/{b1.id}/reviews/', payload, format='json')
        assert res.status_code == status.HTTP_201_CREATED
        assert res.data['rating'] == 4
        assert res.data['text'] == 'Tavsiya qilaman!'
        assert res.data['product_id'] == b1.id

    def test_review_create_unauthenticated_fails(self, api_client, catalog_setup):
        b1 = catalog_setup['b1']
        payload = {'rating': 5, 'text': 'Anonim sharh'}
        res = api_client.post(f'/api/v1/books/{b1.id}/reviews/', payload, format='json')
        assert res.status_code in (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN)


@pytest.mark.django_db
class TestQuestionsAPI:
    def test_question_list_200(self, api_client, catalog_setup, user):
        b1 = catalog_setup['b1']
        Question.objects.create(book=b1, user=user, text='Elektron shakli bormi?', answer='Ha')

        res = api_client.get(f'/api/v1/books/{b1.id}/questions/')
        assert res.status_code == status.HTTP_200_OK
        assert len(res.data['results']) == 1
        assert res.data['results'][0]['text'] == 'Elektron shakli bormi?'
        assert res.data['results'][0]['answer'] == 'Ha'

    def test_question_create_authenticated(self, auth_client, catalog_setup):
        b1 = catalog_setup['b1']
        res = auth_client.post(f'/api/v1/books/{b1.id}/questions/', {'text': 'Qachon keladi?'}, format='json')
        assert res.status_code == status.HTTP_201_CREATED
        assert res.data['text'] == 'Qachon keladi?'

    def test_question_create_unauthenticated_fails(self, api_client, catalog_setup):
        b1 = catalog_setup['b1']
        res = api_client.post(f'/api/v1/books/{b1.id}/questions/', {'text': 'Savol'}, format='json')
        assert res.status_code in (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN)


# ===========================================================================
# Cart & Wishlist
# ===========================================================================

@pytest.mark.django_db
class TestCartAPI:
    def test_cart_get_empty(self, api_client):
        res = api_client.get('/api/v1/cart/')
        assert res.status_code == status.HTTP_200_OK
        assert res.data['items'] == []
        assert res.data['subtotal'] == '0'
        assert res.data['item_count'] == 0

    def test_cart_add_and_totals(self, api_client, catalog_setup):
        b1 = catalog_setup['b1']
        res = api_client.post('/api/v1/cart/', {'book_id': b1.id, 'quantity': 2}, format='json')
        assert res.status_code == status.HTTP_201_CREATED
        assert len(res.data['items']) == 1
        assert res.data['subtotal'] == '200000.00'
        assert res.data['item_count'] == 2

    def test_cart_patch_quantity(self, api_client, catalog_setup):
        b1 = catalog_setup['b1']
        api_client.post('/api/v1/cart/', {'book_id': b1.id, 'quantity': 2}, format='json')

        res = api_client.patch('/api/v1/cart/', {'book_id': b1.id, 'quantity': 5}, format='json')
        assert res.status_code == status.HTTP_200_OK
        assert res.data['subtotal'] == '500000.00'
        assert res.data['item_count'] == 5

    def test_cart_delete_single_item(self, api_client, catalog_setup):
        b1 = catalog_setup['b1']
        b2 = catalog_setup['b2']
        api_client.post('/api/v1/cart/', {'book_id': b1.id, 'quantity': 1}, format='json')
        api_client.post('/api/v1/cart/', {'book_id': b2.id, 'quantity': 1}, format='json')

        res = api_client.delete('/api/v1/cart/', {'book_id': b1.id}, format='json')
        assert res.status_code == status.HTTP_200_OK
        assert len(res.data['items']) == 1
        assert res.data['items'][0]['book_detail']['id'] == b2.id

    def test_cart_clear(self, api_client, catalog_setup):
        b1 = catalog_setup['b1']
        api_client.post('/api/v1/cart/', {'book_id': b1.id, 'quantity': 1}, format='json')

        res = api_client.delete('/api/v1/cart/', {'clear': True}, format='json')
        assert res.status_code == status.HTTP_200_OK
        assert len(res.data['items']) == 0
        assert res.data['subtotal'] == '0'


@pytest.mark.django_db
class TestWishlistAPI:
    def test_wishlist_add_and_delete(self, api_client, catalog_setup):
        b1 = catalog_setup['b1']
        # Add
        res = api_client.post('/api/v1/wishlist/', {'book_id': b1.id}, format='json')
        assert res.status_code == status.HTTP_201_CREATED
        assert len(res.data) == 1

        # Duplicate add returns 200 without adding again
        res_dup = api_client.post('/api/v1/wishlist/', {'book_id': b1.id}, format='json')
        assert res_dup.status_code == status.HTTP_200_OK

        # Get
        res_get = api_client.get('/api/v1/wishlist/')
        assert len(res_get.data) == 1

        # Delete
        res_del = api_client.delete('/api/v1/wishlist/', {'book_id': b1.id}, format='json')
        assert res_del.status_code == status.HTTP_200_OK
        assert len(res_del.data) == 0


# ===========================================================================
# Promo Codes
# ===========================================================================

@pytest.mark.django_db
class TestPromoAPI:
    def test_promo_validate_percent_success(self, api_client):
        PromoCode.objects.create(code='PROMO20', type='percent', value=20, min_order=Decimal('100000.00'))
        payload = {'code': 'promo20', 'subtotal': '150000.00'}
        res = api_client.post('/api/v1/promo/validate/', payload, format='json')
        assert res.status_code == status.HTTP_200_OK
        assert res.data['code'] == 'PROMO20'
        assert res.data['discount_amount'] == '30000.00'

    def test_promo_validate_free_shipping_success(self, api_client):
        PromoCode.objects.create(code='BEPUL', type='freeShipping', value=0, min_order=Decimal('200000.00'))
        payload = {'code': 'BEPUL', 'subtotal': '250000.00'}
        res = api_client.post('/api/v1/promo/validate/', payload, format='json')
        assert res.status_code == status.HTTP_200_OK
        assert res.data['type'] == 'freeShipping'
        assert res.data['discount_amount'] == '0.00'

    def test_promo_validate_min_order_fails(self, api_client):
        PromoCode.objects.create(code='HIGH', type='percent', value=10, min_order=Decimal('500000.00'))
        payload = {'code': 'HIGH', 'subtotal': '100000.00'}
        res = api_client.post('/api/v1/promo/validate/', payload, format='json')
        assert res.status_code == status.HTTP_400_BAD_REQUEST

    def test_promo_validate_expired_fails(self, api_client):
        PromoCode.objects.create(
            code='OLD', type='percent', value=10, min_order=Decimal('0.00'),
            valid_until=timezone.now() - timedelta(days=1)
        )
        res = api_client.post('/api/v1/promo/validate/', {'code': 'OLD', 'subtotal': '100000.00'}, format='json')
        assert res.status_code == status.HTTP_400_BAD_REQUEST

    def test_promo_validate_usage_limit_reached_fails(self, api_client):
        PromoCode.objects.create(
            code='LIMITED', type='percent', value=10, min_order=Decimal('0.00'),
            usage_limit=1, used_count=1
        )
        res = api_client.post('/api/v1/promo/validate/', {'code': 'LIMITED', 'subtotal': '100000.00'}, format='json')
        assert res.status_code == status.HTTP_400_BAD_REQUEST


# ===========================================================================
# Orders
# ===========================================================================

@pytest.mark.django_db
class TestOrdersAPI:
    def test_order_create_success_server_calculates_all_prices(self, auth_client, user, catalog_setup):
        b1 = catalog_setup['b1']  # price 100,000, in_stock True
        b2 = catalog_setup['b2']  # price 50,000, in_stock True
        PromoCode.objects.create(code='DISC10', type='percent', value=10, min_order=Decimal('100000.00'))

        # Put items in user's cart
        cart = Cart.objects.create(user=user)
        CartItem.objects.create(cart=cart, book=b1, quantity=1)
        CartItem.objects.create(cart=cart, book=b2, quantity=2)  # subtotal = 100k + 100k = 200k

        initial_sold_b1 = b1.sold
        initial_sold_b2 = b2.sold

        payload = {
            'promo_code': 'disc10',
            'delivery_option_id': 1,  # 15000
            'address': {'city': 'Tashkent', 'address': 'Amir Temur 1'},
            'payment_method': 'Payme',
        }
        res = auth_client.post('/api/v1/orders/', payload, format='json')
        assert res.status_code == status.HTTP_201_CREATED

        # Check server calculated amounts:
        # Subtotal: 100000 + (50000 * 2) = 200,000.00
        # Discount: 10% of 200,000 = 20,000.00
        # Delivery: 15,000.00
        # Total: 200,000 - 20,000 + 15,000 = 195,000.00
        assert res.data['subtotal'] == '200000.00'
        assert res.data['discount'] == '20000.00'
        assert res.data['delivery_cost'] == '15000.00'
        assert res.data['total'] == '195000.00'
        assert len(res.data['items']) == 2

        # Check cart was cleared
        cart.refresh_from_db()
        assert cart.items.count() == 0

        # Check sold counts incremented
        b1.refresh_from_db()
        b2.refresh_from_db()
        assert b1.sold == initial_sold_b1 + 1
        assert b2.sold == initial_sold_b2 + 2

    def test_order_create_out_of_stock_fails(self, auth_client, user, catalog_setup):
        b3 = catalog_setup['b3']  # in_stock = False
        cart = Cart.objects.create(user=user)
        CartItem.objects.create(cart=cart, book=b3, quantity=1)

        res = auth_client.post('/api/v1/orders/', {}, format='json')
        assert res.status_code == status.HTTP_400_BAD_REQUEST
        assert 'omborda mavjud emas' in res.data['detail']

    def test_order_create_empty_cart_fails(self, auth_client, user):
        Cart.objects.create(user=user)
        res = auth_client.post('/api/v1/orders/', {}, format='json')
        assert res.status_code == status.HTTP_400_BAD_REQUEST

    def test_order_create_unauthenticated_fails(self, api_client):
        res = api_client.post('/api/v1/orders/', {}, format='json')
        assert res.status_code in (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN)

    def test_order_list_own_only(self, auth_client, user, user2):
        # Create order for user
        o1 = Order.objects.create(
            user=user, subtotal=Decimal('10000.00'), total=Decimal('25000.00')
        )
        # Create order for user2
        o2 = Order.objects.create(
            user=user2, subtotal=Decimal('20000.00'), total=Decimal('35000.00')
        )

        res = auth_client.get('/api/v1/orders/')
        assert res.status_code == status.HTTP_200_OK
        ids = [x['id'] for x in res.data['results']]
        assert o1.id in ids
        assert o2.id not in ids
