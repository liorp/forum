"""
    Author: Lior Pollak
    Description: Serializers for the custom_auth app
    Date: 01/10/2019
"""
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.relations import PrimaryKeyRelatedField

from custom_auth.models import Mador, User


class UserForMadorSerializer(serializers.ModelSerializer):
    forum_count = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'name', 'forum_count']

    def get_forum_count(self, user):
        return user.forums.count()


class MadorSerializer(serializers.ModelSerializer):
    users = UserForMadorSerializer(many=True, read_only=True)
    admin = UserForMadorSerializer(read_only=True)
    # Hacks for writing foreign key to drf
    # (https://stackoverflow.com/questions/29950956/drf-simple-foreign-key-assignment-with-nested-serializers)
    users_id = PrimaryKeyRelatedField(many=True, write_only=True, source='users', queryset=User.objects.all())
    admin_id = PrimaryKeyRelatedField(write_only=True, source='admin', queryset=User.objects.all())

    class Meta:
        model = Mador
        fields = ['id', 'name', 'users', 'forum_frequency', 'forum_day', 'admin',
                  'number_of_organizers', 'total_budget', 'default_budget_per_forum', 'auto_track_forum_budget',
                  'users_id', 'admin_id']

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
        instance.total_budget = int(validated_data.get('total_budget', instance.total_budget))
        if instance.total_budget < 0:
            raise ValidationError("Mador total budget must be larger than 0!")
        instance.default_budget_per_forum = int(validated_data.get('default_budget_per_forum',
                                                                   instance.default_budget_per_forum))
        if instance.default_budget_per_forum < 0:
            raise ValidationError("Mador default budget per forum must be larger than 0!")
        instance.auto_track_forum_budget = bool(validated_data.get('auto_track_forum_budget',
                                                                   instance.auto_track_forum_budget))
        instance.save()
        return instance
