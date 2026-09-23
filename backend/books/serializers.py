from decimal import Decimal
from rest_framework import serializers
from .models import (
    Author, Book, CartItem, Cart, Category, Order, OrderItem,
    PromoCode, Question, Review, WishlistItem,
)


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['id', 'name']


class CategorySerializer(serializers.ModelSerializer):
    products_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'image', 'products_count']


class BookListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for book lists. Frontend normalizeProduct() compatible."""
    author_name = serializers.CharField(source='author.name', read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(source='category', read_only=True)
    category_name = serializers.SerializerMethodField()
    discount = serializers.IntegerField(read_only=True)  # property on model
    rating = serializers.DecimalField(max_digits=3, decimal_places=1, read_only=True)
    review_count = serializers.IntegerField(read_only=True)
    # price fields: DRF DecimalField returns strings by default

    class Meta:
        model = Book
        fields = [
            'id', 'title', 'author_name', 'category_id', 'category_name',
            'price', 'old_price', 'discount', 'rating', 'review_count',
            'in_stock', 'stock_quantity', 'badge', 'image', 'image2', 'description',
            'pages', 'isbn', 'publisher', 'language', 'published_year',
            'sold', 'store_id', 'features', 'variants', 'created_at',
        ]

    def get_category_name(self, obj) -> str:
        return obj.category.name if obj.category else ''


class BookDetailSerializer(BookListSerializer):
    """Full detail serializer — same fields, but used for retrieve."""
    pass


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    product_id = serializers.IntegerField(source='book_id', read_only=True)

    class Meta:
        model = Review
        fields = [
            'id', 'product_id', 'user_name', 'rating', 'text',
            'helpful', 'created_at',
        ]
        read_only_fields = ['id', 'product_id', 'user_name', 'helpful', 'created_at']


class QuestionSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    product_id = serializers.IntegerField(source='book_id', read_only=True)

    class Meta:
        model = Question
        fields = [
            'id', 'product_id', 'user_name', 'text', 'answer', 'created_at',
        ]
        read_only_fields = ['id', 'product_id', 'user_name', 'answer', 'created_at']


# ---- Cart ----

class CartItemBookSerializer(serializers.ModelSerializer):
    """Minimal book info for cart display."""
    author_name = serializers.CharField(source='author.name', read_only=True)

    class Meta:
        model = Book
        fields = ['id', 'title', 'author_name', 'price', 'image', 'in_stock']


class CartItemSerializer(serializers.ModelSerializer):
    book_detail = CartItemBookSerializer(source='book', read_only=True)
    book_id = serializers.PrimaryKeyRelatedField(
        queryset=Book.objects.all(), source='book', write_only=True
    )
    line_total = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'book_id', 'book_detail', 'quantity', 'variant', 'line_total']
        read_only_fields = ['id', 'line_total']

    def get_line_total(self, obj) -> str:
        return str(obj.book.price * obj.quantity)


class CartSerializer(serializers.Serializer):
    """Read-only cart representation with server-calculated totals."""
    items = CartItemSerializer(many=True, read_only=True)
    subtotal = serializers.SerializerMethodField()
    item_count = serializers.SerializerMethodField()

    def get_subtotal(self, cart) -> str:
        return str(sum(item.book.price * item.quantity for item in cart.items.all()))

    def get_item_count(self, cart) -> int:
        return sum(item.quantity for item in cart.items.all())


class CartAddSerializer(serializers.Serializer):
    book_id = serializers.IntegerField()
    quantity = serializers.IntegerField(default=1, min_value=1, max_value=10)
    variant = serializers.CharField(required=False, allow_blank=True, default='')


class CartUpdateSerializer(serializers.Serializer):
    book_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, max_value=10)


class CartDeleteSerializer(serializers.Serializer):
    book_id = serializers.IntegerField(required=False)
    clear = serializers.BooleanField(required=False, default=False)


# ---- Wishlist ----

class WishlistAddSerializer(serializers.Serializer):
    book_id = serializers.IntegerField()


class WishlistItemSerializer(serializers.ModelSerializer):
    book_detail = CartItemBookSerializer(source='book', read_only=True)
    book_id = serializers.PrimaryKeyRelatedField(
        queryset=Book.objects.all(), source='book', write_only=True
    )

    class Meta:
        model = WishlistItem
        fields = ['id', 'book_id', 'book_detail', 'created_at']
        read_only_fields = ['id', 'created_at']


# ---- Promo ----

class PromoValidateSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=30)
    subtotal = serializers.DecimalField(max_digits=12, decimal_places=2)


class PromoResultSerializer(serializers.Serializer):
    code = serializers.CharField()
    type = serializers.CharField()
    value = serializers.IntegerField()
    discount_amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    min_order = serializers.DecimalField(max_digits=12, decimal_places=2)


# ---- Orders ----

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'book_id', 'title', 'price', 'quantity', 'image']
        read_only_fields = fields


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'status', 'subtotal', 'discount', 'delivery_cost',
            'total', 'promo_code', 'address_snapshot', 'payment_method',
            'items', 'created_at',
        ]
        read_only_fields = fields


class OrderCreateSerializer(serializers.Serializer):
    """Input for creating order from cart. Prices recalculated server-side."""
    promo_code = serializers.CharField(required=False, allow_blank=True, default='')
    address = serializers.JSONField(required=False, default=dict)
    delivery_option_id = serializers.IntegerField(required=False, default=None)
    delivery = serializers.JSONField(required=False, default=dict)
    payment_method = serializers.CharField(required=False, default='')
    payment = serializers.JSONField(required=False, default=dict)