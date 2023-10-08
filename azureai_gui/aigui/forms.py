from django import forms

class TextInputForm(forms.Form):
    user_input = forms.TextField(label="Enter Text")