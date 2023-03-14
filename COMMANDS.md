# <center> CLI Commands Used </center>

# Docker
________
## CLI
```
## Remove Images
docker image rm [OPTIONS] IMAGE [IMAGE...]          ## remove image
docker image rm my-image1 my-image2 my-image3       ## remove multiple images
docker image rm -f my-image                         ## forced removal
docker image rm -a                                  ## remove all images
docker rm `docker ps -aq`                           ## remove exited containers

```
_____________
## Build Image

```
docker build [OPTIONS] PATH
docker build -t my-image .
```

### Options

```
-t, --tag list                Name and optionally a tag in the
                              'name:tag' format
```
_____________
## Run Image

```
docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
docker run my-image
```
### Options
- OPTIONS are various flags you can specify to customize the container configuration, such as the container name, port mappings, and environment variables.
  - -d or --detach: Run the container in the background and print the container ID.
  - -it or --interactive --tty: Start an interactive session with a pseudo-TTY.
  - -p or --publish: Publish a container's port(s) to the host.
  - -v or --volume: Mount a host directory or a named volume inside the container.
  - --name: Assign a name to the container.
  - --env or -e: Set environment variables inside the container.
  - --rm: Automatically remove the container when it exits.
  - --network: Connect the container to a network.
  - --entrypoint: command to override the default entrypoint command

##### Examples

```
docker run -d my-image  # Run the container in the background
docker run -it my-image /bin/bash  # Start an interactive session with a pseudo-TTY
docker run -p 8080:80 my-image  # Publish port 80 inside the container to port 8080 on the host
docker run -v /host/dir:/container/dir my-image  # Mount /host/dir on the host to /container/dir inside the container
docker run --name my-container my-image  # Assign the name "my-container" to the container
docker run -e MY_VAR=value my-image  # Set the environment variable MY_VAR to "value" inside the container
docker run --rm my-image  # Automatically remove the container when it exits
docker run --network my-network my-image  # Connect the container to the "my-network" network
docker run --entrypoint /bin/bash my-image -c "ls -l"
```
### Image
- IMAGE is the name or ID of the Docker image to use for the container.
### Command
- COMMAND (optional) is the command to run inside the container, such as a shell or application executable.

##### Examples
```
docker run my-image  # Run the default command specified in the image's Dockerfile
docker run my-image /bin/bash  # Start a Bash shell inside the container
docker run my-image python my-script.py  # Run a Python script inside the container
docker run my-image echo "Hello, World!"  # Print "Hello, World!" inside the container
```
### Arguments
- ARG... (optional) are any arguments to pass to the command.
