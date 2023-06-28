from fastapi import FastAPI, File, UploadFile
from PIL import Image
import requests
from io import BytesIO
from fastapi.middleware.cors import CORSMiddleware
import base64
import logging
from pydantic import BaseModel
import base64
import numpy as np
import cv2
import io
import sys
from pathlib import Path
sys.path.append('/app')
from .mongoClient import Mongo
from .imageTransformation import Image as IMG
from .imageTransformation import ImageManipulate
#from imageTransformation import Image as IMG
#from imageTransformation import ImageManipulate
import click
import os
import uvicorn
from typing import Any

#uvicorn main:app --reload
#logger = logging.getLogger("uvicorn.error")
#process_id = os.getpid()
#logger.info('starting app', process_id)

app = FastAPI()
origins = [
        "*",
        "http://frontend:3000",
        "http://backend:8000"
        ]
db_name = "imageDatabase"
collection_name = "salamander_drop"


app.add_middleware(CORSMiddleware,allow_origins=origins,allow_credentials=True,allow_methods=["*"],allow_headers=["*"],)

class ImageData(BaseModel):
    image_name: str
    image_data: str
    action: str

class DataSet(BaseModel):
    imageData: Any
    imageSetData: Any
    imageAttributes: Any

@app.get("/")
async def sayHello():
    return "hello-world"

@app.post("/reduce_glare")
async def reduce_glare(img: ImageData):
    base64_img = transform_image(img, 'reduce_glare')
    return {"image": base64_img}

@app.post("/remove_background")
async def remove_background(img: ImageData):
    base64_img = transform_image(img, 'remove_background')
    return {"image": base64_img}

@app.post("/rotate_image")
async def rotate_image(img: ImageData):
    base64_img = transform_image(img, 'rotate_image')
    return {"image": base64_img}

@app.post("/submit")
async def submit_data_set(dataSet: DataSet):
    mongo = Mongo(db_name, collection_name)
    mongo.add_dataset(dataSet.imageData, dataSet.imageSetData, dataSet.imageAttributes)
    return {'message':"recieved"}


def transform_image(img: ImageData, action: str) ->str:
    open_cv_image = b64_to_cv2(img.image_data)
    image = IMG(
        name=img.image_name,
        image=open_cv_image)
    image_transformed = ImageManipulate([image], [action]).image_collection[0].image_transformed
    base64_img = cv2_to_b64(image_transformed)
    return base64_img


def b64_to_cv2(b64_string: str) -> np.ndarray:
    if "data:image/jpeg;base64," in b64_string:
        b64_string = b64_string.replace("data:image/jpeg;base64,","")
    img_io = Image.open(io.BytesIO(base64.decodebytes(bytes(b64_string, "utf-8"))))
    return np.array(img_io) 


def cv2_to_b64(cv2_image:np.ndarray) -> str:
    _, buffer = cv2.imencode('.jpg', cv2_image)
    base64_img = base64.b64encode(buffer).decode('utf-8')
    return "data:image/jpeg;base64," + base64_img
