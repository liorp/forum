"""
    Author: Lior Pollak
    Description: Views for the forum app
    Date: 13/09/2019
"""
from datetime import datetime, timedelta

from django.db.models import Count
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from custom_auth.models import Mador, User
from forum.models import Forum
from forum.serializers import ForumSerializer


class ForumViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows forums to be viewed or edited.
    """
    queryset = Forum.objects.all()
    serializer_class = ForumSerializer

    def create(self, request, *args, **kwargs):
        month = request.query_params['month']
        year = request.query_params['year']
        mador = Mador.objects.get(id=request.query_params['mador'])
        try:
            forums_created = self.create_forums(mador, month, year)
            return Response(data={'forums': [ForumSerializer(forum).data for forum in forums_created]},
                            status=status.HTTP_201_CREATED)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def create_forums(self, mador, month, year):
        first_day_of_month = datetime(day=1, month=month, year=year)
        current_day = first_day_of_month
        forum_days = self._get_forum_days(current_day, mador, month)
        return self._create_forum(forum_days, mador)

    @staticmethod
    def _create_forum(forum_days, mador):
        forums = []
        for day in forum_days:
            users = User.objects.all().annotate(forum_count=Count('forums')).order_by('forum_count')
            forum_users = users[:mador.number_of_organizers]
            forums += Forum.objects.create(users=forum_users, date=day)
        return forums

    @staticmethod
    def _get_forum_days(current_day, mador, month):
        forum_days = []
        days_increment = 1
        while current_day.month == month:
            if current_day.weekday() == mador.forum_day:
                forum_days += current_day
                if days_increment == 1:
                    # Speed up the search for forum days
                    days_increment = mador.forum_frequency * 7
            current_day += timedelta(days=days_increment)
        return forum_days
