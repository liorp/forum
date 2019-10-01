"""
    Author: Lior Pollak
    Description: Models for the forum app
    Date: 13/09/2019
"""
from django.db import models
from custom_auth.models import User, Mador


class Forum(models.Model):
    date = models.DateField()
    notes = models.TextField(null=True)
    users = models.ManyToManyField(User, related_name='forums')
    mador = models.OneToOneField(Mador, models.deletion.SET_NULL, related_name='forums', null=True)
