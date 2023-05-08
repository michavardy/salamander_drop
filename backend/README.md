# TODO
- Check hot-reload

# How To Run

## prune
```
docker container prune 
```
## Build Image
```
docker build -t backend .
```

## Run Container in Detached, Port Forward
```
docker run -d -p 8000:8000 backend
```

## Run Container in debug mode
```
docker run -it -p 8000:8000 backend sh
```