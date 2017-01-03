from django.conf.urls import include, url
from django.contrib import admin
from api import views

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'', include('api.urls')),
    url(r'^$', views.MainPageView.as_view(),name="home"),
]
