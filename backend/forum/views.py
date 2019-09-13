"""
    Author: Lior Pollak
    Description: Views for the forum app
    Date: 13/09/2019
"""
from rest_framework import viewsets

from backend.forum.models import Forum
from backend.forum.serializers import ForumSerializer


class ForumViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows forums to be viewed or edited.
    """
    queryset = Forum.objects.all()
    serializer_class = ForumSerializer
