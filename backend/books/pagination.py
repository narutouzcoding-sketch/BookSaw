from rest_framework.pagination import PageNumberPagination


class FlexiblePageNumberPagination(PageNumberPagination):
    """Supports frontend's 'pageSize' query param."""
    page_size = 20
    page_size_query_param = 'pageSize'
    max_page_size = 100
