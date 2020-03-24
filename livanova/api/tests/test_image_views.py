from django.test import TestCase
from rest_framework.utils import json
from rest_framework import status
from io import BytesIO
from PIL import Image as MockImage

from django.contrib.auth.models import User

from api.serializers import ImageSerializer
from api.models import Image
from django.core.files import File
from django.core.files.uploadedfile import SimpleUploadedFile


def create_test_image():
    file = BytesIO()
    image = MockImage.new("RGB", size=(50, 50), color=(155, 0, 0))
    image.save(file, "JPEG")
    file.name = "test.png"
    file.seek(0)
    return file


class ImageViewTest(TestCase):
    def setUp(self):
        self.user_data = {
            "username": "marvel",
            "first_name": "black",
            "last_name": "panther",
        }
        user_instance = User(**self.user_data)
        user_instance.set_password("gamora")
        user_instance.save()
        image_instance = Image()
        image_instance.user = user_instance
        image_instance.image = File(create_test_image())
        image_instance.name = "test"
        image_instance.color = "BLACK"
        image_instance.save()

    def login(self) -> bool:
        user_login = self.client.login(
            username=self.user_data["username"], password="gamora"
        )
        return user_login

    def test_create_valid_image(self):
        user_login = self.login()
        self.assertTrue(user_login)
        file = create_test_image()
        data = {
            "image": file,
            "name": "name",
            "color": "BLACK",
        }

        response = self.client.post("/api/images/", data=data, format="multipart",)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_invalid_image(self):
        user_login = self.login()
        self.assertTrue(user_login)
        data = {
            "image": "invalid/file",
            "name": "name",
            "color": "BLACK",
        }
        response = self.client.post("/api/images/", data=data, format="multipart",)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_image_list(self):
        user_login = self.login()
        self.assertTrue(user_login)
        response = self.client.get("/api/images/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_image_detailed(self):
        user_login = self.login()
        self.assertTrue(user_login)
        response = self.client.get("/api/images/1/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_invalid_image_detailed(self):
        user_login = self.login()
        self.assertTrue(user_login)
        response = self.client.get("/api/images/6/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_image(self):
        user_login = self.login()
        self.assertTrue(user_login)
        updated_image = {
            "name": "updated",
            "color": "WHITE",
        }
        response = self.client.put(
            "/api/images/1/",
            data=json.dumps(updated_image),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_invalid_data(self):
        user_login = self.login()
        self.assertTrue(user_login)
        invalid_data = {
            "name": "invalid",
            "color": "FGFG",
        }
        response = self.client.put(
            "/api/images/1/",
            data=json.dumps(invalid_data),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_image(self):
        user_login = self.login()
        self.assertTrue(user_login)
        response = self.client.delete("/api/images/1/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
