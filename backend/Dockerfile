FROM tiangolo/uwsgi-nginx:python3.6-alpine3.9
LABEL maintainer="Lior Pollak"

# Create a group and user
RUN addgroup www-data && adduser -S www-data -G www-data

# Set environment variables
ENV PYTHONUNBUFFERED 1
ENV UWSGI_INI /backend/uwsgi/uwsgi.ini

COPY requirements.txt /

# Install dependencies
RUN apk add build-base openldap-dev linux-headers pcre-dev python3-dev
RUN pip3 install -r /requirements.txt

# Set work directory
RUN mkdir /backend
WORKDIR /backend

# Copy project code
COPY . /backend/

# Copy nginx configuration file
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
