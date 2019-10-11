"""
    Author: Lior Pollak
    Description: NTLM auth, based on https://djangosnippets.org/snippets/501/
    Date: 30/09/2019
"""
import base64
import struct
import ldap

from custom_auth.mador_serializers import MadorSerializer
from custom_auth.models import User
from django.conf import settings
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.models import Token


class ActiveDirectoryBackend:
    def authenticate(self, username=None, password=None):
        if not self.is_valid(username, password):
            return None
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            l = ldap.initialize(settings.AD_LDAP_URL)
            l.simple_bind_s(username, password)
            result = l.search_ext_s(settings.AD_SEARCH_DN, ldap.SCOPE_SUBTREE,
                                    "sAMAccountName=%s" % username, settings.AD_SEARCH_FIELDS)[0][1]
            l.unbind_s()

            # givenName == First Name
            if 'givenName' in result:
                first_name = result['givenName'][0]
            else:
                first_name = None

            # sn == Last Name (Surname)
            if 'sn' in result:
                last_name = result['sn'][0]
            else:
                last_name = None

            # mail == Email Address
            if 'mail' in result:
                email = result['mail'][0]
            else:
                email = None

            user = User(username=username, first_name=first_name, last_name=last_name, email=email)
            user.is_staff = False
            user.is_superuser = False
            user.set_password(password)
            user.save()
        return user

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None

    def is_valid(self, username=None, password=None):
        # Disallowing null or blank string as password
        # as per comment: http://www.djangosnippets.org/snippets/501/#c868
        if password is None or password == '':
            return False
        binddn = "%s@%s" % (username, settings.AD_NT4_DOMAIN)
        try:
            l = ldap.initialize(settings.AD_LDAP_URL)
            l.simple_bind_s(binddn, password)
            l.unbind_s()
            return True
        except ldap.LDAPError:
            return False


def get_msg_str(msg, start):
    msg_len, _, msg_off = struct.unpack("<HHH", msg[start:start + 6])
    return msg[msg_off:msg_off + msg_len].replace("\0", '')


def ntlm_auth(request):
    """Goes through ntlm stages...
    Return user_name, response.
    While response is not none, keep sending it.
    Then use the user.
    """
    username = None
    response = None

    auth = request.META.get('HTTP_AUTHORIZATION')
    if not auth:
        response = HttpResponse(status=401)
        response['WWW-Authenticate'] = "NTLM"
    elif auth[:4] == "NTLM":
        msg = base64.b64decode(auth[4:])
        #  print repr(msg)
        ntlm_fmt = "<8sb" #string, length 8, 4 - op
        NLTM_SIG = "NTLMSSP\0"
        signature, op = struct.unpack(ntlm_fmt, msg[:9])
        if signature != NLTM_SIG:
            print("error header not recognized")
        else:
            print("recognized")
            # print signature, op
            # print repr(msg)
            if op == 1:
                out_msg_fmt = ntlm_fmt + "2I4B2Q2H"
                out_msg = struct.pack(out_msg_fmt,
                    NLTM_SIG, #Signature
                    2, #Op
                    0, #target name len
                    0, #target len off
                    1, 2, 0x81, 1, #flags
                    0, #challenge
                    0, #context
                    0, #target info len
                    0x30, #target info offset
                )

                response = HttpResponse(status=401)
                response['WWW-Authenticate'] = "NTLM " + base64.b64encode(out_msg).strip()
            elif op == 3:
                username = get_msg_str(msg, 36)

    return username, response


@csrf_exempt
def login_user(request):
    # return ntlm_auth(request)[1]
    user = User.objects.filter(administered_forum__isnull=False)[0]
    token = Token.objects.get_or_create(user=user)[0]
    return JsonResponse({
        "user": user.username,
        "token": token.key,
        "is_admin_of_mador": user.is_admin_of_mador,
        "mador": MadorSerializer(user.mador).data
    })
