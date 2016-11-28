from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.core.serializers import serialize
from django.views.generic import TemplateView
# from django.views.generic.edit import FormView
from django.contrib.gis.gdal import DataSource
import os
from django.conf import settings
from .models import WorldBorders, Polygon, Point, Line
from .forms import UploadFileForm
import zipfile

class MainPageView(TemplateView):
    template_name = 'index.html'

def worldborders_view(request):
    worldborders_as_geojson = serialize('geojson', WorldBorders.objects.all())
    return HttpResponse(worldborders_as_geojson, content_type='json')

# class FileFieldView(FormView)
#     form_class = UploadFileForm
#     template_name = 'index.html'
#     success_url = 'home'
#
#     def post(self, request, *args, **kwargs):
#         form_class = self.get_form_class()
#         form = self.get_form(form_class)
#         files = request.FILES.getlist('file_field')
#         if form.is_valid():
#             for f in files:
#                 handle_uploaded_file(f)
#                 return self.form_valid(form)
#         else:
#             return self.form_invalid(form)

model_mapper = {
    'Point': Point,
    'LineString': Line,
    'Polygon': Polygon
}

def polygon_serializer(polygon):
    polygon_as_geojson = serialize('geojson', polygon.object.all())
    return polygon_as_geojson

def handle_uploaded_file(file):
    # new_file = Polygon(file = f, name = f.name)
    # new_file.save()
    # handle_shapefile(f)
    path = os.path.abspath(os.path.join(settings.MEDIA_ROOT, 'polygons'))
    if zipfile.is_zipfile(file):
        zip_ref = zipfile.ZipFile(file, 'r')
        filename_array = zip_ref.namelist()
        zip_ref.extractall(path=path)
        for filename in filename_array:
            if filename.endswith('.shp'):
                handle_shapefile(filename, path)

def handle_shapefile(filename, path):
    path = os.path.join(path, filename)
    ds = DataSource(path)
    layer = ds[0]
    geomtype = layer.geom_type
    print geom
    # new_file = model_mapper[str(geomtype)](file=path, name = filename, geom=geom)
    new_file = Polygon(file=path, name = filename, geom=geom)
    new_file.save()

def upload_file(request):
    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            file = request.FILES['file']
            handle_uploaded_file(file)
            return HttpResponseRedirect('home')
    else:
        form = UploadFileForm()

    return render(request, 'index.html', {
        'form': form
    })
