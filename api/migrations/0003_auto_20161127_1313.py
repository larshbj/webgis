# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2016-11-27 12:13
from __future__ import unicode_literals

import django.contrib.gis.db.models.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_uploadfile'),
    ]

    operations = [
        migrations.CreateModel(
            name='Line',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(upload_to='geofiles/')),
                ('name', models.CharField(max_length=50)),
                ('geom', django.contrib.gis.db.models.fields.MultiLineStringField(srid=4326)),
            ],
        ),
        migrations.CreateModel(
            name='Point',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(upload_to='geofiles/')),
                ('name', models.CharField(max_length=50)),
                ('geom', django.contrib.gis.db.models.fields.MultiPointField(srid=4326)),
            ],
        ),
        migrations.CreateModel(
            name='Polygon',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(upload_to='geofiles/')),
                ('name', models.CharField(max_length=50)),
                ('geom', django.contrib.gis.db.models.fields.MultiPolygonField(srid=4326)),
            ],
        ),
        migrations.DeleteModel(
            name='UploadFile',
        ),
    ]
