from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^worldborders.data/', views.worldborders_view, name='worldborders'),
    url(r'^uploadHandler/', views.upload_file, name="uploadhandler"),
    url(r'^load_layers/', views.load_layers, name="load_layers"),
    url(r'^get_categories/', views.getCategories, name="get_categories"),
    url(r'^getCategoryLayer/(?P<category>\w+)/$', views.getCategoryLayer),
    url(r'^create_buffer/', views.create_buffer),
]
