from django.conf.urls import include, url
from django.contrib import admin
from api.views import create_buffer, worldborders_view, MainPageView, getCategoryLayer, getCategories, upload_file, load_layers

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^worldborders.data/', worldborders_view, name='worldborders'),
    url(r'^$', MainPageView.as_view(),name="home"),
    url(r'^uploadHandler/', upload_file, name="uploadhandler"),
    url(r'^load_layers/', load_layers, name="load_layers"),
    url(r'^get_categories/', getCategories, name="get_categories"),
    url(r'^getCategoryLayer/(?P<category>\w+)/$', getCategoryLayer),
    url(r'^create_buffer/', create_buffer),
]
