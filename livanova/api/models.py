from django.db import models
from django.contrib.auth.models import User
from django.dispatch import receiver
import os


class Image(models.Model):
    class Color(models.TextChoices):

        BLACK = "BLACK"
        RED = "RED"
        GREEN = "GREEN"
        YELLOW = "YELLOW"
        BLUE = "BLUE"
        BABY_BLUE = "BABY_BLUE"
        DARK_GREY = "DARK_GREY"
        LIGHT_GREY = "LIGHT_GREY"

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField()
    name = models.CharField(max_length=250)
    color = models.CharField(max_length=250, choices=Color.choices, default=Color.BLACK)

    def __str__(self):
        return self.name


@receiver(models.signals.post_delete, sender=Image)
def auto_delete_file_on_delete(sender, instance, **kwargs):
    """
    Deletes file from filesystem
    when corresponding `MediaFile` object is deleted.
    """
    if instance.image:
        if os.path.isfile(instance.image.path):
            os.remove(instance.image.path)


@receiver(models.signals.pre_save, sender=Image)
def auto_delete_file_on_change(sender, instance, **kwargs):
    """
    Deletes old file from filesystem
    when corresponding `MediaFile` object is updated
    with new file.
    """
    if not instance.pk:
        return False

    try:
        old_file = sender.objects.get(pk=instance.pk).image
    except sender.DoesNotExist:
        return False

    new_file = instance.image
    if not old_file == new_file:
        if os.path.isfile(old_file.path):
            os.remove(old_file.path)
