#!/usr/bin/env bash

# Run custom Python script before starting
python /backend/manage.py migrate
python /backend/dummy_init_script.py
