FROM nginx:1.17.4-alpine
LABEL maintainer="Lior Pollak"

# Set environment variables
ENV PYTHONUNBUFFERED 1
ENV UWSGI_INI /backend/uwsgi/uwsgi.ini

COPY requirements.txt /

# Install dependencies.
RUN apk add build-base openldap-dev linux-headers pcre-dev
RUN pip install -r /requirements.txt

# Set work directory.
RUN mkdir /backend
WORKDIR /backend

# Copy project code.
COPY . /backend/


EXPOSE 8000

CMD ["uwsgi", "--ini", "./uwsgi/uwsgi.ini"]
