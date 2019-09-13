"""
    Author: Lior Pollak
    Description: Models for the forum app
    Date: 13/09/2019
"""
from django.db import models


# Create your models here.
from backend.auth.models import User


class Forum(models.Model):
    date = models.DateField()
    notes = models.TextField()
    users = models.ManyToManyField(User)
