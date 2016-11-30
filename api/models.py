from __future__ import unicode_literals
from django.db import models
from django.contrib.gis.db import models

class WorldBorders(models.Model):
    fips = models.CharField(max_length=2)
    iso2 = models.CharField(max_length=2)
    iso3 = models.CharField(max_length=3)
    un = models.IntegerField()
    name = models.CharField(max_length=50)
    area = models.IntegerField()
    pop2005 = models.IntegerField()
    region = models.IntegerField()
    subregion = models.IntegerField()
    lon = models.FloatField()
    lat = models.FloatField()
    geom = models.MultiPolygonField(srid=4326)

    def __str__(self):
        return '{}'.format(self.name)

    def __unicode__(self):
        return '{}'.format(self.name)


# Auto-generated `LayerMapping` dictionary for WorldBorders model
worldborders_mapping = {
    'fips' : 'FIPS',
    'iso2' : 'ISO2',
    'iso3' : 'ISO3',
    'un' : 'UN',
    'name' : 'NAME',
    'area' : 'AREA',
    'pop2005' : 'POP2005',
    'region' : 'REGION',
    'subregion' : 'SUBREGION',
    'lon' : 'LON',
    'lat' : 'LAT',
    'geom' : 'MULTIPOLYGON',
}

# class Point(models.Model):
#     name = models.CharField(max_length=200)
#     geom = models.PointField('longitude/latitude', blank=True, null=True)
#     objects = models.GeoManager()

def __str__(self):
    return self.name

def __unicode__(self):
    return self.name

class PolygonModel(models.Model):
    name = models.CharField(max_length=50)
    geom = models.MultiPolygonField(srid=4326, blank=True, null=True)

class PointModel(models.Model):
    name = models.CharField(max_length=50)
    geom = models.MultiPointField(srid=4326, blank=True, null=True)

class LineModel(models.Model):
    name = models.CharField(max_length=50)
    geom = models.MultiLineStringField(srid=4326, blank=True, null=True)
