# Use an official Python runtime as a parent image
FROM python:3.9-slim-buster
# update and get some applications required for cv2
RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y
# update pip
RUN python -m pip install --upgrade pip
# Copy directory structure
COPY . /

## Install the required packages
RUN  pip install --no-cache-dir -r requirments.txt

## Make port 8000 available to the world outside this container
EXPOSE 8000

ENV PATH=$PATH:/app
ENV PYTHONPATH /app

WORKDIR /app

## Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
