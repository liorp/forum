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
    forum_day = models.IntegerField(choices=DAYS, default=THURSDAY)
    name = models.CharField(max_length=50)
    forum_frequency = models.IntegerField()
    number_of_organizers = models.IntegerField()
    admin = models.OneToOneField('custom_auth.User',
                                 models.deletion.SET_NULL,
                                 related_name='administered_forum',
                                 null=True)
    budget = models.IntegerField(default=0)


class User(AbstractUser):
    mador = models.ForeignKey(Mador, models.deletion.SET_NULL, related_name='users', null=True)
    name = models.CharField(max_length=180, null=True)

    class Meta:
        ordering = ["username"]

    @property
    def is_admin_of_mador(self):
        return hasattr(self, 'administered_forum')
