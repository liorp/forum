"""
    Author: Lior Pollak
    Description: Serializers for the forum app
    Date: 13/09/2019
"""
from rest_framework import serializers
from backend.forum.models import Forum


class ForumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Forum
        fields = ['id', 'date', 'notes', 'users']
