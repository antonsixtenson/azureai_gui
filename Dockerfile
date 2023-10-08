FROM python:3.12.0-alpine3.17

ENV PYTHONUNBUFFERED 1
ENV DJANGO_SETTINGS_MODULE azureai_gui.settings

WORKDIR /app
COPY . /app
WORKDIR /app/azureai_gui

RUN pip install django

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

EXPOSE 8000
