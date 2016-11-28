from django.conf.urls import include, url
from django.contrib import admin
from api.views import worldborders_view, MainPageView, upload_file


urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^worldborders.data/', worldborders_view, name='worldborders'),
    url(r'^$', MainPageView.as_view(),name="home"),
    url(r'^uploadHandler/', upload_file, name="uploadhandler"),
]
