# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2016-11-28 10:11
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_auto_20161128_1110'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='linemodel',
            name='file',
        ),
        migrations.RemoveField(
            model_name='pointmodel',
            name='file',
        ),
    ]
