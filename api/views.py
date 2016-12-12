import os
import sys
import zipfile
import shutil
import json
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.core.serializers import serialize
from django.views.generic import TemplateView
from django.db import connection, transaction
# from django.views.generic.edit import FormView
from django.contrib.gis import geos, gdal
from django.contrib.gis.gdal import DataSource
from django.conf import settings
from django.contrib.gis.geos import MultiPoint, MultiLineString, MultiPolygon, GEOSGeometry
from .models import WorldBorders, GeometryModel, PolygonModel, PointModel, LineModel
from .forms import UploadFileForm

class MainPageView(TemplateView):
    template_name = 'index.html'

def worldborders_view(request):
    worldborders_as_geojson = serialize('geojson', WorldBorders.objects.all())
    return HttpResponse(worldborders_as_geojson, content_type='json')

def getCategories(request):
    queryset = GeometryModel.objects.values_list('category', flat=True).distinct()
    if not queryset:
        return HttpResponse(status=204)
    categories=[]
    for category in queryset:
        categories.append(category)
    print categories
    categories_string = json.dumps(categories)
    return HttpResponse(categories_string)

def getCategoryLayer(request, category):
    queryset = GeometryModel.objects.filter(category=category)
    if not queryset:
        return HttpResponse(status=204)
    queryset_as_geojson = serialize('geojson', queryset)
    # return queryset_as_geojson
    queryset_as_geojson = queryset_as_geojson.encode('utf-8')
    return HttpResponse(queryset_as_geojson, content_type='json')

def load_layers(request):
    queryset = GeometryModel.objects.all()
    if not queryset:
	       return HttpResponse(status=204)
    models_as_geojson = serialize('geojson', queryset)
    return HttpResponse(models_as_geojson, content_type='json')

def create_buffer(request):
	if request.method == 'POST':
		data = {
			# 'user_id': request.user.id,
			'buffer_distance': int(request.POST.get('buffer_distance')),
			'layer_ids': tuple(json.loads(request.POST.get('layer_ids'))),
            'category': 'buffer_{}'.format(request.POST.get('category')),
		}
        with connection.cursor() as cursor:
            select_sql = ('''
                SELECT ST_Union(ST_Buffer(geom::geography, %(buffer_distance)s)::geometry) as geom
                FROM api_geometrymodel
                WHERE id IN %(layer_ids)s
            ''')


            cursor.execute(select_sql, data)
            insert_data = []
            features = []
            for row in cursor.fetchall():
                print row
                data_row = {
                    'name': 'Buffer_{}'.format(data['buffer_distance']),
                    'category': data['category'],
                    'geom_type': 'Polygon',
                    'geom': row,
                }
                features.append(getFeature(data_row))
                insert_data.append(data_row)
            featureCollection = toFeatureCollection(features)
            sql = ('''
				INSERT INTO api_geometrymodel (name, category, geom_type, geom)
				VALUES (%(name)s, %(category)s, %(geom_type)s, %(geom)s);
			''')
            cursor.executemany(sql, insert_data,)
            result = {
                'category': data['category'],
                'featureCollection': featureCollection
            }
	return HttpResponse(json.dumps(result))

def getFeature(data_row):
    return {
        'type': "Feature",
        'geometry': data_row['geom'],
        'properties': {
            'name': data_row['name'],
            'category': data_row['category'],
            'geom_type': data_row['geom_type']
        }
    }

def toFeatureCollection(features):
    return {
        "type": "FeatureCollection",
        "features": features
    }

model_mapper = {
    'Point': PointModel,
    'LineString': LineModel,
    'Polygon': PolygonModel
}

geometry_mapper = {
    'Point': MultiPoint,
    'LineString': MultiLineString,
    'Polygon': MultiPolygon
}


def handle_uploaded_file(file):
    path = settings.MEDIA_ROOT
    if zipfile.is_zipfile(file):
        zip_ref = zipfile.ZipFile(file, 'r')
        filename_array = zip_ref.namelist()
        for name in filename_array:
            if name.startswith('__MACOSX/') or name.endswith('/'):
                filename_array.remove(name)
        zip_ref.extractall(path=path, members=filename_array)
        folder_to_delete = os.path.join(path, os.path.splitext(file.name)[0])
        try:
            for filename in filename_array:
                if filename.endswith('.shp') and not filename.startswith('__MACOSX/') and not filename.endswith('/'):
                    handle_shapefile(filename, path)
            # shutil.rmtree(folder_to_delete)
        except:
            # shutil.rmtree(folder_to_delete)
            print "Unexpected error:", sys.exc_info()[0]
            raise

def handle_shapefile(filename, path):
    filepath = os.path.abspath(os.path.join(path, filename))
    category = os.path.basename(os.path.splitext(filename)[0])
    folder = os.path.join(path, category)
    # try:
    #     if not any(fname.endswith('.shx') for fname in os.listdir(folder)):
    #         print ".shx file not found, passing"
    #         return
    # except:
    #     return
    ds = DataSource(filepath)
    layer = ds[0]
    geomtype = str(layer.geom_type)
    model = model_mapper[geomtype]
    geometry = geometry_mapper[geomtype]
    models_to_save = []
    for feature in layer:
        geom_geos = geometry(feature.geom.geos)
        try:
            name = feature.get("name")
        except:
            name = category
        if not name:
            name = category
        models_to_save.append(GeometryModel(name = name, category = category, geom=geom_geos, geom_type = geomtype))
    GeometryModel.objects.bulk_create(models_to_save,100)


def upload_file(request):
    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            file = request.FILES['file']
            handle_uploaded_file(file)
            return HttpResponse('home')
    else:
        form = UploadFileForm()

    return render(request, 'index.html', {
        'form': form
    })
