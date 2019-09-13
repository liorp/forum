"""
    Author: Lior Pollak
    Description: Views for the auth app
    Date: 13/09/2019
"""
from rest_framework import viewsets

from backend.auth.models import User, Mador
from backend.auth.serializers import UserSerializer, MadorSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer


class MadorViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows madors to be viewed or edited.
    """
    queryset = Mador.objects.all()
    serializer_class = MadorSerializer
