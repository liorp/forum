"""
    Author: Lior Pollak
    Description: Models for custom_auth app
    Date: 13.09.2019
"""
from django.db import models
from django.contrib.auth.models import AbstractUser, Permission


class Mador(models.Model):
    SUNDAY = 0
    MONDAY = 1
    TUESDAY = 2
    WEDNESDAY = 3
    THURSDAY = 4
    FRIDAY = 5
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
    forum_frequency = models.IntegerField(default=1)
    number_of_organizers = models.IntegerField(default=2)
    total_budget = models.IntegerField(default=0)
    default_budget_per_forum = models.IntegerField(default=0)
    auto_track_forum_budget = models.BooleanField(default=True)


class User(AbstractUser):
    mador = models.ForeignKey(Mador, models.deletion.SET_NULL, related_name='users', null=True)
    administered_mador = models.ForeignKey(Mador, models.deletion.SET_NULL, related_name='admins', null=True)
    name = models.CharField(max_length=180, null=True)

    class Meta:
        ordering = ["username"]

    @property
    def is_admin_of_mador(self):
        return self.administered_mador_id is not None
