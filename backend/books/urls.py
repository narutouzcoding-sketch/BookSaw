from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    BookViewSet, CartView, CategoryViewSet, OrderListCreateView,
    PromoValidateView, QuestionListCreateView, ReviewListCreateView,
    WishlistView,
)

router = DefaultRouter()
router.register('books', BookViewSet, basename='book')
router.register('categories', CategoryViewSet, basename='category')

urlpatterns = [
    path('', include(router.urls)),
    path('books/<int:book_id>/reviews/', ReviewListCreateView.as_view(), name='book-reviews'),
    path('books/<int:book_id>/questions/', QuestionListCreateView.as_view(), name='book-questions'),
    path('cart/', CartView.as_view(), name='cart'),
    path('wishlist/', WishlistView.as_view(), name='wishlist'),
    path('promo/validate/', PromoValidateView.as_view(), name='promo-validate'),
    path('orders/', OrderListCreateView.as_view(), name='orders'),
]