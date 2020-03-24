from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from rest_framework.fields import CurrentUserDefault

from api.models import Image
from django.contrib.auth.models import User


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        extra_kwargs = {
            "password": {"write_only": True, "required": False},
            "username": {"required": False},
        }
        fields = ["username", "first_name", "last_name", "password"]


    def create(self, validated_data):
        password = validated_data.pop("password")
        user_instance = User(**validated_data)
        user_instance.set_password(password)
        user_instance.save()
        return user_instance

    def update(self, instance, validated_data):
        if "password" in validated_data:
            password = validated_data.pop("password")
            instance.set_password(password)
        instance.first_name = validated_data["first_name"]
        instance.last_name = validated_data["last_name"]
        instance.save()
        return instance


class ImageSerializer(ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        read_only=True, default=CurrentUserDefault()
    )

    class Meta:
        model = Image
        fields = ["id", "user", "image", "name", "color"]
        extra_kwargs = {
            "image": {"required": False},
            "name": {"required": True},
            "color": {"required": True},
        }

    def create(self, validated_data):
        user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user = request.user
        image_instance = Image(**validated_data)
        image_instance.user = user
        image_instance.save()
        return image_instance

    def update(self, instance, validated_data):
        instance.name = validated_data["name"]
        instance.color = validated_data["color"]
        instance.save()
        return instance
