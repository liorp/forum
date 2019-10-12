"""
    Author: Lior Pollak
    Description: Views for the forum app
    Date: 13/09/2019
"""
from datetime import date, timedelta

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
        if not request.user.is_admin_of_mador:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        forum = Forum.objects.create(mador=request.user.mador, date=date.today(), budget=0)
        return Response(data={'forums': [ForumSerializer(forum).data]},
                        status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'])
    def calculate(self, request, *args, **kwargs):
        month = int(request.data['month'])
        year = int(request.data['year'])
        mador = Mador.objects.get(id=int(request.data['mador']))
        if request.user.administered_forum != mador:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        try:
            forums_created = self.create_forums(mador, month, year)
            return Response(data={'forums': [ForumSerializer(forum).data for forum in forums_created]},
                            status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(data=str(e), status=status.HTTP_400_BAD_REQUEST)

    def create_forums(self, mador, month, year):
        first_day_of_month = date(day=1, month=month, year=year)
        current_day = first_day_of_month
        forum_days = self._get_forum_days(current_day, mador, month)
        return self._create_forum(forum_days, mador)

    @staticmethod
    def _create_forum(forum_days, mador):
        forums = []
        for day in forum_days:
            users = User.objects.all().annotate(forum_count=Count('forums')).order_by('forum_count')
            forum_users = users[:mador.number_of_organizers]
            forum = Forum.objects.create(date=day, budget=mador.default_budget_per_forum, mador=mador)
            if mador.auto_track_forum_budget:
                mador.total_budget -= mador.default_budget_per_forum
                mador.save()
            forum.users.set(forum_users)
            forum.save()
            forums.append(forum)
        return forums

    @staticmethod
    def _get_forum_days(current_day, mador, month):
        forum_days = []
        days_increment = 1
        while current_day.month == month:
            real_current_weekday = current_day.weekday() + 1
            if real_current_weekday == mador.forum_day:
                forum_days.append(current_day)
                if days_increment == 1:
                    # Speed up the search for forum days
                    days_increment = mador.forum_frequency * 7
            current_day += timedelta(days=days_increment)
        return forum_days
