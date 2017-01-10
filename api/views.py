import os
import sys
import zipfile
import shutil
import json
from django.shortcuts import render
from django.core.files import File
from django.http import HttpResponse, HttpResponseRedirect
from django.core.serializers import serialize
from django.views.generic import TemplateView
from django.db import connection, transaction
# from django.views.generic.edit import FormView
from django.contrib.gis import geos, gdal
from django.contrib.gis.gdal import DataSource, CoordTransform, SpatialReference
from django.conf import settings
from django.contrib.gis.geos import MultiPoint, MultiLineString, MultiPolygon, GEOSGeometry
from .models import WorldBorders, LarshbjGeoModel
from .forms import UploadFileForm


class MainPageView(TemplateView):
    template_name = 'index.html'

def worldborders_view(request):
    worldborders_as_geojson = serialize('geojson', WorldBorders.objects.all())
    return HttpResponse(worldborders_as_geojson, content_type='json')

def getCategories(request):
    user_id = request.user.id
    queryset = LarshbjGeoModel.objects.filter(user_id=user_id).values_list('category', flat=True).distinct()
    if not queryset:
        return HttpResponse(status=204)
    categories=[]
    for category in queryset:
        categories.append(category)
    print categories
    categories_string = json.dumps(categories)
    return HttpResponse(categories_string)

def getCategoryLayer(request, category):
    user_id = request.user.id
    queryset = LarshbjGeoModel.objects.filter(category=category, user_id=user_id)
    if not queryset:
        return HttpResponse(status=204)
    queryset_as_geojson = serialize('geojson', queryset)
    # return queryset_as_geojson
    queryset_as_geojson = queryset_as_geojson.encode('utf-8')
    return HttpResponse(queryset_as_geojson, content_type='json')

def load_layers(request):
    user_id = request.user.id
    queryset = LarshbjGeoModel.objects.annotate(area=Area('geom')).filter(user_id=user_id).order_by('-area');
    if not queryset:
	       return HttpResponse(status=204)
    models_as_geojson = serialize('geojson', queryset)
    return HttpResponse(models_as_geojson, content_type='json')

def create_difference(request):
    if request.method == 'POST':
        data = {
        	'user_id': request.user.id,
        	'first_layer': tuple(json.loads(request.POST.get('first_layer'))),
            'second_layer': tuple(json.loads(request.POST.get('second_layer'))),
            'layer_names': json.loads(request.POST.get('layer_names'))
        }
        with connection.cursor() as cursor:
            sql_insert = ('''
            	SELECT ST_Difference
                (
                        (
                            	SELECT ST_UNION(geom)
                            	FROM api_larshbjgeomodel
                            	WHERE user_id = %(user_id)s AND id IN %(first_layer)s
                        ),(
                            	SELECT ST_UNION(geom)
                            	FROM api_larshbjgeomodel
                            	WHERE user_id = %(user_id)s AND id IN %(second_layer)s
                        )
                )
            	FROM api_larshbjgeomodel
            ''')

            cursor.execute(sql_insert, data)
            insert_data = []
            features = []
            for row in cursor.fetchall():
                data_row = {
                    'name': 'Difference' + '_'.join(['%s']*len(data['layer_names'])) % tuple(data['layer_names']),
                    'category': 'Difference' + '_'.join(['%s']*len(data['layer_names'])) % tuple(data['layer_names']),
                    'user_id': data['user_id'],
                    'geom_type': 'Polygon',
                    'geom': row,
                }
                features.append(getFeature(data_row))
                insert_data.append(data_row)
            featureCollection = toFeatureCollection(features)
            sql = ('''
        		INSERT INTO api_larshbjgeomodel (name, category, user_id, geom_type, geom)
        		VALUES (%(name)s, %(category)s, %(user_id)s, %(geom_type)s, %(geom)s);
        	''')
            cursor.executemany(sql, insert_data,)
            result = {
                'category': 'Difference' + '_'.join(['%s']*len(data['layer_names'])) % tuple(data['layer_names']),
                'featureCollection': featureCollection
            }
    return HttpResponse(json.dumps(result))

def create_intersection(request):
    if request.method == 'POST':
        data = {
        	'user_id': request.user.id,
        	'layer_one_ids': tuple(json.loads(request.POST.get('layer_one_ids'))),
            'layer_two_ids': tuple(json.loads(request.POST.get('layer_two_ids'))),
            'layer_names': json.loads(request.POST.get('layer_names'))
        }
        print data['layer_one_ids']
        print data['layer_two_ids']
        with connection.cursor() as cursor:
            sql_insert = ('''
            	SELECT ST_Intersection
                (
                        (
                            	SELECT ST_UNION(geom)
                            	FROM api_larshbjgeomodel
                            	WHERE user_id = %(user_id)s AND id IN %(layer_one_ids)s
                        ),(
                            	SELECT ST_UNION(geom)
                            	FROM api_larshbjgeomodel
                            	WHERE user_id = %(user_id)s AND id IN %(layer_two_ids)s
                        )
                )
            	FROM api_larshbjgeomodel;
            ''')
            # sql = ('''
			# 	INSERT INTO api_larshbjgeomodel(name, category, user_id, geom_type, geom)
			# 	VALUES ('Intersection', %(category)s, %(user_id)s, 'intersections',
			# 		(
			# 			SELECT ST_Union(%(geometries)s)
			# 		)
			# 	);
			# ''')
            # test = cursor.execute(sql_insert, data)
            # print test
            # print "ok"
            # insert_data = {
			# 	'geometries': cursor.fetchall(),
            #     'category': 'Intersection' + '_'.join(['%s']*len(data['layer_names'])) % tuple(data['layer_names']),
			# 	'user_id': request.user.id,
			# }
            # cursor.execute(sql, insert_data)
            # result = {
            #     'category': 'Intersection' + '_'.join(['%s']*len(data['layer_names'])) % tuple(data['layer_names']),
            #     'featureCollection': featureCollection
            # }
            try:
                cursor.execute(sql_insert, data)
            except:
                print "some problem occured"
            print "2"
            insert_data = []
            features = []
            for row in cursor.fetchall():
                data_row = {
                    'name': 'Intersection' + '_'.join(['%s']*len(data['layer_names'])) % tuple(data['layer_names']),
                    'category': 'Intersection' + '_'.join(['%s']*len(data['layer_names'])) % tuple(data['layer_names']),
                    'user_id': data['user_id'],
                    'geom_type': 'Polygon',
                    'geom': row,
                }
                features.append(getFeature(data_row))
                insert_data.append(data_row)
            print "3"
            featureCollection = toFeatureCollection(features)
            sql = ('''
        		INSERT INTO api_larshbjgeomodel (name, category, user_id, geom_type, geom)
        		VALUES (%(name)s, %(category)s, %(user_id)s, %(geom_type)s, %(geom)s);
        	''')
            cursor.executemany(sql, insert_data,)
            print "4"
            result = {
                'category': 'Intersection' + '_'.join(['%s']*len(data['layer_names'])) % tuple(data['layer_names']),
                'featureCollection': featureCollection
            }
    return HttpResponse(json.dumps(result))

def create_union(request):
	if request.method == 'POST':
		data = {
			'user_id': request.user.id,
			'layer_ids': tuple(json.loads(request.POST.get('layer_ids'))),
            'layer_names': json.loads(request.POST.get('layer_names'))
		}
        with connection.cursor() as cursor:
            sql_insert = ('''
            	SELECT ST_Union(geom)
            	FROM api_larshbjgeomodel
            	WHERE user_id = %(user_id)s AND id IN %(layer_ids)s
            ''')

            cursor.execute(sql_insert, data)
            insert_data = []
            features = []
            for row in cursor.fetchall():
                data_row = {
                    'name': 'Union_' + '_'.join(['%s']*len(data['layer_names'])) % tuple(data['layer_names']),
                    'category': 'Union_' + '_'.join(['%s']*len(data['layer_names'])) % tuple(data['layer_names']),
                    'user_id': data['user_id'],
                    'geom_type': 'Polygon',
                    'geom': row,
                }
                features.append(getFeature(data_row))
                insert_data.append(data_row)
            featureCollection = toFeatureCollection(features)
            sql = ('''
        		INSERT INTO api_larshbjgeomodel (name, category, user_id, geom_type, geom)
        		VALUES (%(name)s, %(category)s, %(user_id)s, %(geom_type)s, %(geom)s);
        	''')
            cursor.executemany(sql, insert_data,)
            result = {
                'category': 'Union_' + '_'.join(['%s']*len(data['layer_names'])) % tuple(data['layer_names']),
                'featureCollection': featureCollection
            }
	return HttpResponse(json.dumps(result))

def create_buffer(request):
	if request.method == 'POST':
		data = {
			'user_id': request.user.id,
			'buffer_distance': int(request.POST.get('buffer_distance')),
			'layer_ids': tuple(json.loads(request.POST.get('layer_ids'))),
            'category': 'buffer_{}'.format(request.POST.get('category')),
		}
        with connection.cursor() as cursor:
            select_sql = ('''
                SELECT ST_Union(ST_Buffer(geom::geography, %(buffer_distance)s)::geometry) as geom
                FROM api_larshbjgeomodel
                WHERE user_id = %(user_id)s AND id IN %(layer_ids)s
            ''')


            cursor.execute(select_sql, data)
            insert_data = []
            features = []
            for row in cursor.fetchall():
                data_row = {
                    'name': 'Buffer_{}'.format(data['buffer_distance']),
                    'category': data['category'],
                    'user_id': data['user_id'],
                    'geom_type': 'Polygon',
                    'geom': row,
                }
                features.append(getFeature(data_row))
                insert_data.append(data_row)
            featureCollection = toFeatureCollection(features)
            sql = ('''
				INSERT INTO api_larshbjgeomodel (name, category, user_id, geom_type, geom)
				VALUES (%(name)s, %(category)s, %(user_id)s, %(geom_type)s, %(geom)s);
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

# model_mapper = {
#     'Point': PointModel,
#     'LineString': LineModel,
#     'Polygon': PolygonModel
# }

geometry_mapper = {
    'Point': MultiPoint,
    'LineString': MultiLineString,
    'Polygon': MultiPolygon
}


def handle_uploaded_file(file, user_id):
    user_data_folder = getUserDataFolder(user_id)
    try:
        for file in os.listdir(user_data_folder):
            if file.endswith('.shp') and not file.startswith('__MACOSX/') and not file.endswith('/'):
                filename = os.path.splitext(file)[0]
                if hasMandatoryFiles(user_data_folder, filename):
                    handle_shapefile(file, user_data_folder, user_id)
        shutil.rmtree(user_data_folder)
        return True
    except:
        shutil.rmtree(user_data_folder)
        print "Unexpected error:", sys.exc_info()[0]
        raise

def hasMandatoryFiles(folder, basename):
	extensions = ['.shx', '.prj', '.dbf']
	file_dirs = []
	for extension in extensions:
		file_dir = os.path.join(folder, basename + extension)
		print file_dir
		if not os.path.isfile(file_dir):
			return False
		return True

def unzipFile(file, user_id):
    # path = settings.MEDIA_ROOT
    user_data_folder = getUserDataFolder(user_id)
    zip_ref = zipfile.ZipFile(file, 'r')
    filename_array = zip_ref.namelist()
    for name in filename_array:
        if name.startswith('__MACOSX/') or name.endswith('/'):
            filename_array.remove(name)
    # zip_ref.extractall(path=user_data_folder, members=filename_array)
        filecontent = zip_ref.read(name)
        filename = os.path.basename(name)
        if not os.path.exists(user_data_folder):
		    os.makedirs(user_data_folder)
        new_file_dir = os.path.join(user_data_folder, filename)
        with open(new_file_dir, 'wb') as f:
			new_file = File(f)
			new_file.write(filecontent)
    return True

def getUserDataFolder(user_id):
	return os.path.abspath(
	    os.path.join(settings.MEDIA_ROOT, 'data', str(user_id)),
	)

def handle_shapefile(filename, folderPath, user_id):
    print "okay so long"
    filepath = os.path.abspath(os.path.join(folderPath, filename))
    category = os.path.basename(os.path.splitext(filename)[0])
    folder = os.path.join(folderPath, category)
    ds = DataSource(filepath)
    layer = ds[0]
    srs = layer.srs
    coord_trans = CoordTransform(srs, SpatialReference(4326)) # if we get data in another ref sys
    geomtype = str(layer.geom_type)
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
        geom_geos.transform(coord_trans)
        models_to_save.append(LarshbjGeoModel(name = name, category = category,\
                user_id = user_id, geom=geom_geos, geom_type = geomtype))
    LarshbjGeoModel.objects.bulk_create(models_to_save,100)

def upload_file(request):
    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            user_id = request.user.id
            file = request.FILES['file']
            if zipfile.is_zipfile(file):
                unzipFile(file, user_id)
                handle_uploaded_file(file, user_id)
                return HttpResponse('home')
    else:
        form = UploadFileForm()

    return render(request, 'index.html', {
        'form': form
    })
