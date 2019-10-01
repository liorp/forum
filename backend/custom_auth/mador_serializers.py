"""
    Author: Lior Pollak
    Description: Serializers for the custom_auth app
    Date: 01/10/2019
"""
from rest_framework import serializers
from custom_auth.models import Mador, User


class UserForMadorSerializer(serializers.ModelSerializer):
    forum_count = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'name', 'forum_count']

    def get_forum_count(self, user):
        return user.forums.count()


class MadorSerializer(serializers.ModelSerializer):
    users = UserForMadorSerializer(many=True)

    class Meta:
        model = Mador
        fields = ['id', 'name', 'users', 'forum_frequency', 'forum_day']

    def create(self, validated_data):
        return Mador.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.date)
        instance.users = validated_data.get('users', instance.date)
        instance.forum_frequency = validated_data.get('forum_frequency', instance.notes)
        instance.forum_day = validated_data.get('forum_day', instance.users)
        instance.save()
        return instance
