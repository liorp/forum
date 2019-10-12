# -*- coding: utf-8 -*-
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.local_settings")
django.setup()

from custom_auth.models import User, Mador


def run():
    m = Mador.objects.create(name="Best mador", total_budget=100, default_budget_per_forum=1)
    u = User.objects.create_user('liorp', password='bar')
    u.is_superuser = True
    u.is_staff = True
    u.save()
    u2 = User.objects.create_user('another', password='bar')
    u2.is_superuser = True
    u2.is_staff = True
    u2.save()
    u3 = User.objects.create_user('third', password='bar')
    u3.is_superuser = True
    u3.is_staff = True
    u3.save()
    m.admin = u
    m.save()
    m.users.set([u, u2, u3])
    m.save()


if __name__ == '__main__':
    run()
