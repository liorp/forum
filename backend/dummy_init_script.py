# -*- coding: utf-8 -*-
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.local_settings")
django.setup()

from custom_auth.models import User, Mador


def run():
    m = Mador.objects.create(name="Best mador", total_budget=100, default_budget_per_forum=1)
    u = User.objects.create_user('liorp', name='lior', password='bar')
    u.is_superuser = True
    u.is_staff = True
    u.save()
    u2 = User.objects.create_user('another', name='sad', password='bar')
    u2.is_superuser = True
    u2.is_staff = True
    u2.save()
    u3 = User.objects.create_user('third', name='aaaa', password='bar')
    u3.is_superuser = True
    u3.is_staff = True
    u3.save()
    m.admins.set([u])
    m.save()
    m.users.set([u, u2, u3])
    m.save()

    m1 = Mador.objects.create(name="Another mador", total_budget=10, default_budget_per_forum=1)
    uu1 = User.objects.create_user('fake', name='fake', password='bar')
    uu1.is_superuser = True
    uu1.is_staff = True
    uu1.save()
    uu2 = User.objects.create_user('fake1', name='fake1', password='bar')
    uu2.is_superuser = True
    uu2.is_staff = True
    uu2.save()
    m1.admins.set([uu1])
    m1.save()
    m1.users.set([uu1, uu2])
    m1.save()


if __name__ == '__main__':
    run()
