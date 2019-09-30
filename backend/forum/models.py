"""
    Author: Lior Pollak
    Description: Models for the forum app
    Date: 13/09/2019
"""
from django.db import models


# Create your models here.
from custom_auth.models import User


class Forum(models.Model):
    date = models.DateField()
    notes = models.TextField(null=True)
    users = models.ManyToManyField(User, related_name='forums')
