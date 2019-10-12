"""
    Author: Lior Pollak
    Description: Serializers for the custom_auth app
    Date: 01/10/2019
"""
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

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
    admin = UserForMadorSerializer()
    forum_day = serializers.IntegerField()

    class Meta:
        model = Mador
        fields = ['id', 'name', 'users', 'forum_frequency', 'forum_day', 'admin', 'number_of_organizers', 'budget']

    def create(self, validated_data):
        return Mador.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.forum_frequency = int(validated_data.get('forum_frequency', instance.forum_frequency))
        if instance.forum_frequency < 1:
            raise ValidationError("Forum frequency must be larger than 1!")
        instance.forum_day = validated_data.get('forum_day', instance.forum_day)
        if instance.forum_day < 0 or instance.forum_day > 6:
            raise ValidationError("Forum day must be a weekday!")
        instance.number_of_organizers = validated_data.get('number_of_organizers', instance.number_of_organizers)
        if instance.number_of_organizers < 1:
            raise ValidationError("Forum organizers must exist!")
        instance.save()
        return instance
