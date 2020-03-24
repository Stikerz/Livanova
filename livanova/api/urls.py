from django.urls import path

from api.views import UserAPIView, UserDetailView, ImageAPIView, ImageDetailView

urlpatterns = [
    path("users/", UserAPIView.as_view(), name="user_list"),
    path("users/<int:pk>/", UserDetailView.as_view(), name="user_detail"),
    path("images/", ImageAPIView.as_view(), name="image_list"),
    path("images/<int:pk>/", ImageDetailView.as_view(), name="image_detail"),
]
