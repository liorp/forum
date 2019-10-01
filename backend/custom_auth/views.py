"""
    Author: Lior Pollak
    Description: Views for the custom_auth app
    Date: 13/09/2019
"""
from rest_framework import viewsets

from custom_auth.models import User, Mador
from custom_auth.user_serializers import UserSerializer, MadorSerializer


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
