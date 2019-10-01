"""
    Author: Lior Pollak
    Description: Serializers for the custom_auth app
    Date: 13/09/2019
"""
from rest_framework import serializers

from custom_auth.mador_serializers import MadorSerializer
from custom_auth.models import Mador, User


class UserSerializer(serializers.ModelSerializer):
    forum_count = serializers.SerializerMethodField(read_only=True)
    mador = MadorSerializer()

    class Meta:
        model = User
        fields = ['id', 'username', 'name', 'forum_count', 'mador']

    def get_forum_count(self, user):
        return user.forums.count()

