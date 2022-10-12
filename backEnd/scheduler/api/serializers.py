from django.contrib.auth import authenticate
from rest_framework import serializers

from scheduler.models import User, Meet, Participation
from scheduler.utils import get_available_prev_time_slots, time_to_minutes

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(
        label="Username",
        write_only=True
    )
    password = serializers.CharField(
        label="Password",
        style={'input_type': 'password'},
        trim_whitespace=False,
        write_only=True
    )

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            user = authenticate(request=self.context.get('request'),
                                username=username, password=password)
            if not user:
                msg = 'Access denied: wrong username or password.'
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = 'Both "username" and "password" are required.'
            raise serializers.ValidationError(msg, code='authorization')
        attrs['user'] = user
        return attrs

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]




class MeetSerializer(serializers.ModelSerializer):
    participants = serializers.PrimaryKeyRelatedField(many=True, queryset=User.objects.all())
    # participants1 = UserSerializer(many=True)
    class Meta:
        model = Meet
        fields = "__all__"
        read_only_fields=['status']
 
    def validate(self, attrs):
        participants=attrs.get("participants")
        start_time = attrs.get("start_time")
        end_time= attrs.get("end_time")
        
        if(len(participants) < 2):
            raise serializers.ValidationError(
                {
                    "errors": "atleast 2 participants required"
                }
            )

        if(start_time >= end_time):
            raise serializers.ValidationError(
                {
                    "errors": "invalid time"
                }
            )
        
        # valid interview time
        part_lst = [participant.id for participant in participants]
        common_slots=get_available_prev_time_slots(attrs.get("day"), part_lst)
        print(common_slots, 'ser', part_lst)
        valid = False
        for slot in common_slots:
            print(slot[0], time_to_minutes(start_time))
            print(slot[1], time_to_minutes(end_time))
            if time_to_minutes(start_time) >= slot[0] and time_to_minutes(end_time) <= slot[1]:
                valid = True
                break
        if(not valid):
            raise serializers.ValidationError(
                {
                    "errors": "Meet timings does not follow the availabe time slots"
                }
            )
        return attrs


class TimeSlotSerializer(serializers.Serializer):
    start_time = serializers.TimeField()
    end_time = serializers.TimeField()
        