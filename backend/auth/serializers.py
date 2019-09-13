"""
    Author: Lior Pollak
    Description: Serializers for the auth app
    Date: 13/09/2019
"""
from rest_framework import serializers
from backend.auth.models import Mador, User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'name']


class MadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mador
        fields = ['id', 'name', 'users']
