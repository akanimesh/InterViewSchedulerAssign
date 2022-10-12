from datetime import datetime

from django.db.models import Q
from django.contrib.auth import login
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import permissions, viewsets, status, views

from scheduler.models import Meet, User
from scheduler.api.serializers import MeetSerializer, TimeSlotSerializer, UserSerializer, LoginSerializer
from scheduler.utils import get_available_time_slots



class LoginView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = LoginSerializer(data=self.request.data,
            context={ 'request': self.request })
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        data = UserSerializer(user).data
        data['is_admin'] = user.is_superuser
        return Response(data, status=status.HTTP_202_ACCEPTED)


class UserViewSet(viewsets.ModelViewSet):
    queryset=User.objects.filter(is_superuser=False)
    serializer_class=UserSerializer

class MeetViewSet(viewsets.ModelViewSet):
    serializer_class=MeetSerializer

    def get_queryset(self):
        user = self.request.user
        print(user)
        queryset=Meet.objects.prefetch_related('participants')
        # if not user.is_superuser:
        #     queryset = queryset.filter(participants=user)
        

        meet_status = self.request.query_params.get("status")
        print(user, queryset, meet_status, 46)
        if meet_status == "past":
            queryset = queryset.filter(Q(day__lt=datetime.today().date()) | Q(day=datetime.today().date()) & Q(start_time__lt=datetime.today().time()))
        elif meet_status:
            queryset = queryset.filter(Q(day__gt=datetime.today().date()) | Q(day=datetime.today().date()) & Q(start_time__gt=datetime.today().time()))
        return queryset



    @action(
        detail=False,
        methods=["GET"],
        serializer_class=TimeSlotSerializer
    )
    def available_slots(self, request, *args, **kwargs):
        participants = self.request.query_params.get("participants")
        day = self.request.query_params.get("day", datetime.today().date())
        day = datetime.strptime(day,"%a, %d %b %Y %H:%M:%S %Z").date()
        if participants:
            participants = [int(x) for x in participants.split(',')]
        else:
            return Response({"detail": "pick atleast one Participant"}, status=status.HTTP_400_BAD_REQUEST)
        time_slots = get_available_time_slots(day, participants)
        data = self.get_serializer(time_slots, many=True).data
        return Response(data)

    @action(
        detail=True,
        methods=["GET"],
        serializer_class=UserSerializer
    )
    def get_all_participants(self, request, *args, **kwargs):
        meet = self.get_object()
        participants = meet.participants.all()
        data = self.get_serializer(participants, many=True).data
        return Response(data)


    
