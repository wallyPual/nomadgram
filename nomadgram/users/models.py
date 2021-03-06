from django.contrib.auth.models import AbstractUser
from django.db.models import CharField
from django.db import models
from django.urls import reverse
from django.utils.translation import ugettext_lazy as _


class User(AbstractUser):
    """ User Model """

    GENDER_CHOICES = (
        ('male', 'Male'),
        ('female', 'Female'),
        ('not-specified', 'Not specified')
    )

    # First Name and Last Name do not cover name patterns
    # around the globe.
    profile_image = models.ImageField(null=True)
    name = CharField(_("Name of User"), blank=True, max_length=255)
    website = models.URLField( null=True, blank=True ) #null=true 입력 시 기존에 생성되어있는 컬럼값들은 널값으로 유지함
    bio = models.TextField( null=True, blank=True )#null=true 입력 시 기존에 생성되어있는 컬럼값들은 널값으로 유지함
    phone = CharField(max_length=140, null=True, blank=True)
    gender = CharField(max_length=80, choices=GENDER_CHOICES, null=True, blank=True)
    followers = models.ManyToManyField('self', blank=True)
    following = models.ManyToManyField('self', blank=True)

    @property
    def post_count(self):
        return self.images.all().count()

    @property
    def followers_count(self):
        return self.followers.all().count()

    @property
    def following_count(self):
        return self.following.all().count()
