from django.contrib import admin
from . import models
# Register your models here.

@admin.register( models.Image )
class ImageAdmin( admin.ModelAdmin ):

    list_display_links = (
        'location',
    )
    # admin 패널에 검색기능 추가
    search_fields = (
        'location',
        'caption',
    )
    # admin 패널에 필터옵션 추가
    list_filter = (
        'location',
    )

    list_display = (
        'file',
        'creator',
        'location',
        'caption',
        'created_at',
        'updated_at',
    )

@admin.register( models.Like )
class LikeAdmin( admin.ModelAdmin ):
    list_display = (
        'image',
        'creator',
        'created_at',
        'updated_at',
    )

@admin.register( models.Comment )
class CommentAdmin ( admin.ModelAdmin ):
    list_display = (
        'message',
        'creator',
        'image',
        'created_at',
        'updated_at',
    )