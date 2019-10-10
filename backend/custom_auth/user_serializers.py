"""
    Author: Lior Pollak
    Description: Serializers for the custom_auth app
    Date: 13/09/2019
"""
from rest_framework import serializers

from custom_auth.mador_serializers import MadorSerializer
from custom_auth.models import User
from forum.models import Forum


class ForumForUserSerializer(serializers.ModelSerializer):
    users = serializers.SlugRelatedField(many=True, read_only=True, slug_field='username')

    class Meta:
        model = Forum
        fields = ['id', 'date', 'notes', 'users']


class UserSerializer(serializers.ModelSerializer):
    forum_count = serializers.SerializerMethodField(read_only=True)
    forums = ForumForUserSerializer(many=True)
    mador = MadorSerializer()

    class Meta:
        model = User
        fields = ['id', 'username', 'name', 'forum_count', 'forums', 'mador']

    def get_forum_count(self, user):
        return user.forums.count()

