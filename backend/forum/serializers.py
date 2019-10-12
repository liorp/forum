"""
    Author: Lior Pollak
    Description: Serializers for the forum app
    Date: 13/09/2019
"""
from rest_framework import serializers
from rest_framework.relations import PrimaryKeyRelatedField

from custom_auth.models import User
from custom_auth.user_serializers import UserSerializer
from forum.models import Forum


class ForumSerializer(serializers.ModelSerializer):
    users = UserSerializer(many=True, read_only=True)
    # Hacks for writing foreign key to drf
    # (https://stackoverflow.com/questions/29950956/drf-simple-foreign-key-assignment-with-nested-serializers)
    users_id = PrimaryKeyRelatedField(many=True, write_only=True, source='users', queryset=User.objects.all())

    class Meta:
        model = Forum
        fields = ['id', 'date', 'notes', 'users', 'budget', 'users_id']

    def create(self, validated_data):
        return Forum.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.date = validated_data.get('date', instance.date)
        instance.notes = validated_data.get('notes', instance.notes)
        instance.notes = validated_data.get('budget', instance.budget)
        instance.users.set(validated_data.get('users', instance.users.all()))
        instance.save()
        return instance
