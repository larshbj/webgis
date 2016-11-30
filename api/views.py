import os
import zipfile
import shutil
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.core.serializers import serialize
from django.views.generic import TemplateView
# from django.views.generic.edit import FormView
from django.contrib.gis import geos, gdal
from django.contrib.gis.gdal import DataSource
from django.conf import settings
from django.contrib.gis.geos import MultiPoint, MultiLineString, MultiPolygon, GEOSGeometry
from .models import WorldBorders, PolygonModel, PointModel, LineModel
from .forms import UploadFileForm

class MainPageView(TemplateView):
    template_name = 'index.html'

def worldborders_view(request):
    worldborders_as_geojson = serialize('geojson', WorldBorders.objects.all())
    return HttpResponse(worldborders_as_geojson, content_type='json')

# def geojson_serializer(model):
    # model_as_geojson = serialize('geojson', model.object.all())
    # return model_as_geojson

def load_layers(request):
    print '----------------------------'
    models = [PointModel, LineModel, PolygonModel]
    querysets = []
    for model in models:
        print '----------------------------'
        queryset = model.objects.all();
        if queryset:
            querysets.append(queryset)
    if not querysets:
        return HttpResponse(status=204)
    print '----------------------------'
    print querysets

    models_as_geojson = serialize('geojson', querysets)
    return HttpResponse(models_as_geojson, content_type='json')

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
    # new_file = Polygon(file = f, name = f.name)
    # new_file.save()
    # handle_shapefile(f)
    path = settings.MEDIA_ROOT
    if zipfile.is_zipfile(file):
        zip_ref = zipfile.ZipFile(file, 'r')
        filename_array = zip_ref.namelist()
        for name in filename_array:
            if name.startswith('__MACOSX/') or name.endswith('/') or name.endswith:
                filename_array.remove(name)
        zip_ref.extractall(path=path, members=filename_array)
        for filename in filename_array:
            if filename.endswith('.shp') and not filename.startswith('__MACOSX/') and not filename.endswith('/'):
                handle_shapefile(filename, path)

def handle_shapefile(filename, path):
    filepath = os.path.abspath(os.path.join(path, filename))
    ds = DataSource(filepath)
    layer = ds[0]
    geomtype = str(layer.geom_type)
    name = os.path.basename(os.path.splitext(filename)[0])
    model = model_mapper[geomtype]
    geometry = geometry_mapper[geomtype]
    for feature in layer:
        # geom_geos = GEOSGeometry(feature.geom.wkt)
        geom_geos = geometry(feature.geom.geos)
        new_file = model(name = name, geom=geom_geos)
        new_file.save()


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
