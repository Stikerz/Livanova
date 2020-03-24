from django.shortcuts import render
from rest_framework import filters
from rest_framework.parsers import MultiPartParser
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response

from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.permissions import IsAuthenticated

from api.models import Image
from api.serializers import UserSerializer, ImageSerializer
from django.contrib.auth.models import User


class UserAPIView(ListCreateAPIView):
    """view for listing a queryset or creating a model instance."""

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = []


class UserDetailView(RetrieveUpdateDestroyAPIView):
    """view for retrieving, updating or deleting a model instance."""

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


class ImageAPIView(ListCreateAPIView):
    """view for listing a queryset or creating a model instance."""

    serializer_class = ImageSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ["color"]
    parser_classes = [MultiPartParser]

    def get_queryset(self):
        queryset = Image.objects.all().filter(user=self.request.user)
        return queryset


class ImageDetailView(RetrieveUpdateDestroyAPIView):
    """view for retrieving, updating or deleting a model instance."""

    queryset = Image.objects.all()
    serializer_class = ImageSerializer
    permission_classes = [IsAuthenticated]


class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        token, created = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "user_id": user.pk,})
