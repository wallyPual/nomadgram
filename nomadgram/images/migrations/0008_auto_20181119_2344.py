# Generated by Django 2.0.9 on 2018-11-19 14:44

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('images', '0007_auto_20181119_2343'),
    ]

    operations = [
        migrations.AlterField(
            model_name='image',
            name='creator',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='images', to=settings.AUTH_USER_MODEL),
        ),
    ]
