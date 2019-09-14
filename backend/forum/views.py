"""
    Author: Lior Pollak
    Description: Views for the forum app
    Date: 13/09/2019
"""
from rest_framework import viewsets
from rest_framework.decorators import action

from backend.forum.models import Forum
from backend.forum.serializers import ForumSerializer


class ForumViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows forums to be viewed or edited.
    """
    queryset = Forum.objects.all()
    serializer_class = ForumSerializer

    @action(detail=False, methods=['post', 'delete', 'patch'])
    def create_forum_for_mador(self, request):
        pass
