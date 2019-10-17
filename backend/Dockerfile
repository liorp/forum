FROM python:3-alpine
LABEL maintainer="Lior Pollak"

# Set environment variables
ENV PYTHONUNBUFFERED 1

# Create a group and user
RUN addgroup -S www-data && adduser -S www-data -G www-data

COPY requirements.txt /

# Install dependencies.
RUN apk add build-base openldap-dev linux-headers pcre-dev
RUN pip install -r /requirements.txt

# Set work directory.
RUN mkdir /backend
WORKDIR /backend

# Copy project code.
COPY . /backend/

EXPOSE 8080

CMD ["uwsgi", "--http", ":8080", "--ini", "./uwsgi/uwsgi.ini"]
