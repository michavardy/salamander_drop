# Use an official Python runtime as a parent image
FROM python:3.9-slim-buster

# Set the working directory to /app
WORKDIR /app

# Copy requirments
COPY requirments.txt /

# Copy the current directory contents into the container at /app
COPY . /app

# Install the required packages
RUN  pip install --no-cache-dir -r requirments.txt

# Make port 8000 available to the world outside this container
EXPOSE 8000

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]