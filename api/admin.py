from django.contrib.gis import admin
from .models import WorldBorders

admin.site.register(WorldBorders, admin.OSMGeoAdmin)
# admin.site.register(Point, admin.OSMGeoAdmin)

# Register your models here.
