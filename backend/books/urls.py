from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    BookViewSet, CartView, CategoryViewSet, OrderListCreateView,
    PromoValidateView, QuestionListCreateView, ReviewListCreateView,
    WishlistView,
)

router = DefaultRouter()
router.register('books', BookViewSet, basename='book')
router.register('products', BookViewSet, basename='product')
router.register('categories', CategoryViewSet, basename='category')

urlpatterns = [
    path('', include(router.urls)),
    # Reviews
    path('books/<int:book_id>/reviews/', ReviewListCreateView.as_view(), name='book-reviews'),
    path('books/<int:book_id>/reviews', ReviewListCreateView.as_view()),
    path('products/<int:book_id>/reviews/', ReviewListCreateView.as_view(), name='product-reviews'),
    path('products/<int:book_id>/reviews', ReviewListCreateView.as_view()),
    # Questions
    path('books/<int:book_id>/questions/', QuestionListCreateView.as_view(), name='book-questions'),
    path('books/<int:book_id>/questions', QuestionListCreateView.as_view()),
    path('products/<int:book_id>/questions/', QuestionListCreateView.as_view(), name='product-questions'),
    path('products/<int:book_id>/questions', QuestionListCreateView.as_view()),
    # Cart
    path('cart/', CartView.as_view(), name='cart'),
    path('cart', CartView.as_view()),
    # Wishlist
    path('wishlist/', WishlistView.as_view(), name='wishlist'),
    path('wishlist', WishlistView.as_view()),
    # Promo
    path('promo/validate/', PromoValidateView.as_view(), name='promo-validate'),
    path('promo/validate', PromoValidateView.as_view()),
    # Orders & Checkout
    path('orders/', OrderListCreateView.as_view(), name='orders'),
    path('orders', OrderListCreateView.as_view()),
    path('checkout/', OrderListCreateView.as_view(), name='checkout'),
    path('checkout', OrderListCreateView.as_view()),
]