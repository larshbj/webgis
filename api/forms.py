from django import forms
# from uploads.core.models import DataFile
from models import PolygonModel

class UploadFileForm(forms.Form):
        file = forms.FileField()
        # file_field = forms.FileField(widget=forms.ClearableFileInput(attrs={'multiple': True}))
        # class Meta:
        #     model = PolygonModel
        #     fields = ('name', 'geom')
