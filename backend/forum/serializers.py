"""
    Author: Lior Pollak
    Description: Serializers for the forum app
    Date: 13/09/2019
"""
from rest_framework import serializers
from forum.models import Forum


class ForumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Forum
        fields = ['id', 'date', 'notes', 'users']

    def create(self, validated_data):
        return Forum.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.date = validated_data.get('date', instance.date)
        instance.notes = validated_data.get('notes', instance.notes)
        instance.users = validated_data.get('users', instance.users)
        instance.save()
        return instance
