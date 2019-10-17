FROM python:3

# Set environment variables
ENV PYTHONUNBUFFERED 1

COPY requirements.txt /

# Install dependencies.
RUN pip install -r /requirements.txt

# Set work directory.
RUN mkdir /backend
WORKDIR /backend

# Copy project code.
COPY . /backend/

EXPOSE 8080

CMD ["uwsgi", "--http", ":8080", "--ini", "./uwsgi/uwsgi.ini"]
