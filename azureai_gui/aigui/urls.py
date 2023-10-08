from . import views
from django.urls import path

urlpatterns = [
     path('', views.index, name='index'),
     path('analyze/', views.analyze_text, name='analyze_text'),  # Add this URL pattern
     path('update_settings/', views.update_settings_values, name='update_settings_values'),
]