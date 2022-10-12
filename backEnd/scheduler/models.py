import pytz

from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.

TIMEZONES = tuple(zip(pytz.all_timezones, pytz.all_timezones))
MEET_STATUS = (
    ("accept", "accept"),
    ("pending", "pending"),
    ("request for change", "request for change"),
)

class User(AbstractUser):
    timezone = models.CharField(max_length=40, choices=TIMEZONES, 
    default='UTC')


class Meet(models.Model):
    day = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    description = models.TextField(null=True, blank=True)
    participants = models.ManyToManyField(
        User,
        through='Participation',
        through_fields=('meetId', 'userId'),
    )
    status = models.CharField(max_length=40, choices=MEET_STATUS, default='pending')

class Participation(models.Model):
    meetId = models.ForeignKey(Meet, on_delete=models.CASCADE)
    userId = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=40, choices=MEET_STATUS, default='pending')
    comment = models.TextField(null=True, blank=True)



