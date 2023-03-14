# TODO
- Check hot-reload

# How To Run

## Build Image
```
docker build -t fast_test_image .
```

## Run Container in Detached, Port Forward
```
docker run -d -p 8000:8000 fast_test_image
```