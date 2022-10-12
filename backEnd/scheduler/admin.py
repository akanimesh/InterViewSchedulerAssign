from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Meet, Participation
# Register your models here.

class ParticipationInline(admin.TabularInline):
    model = Participation
    extra = 1

class MeetAdmin(admin.ModelAdmin):
    inlines = (ParticipationInline, )

class User_Admin(UserAdmin):
    pass
admin.site.register(User, User_Admin)
admin.site.register(Meet,MeetAdmin)