from fastapi import FastAPI, File, UploadFile
from PIL import Image
import requests
from io import BytesIO
from fastapi.middleware.cors import CORSMiddleware
import base64
import logging
import uvicorn

#uvicorn main:app --reload

logger = logging.getLogger(__name__)
logger.info('test logger')
app = FastAPI()
origins = ["*"]


app.add_middleware(CORSMiddleware,allow_origins=origins,allow_credentials=True,allow_methods=["*"],allow_headers=["*"],)


@app.get("/")
async def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
async def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}


@app.post("/image")
async def image(image_data: str):
    logger.info(f'recieved image data: {image_data}')
    image_bytes = base64.b64decode(image_data)
    with open('image.jpg', 'wb') as f:
        f.write(image_bytes)

    return {"message": "Image translated and saved"}