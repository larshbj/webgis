import os
from django.contrib.gis.utils import LayerMapping
from .models import WorldBorders

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

worldborder_shp = os.path.abspath(os.path.join('api', 'data', 'TM_WORLD_BORDERS-0.3.shp'))

def run(verbose=True):
    lm = LayerMapping(WorldBorders, worldborder_shp, worldborders_mapping,
                        transform=False, encoding='iso-8859-1')
    lm.save(strict=True, verbose=verbose)
