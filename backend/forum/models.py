"""
    Author: Lior Pollak
    Description: Models for the forum app
    Date: 13/09/2019
"""
from django.db import models
from custom_auth.models import User, Mador


class Forum(models.Model):
    date = models.DateField()
    notes = models.TextField(null=True, default='')
    users = models.ManyToManyField(User, related_name='forums')
    mador = models.ForeignKey(Mador, on_delete=models.deletion.CASCADE, related_name='forums')
    budget = models.IntegerField(default=0)

    class Meta:
        ordering = ['-date']
        get_latest_by = '-date'
