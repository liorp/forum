"""
    Author: Lior Pollak
    Description: Models for auth app
    Date: 13.09.2019
"""
from django.db import models
from django.contrib.auth.models import AbstractUser


class Mador(models.Model):
    name = models.CharField()


class User(AbstractUser):
    mador = models.OneToOneField(Mador, models.deletion.SET_NULL, related_name="users")
