from django.test import TestCase
from rest_framework.utils import json
from rest_framework import status

from django.contrib.auth.models import User

from api.serializers import UserSerializer


class UserViewTest(TestCase):
    def setUp(self):
        self.user_data = {
            "username": "marvel",
            "first_name": "black",
            "last_name": "panther",
        }
        user_instance = User(**self.user_data)
        user_instance.set_password("gamora")
        user_instance.save()

    def login(self) -> bool:
        user_login = self.client.login(
            username=self.user_data["username"], password="gamora"
        )
        return user_login

    def test_create_valid_user(self):
        user_login = self.login()
        self.assertTrue(user_login)
        new_user_data = {
            "username": "teacher3",
            "password": "lolll",
            "first_name": "three",
            "last_name": "three",
            "email": "three@tivix.com",
        }
        response = self.client.post(
            "/api/users/",
            data=json.dumps(new_user_data),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_invalid_user(self):
        user_login = self.login()
        self.assertTrue(user_login)
        invalid_user = {
            "username": "",
            "password": "",
            "first_name": "",
            "last_name": "",
            "email": "",
        }
        response = self.client.post(
            "/api/users/",
            data=json.dumps(invalid_user),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_user_list(self):
        user_login = self.login()
        self.assertTrue(user_login)
        response = self.client.get("/api/users/")
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_user_detailed(self):
        user_login = self.login()
        self.assertTrue(user_login)
        response = self.client.get("/api/users/1/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_invalid_user_detailed(self):
        user_login = self.login()
        self.assertTrue(user_login)
        response = self.client.get("/api/users/6/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_user(self):
        user_login = self.login()
        self.assertTrue(user_login)
        updated_user = {
            "username": "teacher3",
            "password": "lolll",
            "first_name": "three",
            "last_name": "three",
            "email": "three@tivix.com",
        }
        response = self.client.put(
            "/api/users/1/",
            data=json.dumps(updated_user),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_invalid_data(self):
        user_login = self.login()
        self.assertTrue(user_login)
        invalid_user = {
            "username": "",
            "password": "",
            "first_name": "",
            "last_name": "",
            "email": "",
        }
        response = self.client.put(
            "/api/users/1/",
            data=json.dumps(invalid_user),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_teacher(self):
        user_login = self.login()
        self.assertTrue(user_login)
        response = self.client.delete("/api/users/1/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
