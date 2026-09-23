from django.conf import settings
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from django.utils.text import slugify


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    image = models.URLField(blank=True, default='')

    class Meta:
        verbose_name_plural = 'categories'
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
            # handle duplicates
            original = self.slug
            counter = 1
            while Category.objects.filter(slug=self.slug).exclude(pk=self.pk).exists():
                self.slug = f'{original}-{counter}'
                counter += 1
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Author(models.Model):
    name = models.CharField(max_length=200)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class Book(models.Model):
    """Book model — price/old_price stored, discount & rating computed."""
    title = models.CharField(max_length=255)
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='books')
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='books'
    )
    description = models.TextField(blank=True, default='')
    image = models.URLField(blank=True, default='')
    image2 = models.URLField(blank=True, default='')
    price = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    old_price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    # discount is computed: round((1 - price/old_price) * 100)
    # rating is computed from Review avg
    # review_count is computed from Review count
    in_stock = models.BooleanField(default=True)
    stock_quantity = models.PositiveIntegerField(default=10)
    badge = models.CharField(max_length=20, blank=True, default='')  # new, sale, bestseller
    published_year = models.PositiveIntegerField(null=True, blank=True)
    pages = models.PositiveIntegerField(default=0)
    isbn = models.CharField(max_length=30, blank=True, default='')
    publisher = models.CharField(max_length=100, blank=True, default='')
    language = models.CharField(max_length=50, blank=True, default='')
    sold = models.PositiveIntegerField(default=0)
    store_id = models.PositiveIntegerField(default=1)
    features = models.JSONField(default=list, blank=True)
    variants = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    @property
    def discount(self):
        if self.old_price and self.old_price > self.price and self.old_price > 0:
            return round((1 - float(self.price) / float(self.old_price)) * 100)
        return 0


class Review(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews'
    )
    rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    text = models.TextField()
    helpful = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ['book', 'user']

    def __str__(self):
        return f'Review by {self.user} on {self.book}'


class Question(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='questions')
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='questions'
    )
    text = models.TextField()
    answer = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Q by {self.user} on {self.book}'


class PromoCode(models.Model):
    TYPE_CHOICES = [
        ('percent', 'Percent'),
        ('freeShipping', 'Free Shipping'),
    ]
    code = models.CharField(max_length=30, unique=True)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    value = models.PositiveIntegerField(default=0)
    min_order = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    active = models.BooleanField(default=True)
    valid_until = models.DateTimeField(null=True, blank=True)
    usage_limit = models.PositiveIntegerField(default=0)  # 0 = unlimited
    used_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.code

    def is_valid(self):
        if not self.active:
            return False
        if self.valid_until and self.valid_until < timezone.now():
            return False
        if self.usage_limit > 0 and self.used_count >= self.usage_limit:
            return False
        return True


class Cart(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, null=True, blank=True,
        on_delete=models.CASCADE, related_name='cart'
    )
    session_key = models.CharField(max_length=40, blank=True, default='', db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        if self.user:
            return f'Cart of {self.user}'
        return f'Anonymous cart ({self.session_key[:8]}...)'


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(
        default=1, validators=[MinValueValidator(1), MaxValueValidator(10)]
    )
    variant = models.CharField(max_length=100, blank=True, default='')

    class Meta:
        unique_together = ['cart', 'book']

    def __str__(self):
        return f'{self.quantity}x {self.book}'


class WishlistItem(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True,
        on_delete=models.CASCADE, related_name='wishlist_items'
    )
    session_key = models.CharField(max_length=40, blank=True, default='', db_index=True)
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='wishlisted_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        owner = self.user or f'session:{self.session_key[:8]}'
        return f'{owner} ♥ {self.book}'


class Order(models.Model):
    STATUS_CHOICES = [
        ('processing', 'Processing'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders'
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='processing')
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    discount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    delivery_cost = models.DecimalField(max_digits=12, decimal_places=2, default=15000)
    total = models.DecimalField(max_digits=12, decimal_places=2)
    promo_code = models.CharField(max_length=30, blank=True, default='')
    address_snapshot = models.JSONField(default=dict)
    payment_method = models.CharField(max_length=50, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Order #{self.pk} by {self.user}'


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    book = models.ForeignKey(Book, on_delete=models.SET_NULL, null=True)
    title = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    image = models.URLField(blank=True, default='')

    def __str__(self):
        return f'{self.quantity}x {self.title}'