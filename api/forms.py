from django import forms
# from uploads.core.models import DataFile
from models import Polygon

class UploadFileForm(forms.Form):
        # datafile = forms.FileField()
        # file_field = forms.FileField(widget=forms.ClearableFileInput(attrs={'multiple': True}))
        class Meta:
            model = Polygon
            fields = ('name', 'geom')
