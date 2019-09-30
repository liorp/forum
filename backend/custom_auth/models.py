"""
    Author: Lior Pollak
    Description: Models for custom_auth app
    Date: 13.09.2019
"""
from django.db import models
from django.contrib.auth.models import AbstractUser, Permission


class Mador(models.Model):
    SUNDAY = '0'
    MONDAY = '1'
    TUESDAY = '2'
    WEDNESDAY = '3'
    THURSDAY = '4'
    FRIDAY = '5'
    DAYS = (
        (SUNDAY, 'Sunday'),
        (MONDAY, 'Monday'),
        (TUESDAY, 'Tuesday'),
        (WEDNESDAY, 'Wednesday'),
        (THURSDAY, 'Thursday'),
        (FRIDAY, 'Friday'),
    )
    forum_day = models.CharField(max_length=2, choices=DAYS, default=THURSDAY)
    name = models.CharField()
    forum_frequency = models.IntegerField()
    number_of_organizers = models.IntegerField()


class User(AbstractUser):
    mador = models.OneToOneField(Mador, models.deletion.SET_NULL, related_name="users")


class Permission(Permission):
    admin_of_mador = models.BooleanField(default=False)
