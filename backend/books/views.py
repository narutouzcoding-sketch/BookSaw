from decimal import Decimal

from django.db import IntegrityError, transaction
from django.db.models import Avg, Count, F, Q, Value
from django.db.models.functions import Coalesce
from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

from drf_spectacular.utils import extend_schema

from .models import (
    Book, Cart, CartItem, Category, Order, OrderItem,
    PromoCode, Question, Review, WishlistItem,
)
from .permissions import IsOwnerOrReadOnly
from .serializers import (
    BookDetailSerializer, BookListSerializer, CartItemSerializer,
    CartSerializer, CategorySerializer, OrderCreateSerializer,
    OrderSerializer, PromoResultSerializer, PromoValidateSerializer,
    QuestionSerializer, ReviewSerializer, WishlistItemSerializer,
    CartAddSerializer, CartUpdateSerializer, CartDeleteSerializer,
    WishlistAddSerializer,
)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

DELIVERY_PRICES = {1: Decimal('15000'), 2: Decimal('35000'), 3: Decimal('0')}


def _book_queryset():
    """Base queryset with rating/review_count annotations."""
    return (
        Book.objects
        .select_related('author', 'category')
        .annotate(
            rating=Coalesce(Avg('reviews__rating'), Value(0.0)),
            review_count=Count('reviews'),
        )
    )


def _get_or_create_cart(request):
    """Get or create cart for current user/session."""
    if request.user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=request.user)
    else:
        if not request.session.session_key:
            request.session.create()
        sk = request.session.session_key
        cart, _ = Cart.objects.get_or_create(session_key=sk, user__isnull=True)
    return cart


def _get_wishlist_filter(request):
    """Return Q filter for current user/session wishlist."""
    if request.user.is_authenticated:
        return Q(user=request.user)
    if not request.session.session_key:
        request.session.create()
    return Q(session_key=request.session.session_key, user__isnull=True)


# ---------------------------------------------------------------------------
# Books
# ---------------------------------------------------------------------------

class BookViewSet(viewsets.ReadOnlyModelViewSet):
    """GET /api/v1/books/ and GET /api/v1/books/{id}/"""
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {'category': ['exact'], 'author': ['exact']}
    search_fields = ['title', 'author__name', 'description']
    ordering_fields = ['title', 'price', 'published_year', 'created_at', 'sold']
    ordering = ['-created_at']

    def get_queryset(self):
        return _book_queryset()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return BookDetailSerializer
        return BookListSerializer


# ---------------------------------------------------------------------------
# Categories
# ---------------------------------------------------------------------------

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """GET /api/v1/categories/"""
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None  # categories are few, no pagination

    def get_queryset(self):
        return Category.objects.annotate(products_count=Count('books'))


# ---------------------------------------------------------------------------
# Reviews
# ---------------------------------------------------------------------------

class ReviewListCreateView(generics.ListCreateAPIView):
    """GET/POST /api/v1/books/{book_id}/reviews/"""
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False) or 'book_id' not in self.kwargs:
            return Review.objects.none()
        return (
            Review.objects
            .filter(book_id=self.kwargs['book_id'])
            .select_related('user')
        )

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user,
            book_id=self.kwargs['book_id'],
        )


# ---------------------------------------------------------------------------
# Questions
# ---------------------------------------------------------------------------

class QuestionListCreateView(generics.ListCreateAPIView):
    """GET/POST /api/v1/books/{book_id}/questions/"""
    serializer_class = QuestionSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False) or 'book_id' not in self.kwargs:
            return Question.objects.none()
        return (
            Question.objects
            .filter(book_id=self.kwargs['book_id'])
            .select_related('user')
        )

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user,
            book_id=self.kwargs['book_id'],
        )


# ---------------------------------------------------------------------------
# Cart
# ---------------------------------------------------------------------------

class CartView(APIView):
    """
    GET    /api/v1/cart/              -> full cart with server prices
    POST   /api/v1/cart/              -> add item {book_id, quantity, variant}
    PATCH  /api/v1/cart/              -> update item {book_id, quantity}
    DELETE /api/v1/cart/              -> remove item {book_id} or clear {clear: true}
    """
    permission_classes = [permissions.AllowAny]

    @extend_schema(responses={200: CartSerializer})
    def get(self, request):
        cart = _get_or_create_cart(request)
        cart_with_items = Cart.objects.prefetch_related(
            'items', 'items__book', 'items__book__author'
        ).get(pk=cart.pk)
        return Response(CartSerializer(cart_with_items).data)

    @extend_schema(request=CartAddSerializer, responses={201: CartSerializer})
    def post(self, request):
        cart = _get_or_create_cart(request)
        book_id = request.data.get('book_id')
        quantity = int(request.data.get('quantity', 1))
        variant = request.data.get('variant', '')

        if not book_id:
            return Response({'detail': 'book_id majburiy.'}, status=400)

        try:
            book = Book.objects.get(pk=book_id)
        except Book.DoesNotExist:
            return Response({'detail': 'Kitob topilmadi.'}, status=404)

        item, created = CartItem.objects.get_or_create(
            cart=cart, book=book,
            defaults={'quantity': min(quantity, 10), 'variant': variant or ''},
        )
        if not created:
            item.quantity = min(10, item.quantity + quantity)
            item.save()

        cart.refresh_from_db()
        cart_with_items = Cart.objects.prefetch_related(
            'items', 'items__book', 'items__book__author'
        ).get(pk=cart.pk)
        return Response(CartSerializer(cart_with_items).data, status=201)

    @extend_schema(request=CartUpdateSerializer, responses={200: CartSerializer})
    def patch(self, request):
        cart = _get_or_create_cart(request)
        book_id = request.data.get('book_id')
        quantity = request.data.get('quantity')

        if not book_id or quantity is None:
            return Response({'detail': 'book_id va quantity majburiy.'}, status=400)

        quantity = max(1, min(10, int(quantity)))
        try:
            item = CartItem.objects.get(cart=cart, book_id=book_id)
        except CartItem.DoesNotExist:
            return Response({'detail': 'Mahsulot savatda topilmadi.'}, status=404)

        item.quantity = quantity
        item.save()

        cart_with_items = Cart.objects.prefetch_related(
            'items', 'items__book', 'items__book__author'
        ).get(pk=cart.pk)
        return Response(CartSerializer(cart_with_items).data)

    @extend_schema(request=CartDeleteSerializer, responses={200: CartSerializer})
    def delete(self, request):
        cart = _get_or_create_cart(request)
        clear = (request.data.get('clear') if hasattr(request, 'data') and request.data else None) or request.query_params.get('clear')
        if clear and str(clear).lower() in ('true', '1'):
            cart.items.all().delete()
        else:
            book_id = (request.data.get('book_id') if hasattr(request, 'data') and request.data else None) or request.query_params.get('book_id')
            if not book_id:
                return Response({'detail': 'book_id yoki clear majburiy.'}, status=400)
            CartItem.objects.filter(cart=cart, book_id=book_id).delete()

        cart_with_items = Cart.objects.prefetch_related(
            'items', 'items__book', 'items__book__author'
        ).get(pk=cart.pk)
        return Response(CartSerializer(cart_with_items).data)


# ---------------------------------------------------------------------------
# Wishlist
# ---------------------------------------------------------------------------

class WishlistView(APIView):
    """
    GET    /api/v1/wishlist/          -> list wishlist items
    POST   /api/v1/wishlist/          -> add {book_id}
    DELETE /api/v1/wishlist/          -> remove {book_id}
    """
    permission_classes = [permissions.AllowAny]

    def _items(self, request):
        filt = _get_wishlist_filter(request)
        return WishlistItem.objects.filter(filt).select_related('book', 'book__author')

    @extend_schema(responses={200: WishlistItemSerializer(many=True)})
    def get(self, request):
        items = self._items(request)
        return Response(WishlistItemSerializer(items, many=True).data)

    @extend_schema(request=WishlistAddSerializer, responses={201: WishlistItemSerializer(many=True)})
    def post(self, request):
        book_id = request.data.get('book_id')
        if not book_id:
            return Response({'detail': 'book_id majburiy.'}, status=400)

        try:
            book = Book.objects.get(pk=book_id)
        except Book.DoesNotExist:
            return Response({'detail': 'Kitob topilmadi.'}, status=404)

        defaults = {}
        if request.user.is_authenticated:
            defaults['user'] = request.user
        else:
            if not request.session.session_key:
                request.session.create()
            defaults['session_key'] = request.session.session_key

        # Check for duplicates
        filt = _get_wishlist_filter(request) & Q(book=book)
        if WishlistItem.objects.filter(filt).exists():
            return Response({'detail': 'Allaqachon sevimlilarda.'}, status=200)

        WishlistItem.objects.create(book=book, **defaults)
        items = self._items(request)
        return Response(WishlistItemSerializer(items, many=True).data, status=201)

    @extend_schema(request=WishlistAddSerializer, responses={200: WishlistItemSerializer(many=True)})
    def delete(self, request):
        book_id = (request.data.get('book_id') if hasattr(request, 'data') and request.data else None) or request.query_params.get('book_id')
        if not book_id:
            return Response({'detail': 'book_id majburiy.'}, status=400)

        filt = _get_wishlist_filter(request) & Q(book_id=book_id)
        WishlistItem.objects.filter(filt).delete()
        items = self._items(request)
        return Response(WishlistItemSerializer(items, many=True).data)


# ---------------------------------------------------------------------------
# Promo Validation
# ---------------------------------------------------------------------------

class PromoValidateView(APIView):
    """POST /api/v1/promo/validate/  {code, subtotal}"""
    permission_classes = [permissions.AllowAny]

    @extend_schema(request=PromoValidateSerializer, responses={200: PromoResultSerializer})
    def post(self, request):
        ser = PromoValidateSerializer(data=request.data)
        ser.is_valid(raise_exception=True)

        code = ser.validated_data['code'].strip().upper()
        subtotal = ser.validated_data['subtotal']

        if request.user.is_authenticated:
            if Order.objects.filter(
                user=request.user, promo_code=code
            ).exclude(status='cancelled').exists():
                return Response(
                    {'detail': 'Siz ushbu promo-koddan allaqachon foydalangansiz.'},
                    status=400,
                )

        try:
            promo = PromoCode.objects.get(code=code)
        except PromoCode.DoesNotExist:
            return Response({'detail': "Noto'g'ri promo-kod."}, status=400)

        if not promo.is_valid():
            return Response({'detail': 'Promo-kod muddati tugagan yoki faol emas.'}, status=400)

        if subtotal < promo.min_order:
            return Response(
                {'detail': f'Minimal buyurtma: {promo.min_order}'},
                status=400,
            )

        if promo.type == 'percent':
            discount_amount = (subtotal * promo.value / 100).quantize(Decimal('1'))
        else:
            discount_amount = Decimal('0')

        result = PromoResultSerializer({
            'code': promo.code,
            'type': promo.type,
            'value': promo.value,
            'discount_amount': discount_amount,
            'min_order': promo.min_order,
        })
        return Response(result.data)


# ---------------------------------------------------------------------------
# Orders
# ---------------------------------------------------------------------------

class OrderListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/v1/orders/   -> own orders only
    POST /api/v1/orders/   -> create order from cart
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return OrderCreateSerializer
        return OrderSerializer

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False) or not self.request.user.is_authenticated:
            return Order.objects.none()
        return (
            Order.objects
            .filter(user=self.request.user)
            .prefetch_related('items', 'items__book')
        )

    def create(self, request, *args, **kwargs):
        ser = OrderCreateSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        data = ser.validated_data

        try:
            with transaction.atomic():
                # 1. Get user's cart
                try:
                    cart = Cart.objects.prefetch_related('items', 'items__book').get(
                        user=request.user
                    )
                except Cart.DoesNotExist:
                    return Response({'detail': 'Savat topilmadi.'}, status=400)

                cart_items = list(cart.items.select_related('book').all())
                if not cart_items:
                    return Response({'detail': "Savat bo'sh."}, status=400)

                # 2. Lock Book rows to prevent concurrent race conditions.
                #    order_by('pk') prevents deadlocks when multiple transactions
                #    lock the same books in different order.
                book_ids = [ci.book_id for ci in cart_items]
                books = {
                    b.pk: b
                    for b in Book.objects.select_for_update().filter(pk__in=book_ids).order_by('pk')
                }

                # 3. Check stock using locked book instances (not stale ci.book)
                for ci in cart_items:
                    book = books[ci.book_id]
                    if not book.in_stock or book.stock_quantity <= 0:
                        return Response(
                            {'detail': f'"{book.title}" omborda mavjud emas.'},
                            status=400,
                        )
                    if book.stock_quantity < ci.quantity:
                        return Response(
                            {'detail': f'"{book.title}" uchun omborda yetarli zaxira yo\'q (qoldiq: {book.stock_quantity} ta).'},
                            status=400,
                        )

                # 4. Server-side price calculation using locked book prices
                subtotal = sum(books[ci.book_id].price * ci.quantity for ci in cart_items)

                # 5. Promo
                discount = Decimal('0')
                promo_code_str = data.get('promo_code', '').strip().upper()
                applied_promo = None
                if promo_code_str:
                    # 5a. 1 foydalanuvchi - 1 marta cheklovi (bekor qilingan buyurtmalar bundan mustasno)
                    if Order.objects.filter(
                        user=request.user,
                        promo_code=promo_code_str,
                    ).exclude(status='cancelled').exists():
                        return Response(
                            {'detail': 'Siz ushbu promo-koddan allaqachon foydalangansiz.'},
                            status=400,
                        )

                    try:
                        promo = PromoCode.objects.select_for_update().get(code=promo_code_str)
                        if promo.is_valid() and subtotal >= promo.min_order:
                            applied_promo = promo
                            if promo.type == 'percent':
                                discount = (subtotal * promo.value / 100).quantize(Decimal('1'))
                            PromoCode.objects.filter(pk=promo.pk).update(
                                used_count=F('used_count') + 1
                            )
                    except PromoCode.DoesNotExist:
                        pass  # invalid promo silently ignored during order

                # 6. Delivery cost
                delivery_id = data.get('delivery_option_id', 1)
                delivery_cost = DELIVERY_PRICES.get(delivery_id, Decimal('15000'))

                # Free shipping promo (use already-fetched promo, no second query)
                if applied_promo and applied_promo.type == 'freeShipping':
                    delivery_cost = Decimal('0')

                total = max(Decimal('0'), subtotal - discount + delivery_cost)

                # 7. Create order
                order = Order.objects.create(
                    user=request.user,
                    subtotal=subtotal,
                    discount=discount,
                    delivery_cost=delivery_cost,
                    total=total,
                    promo_code=promo_code_str,
                    address_snapshot=data.get('address', {}),
                    payment_method=data.get('payment_method', ''),
                )

                # 8. Create order items + update sold and stock counts atomically
                for ci in cart_items:
                    book = books[ci.book_id]
                    OrderItem.objects.create(
                        order=order,
                        book=book,
                        title=book.title,
                        price=book.price,
                        quantity=ci.quantity,
                        image=book.image,
                    )
                    # F() generates SQL: UPDATE ... SET sold = sold + N, stock_quantity = stock_quantity - N
                    # This is atomic — prevents overselling and race conditions.
                    Book.objects.filter(pk=book.pk).update(
                        sold=F('sold') + ci.quantity,
                        stock_quantity=F('stock_quantity') - ci.quantity,
                    )
                    # Auto-toggle in_stock to False if stock reaches 0
                    Book.objects.filter(pk=book.pk, stock_quantity__lte=0).update(in_stock=False)

                # 9. Clear cart
                cart.items.all().delete()
        except IntegrityError:
            # Ikki parallel so'rov bir vaqtda kelsa, DB darajasidagi UniqueConstraint
            # (unique_active_user_promo_code) IntegrityError qaytaradi.
            return Response(
                {'detail': 'Siz ushbu promo-koddan allaqachon foydalangansiz.'},
                status=400,
            )

        # Reload order with items for response
        order = Order.objects.prefetch_related('items', 'items__book').get(pk=order.pk)
        return Response(OrderSerializer(order).data, status=201)
