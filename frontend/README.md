# TODO
- Check hot-reload

# How To Run

## Build Image
```
docker build -t react_test_image .
```

## Run Container in Detached, Port Forward
```
docker run -d -p 3000:3000 react_test_image
```