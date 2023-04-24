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
sys.path.append(Path.cwd())
from imageTransformation import Image as IMG
from imageTransformation import ImageManipulate
#uvicorn main:app --reload
logger = logging.getLogger("uvicorn.access")
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%(asctime)s - %(levelname)s - %(message)s"))
logger.addHandler(handler)
logger.info('starting app')
app = FastAPI()
origins = ["*"]


app.add_middleware(CORSMiddleware,allow_origins=origins,allow_credentials=True,allow_methods=["*"],allow_headers=["*"],)



@app.get("/")
async def read_root():
    return {"Hello": "World"}
class ImageData(BaseModel):
    image_name: str
    image_data: str
    action: str
    
@app.post("/image")
async def image(img: ImageData):
    logger.info(f'recieved image data: {img.image_data[:100]}')
    base64_str = img.image_data.replace("data:image/jpeg;base64,","")
    # Assuming base64_str is the string value without 'data:image/jpeg;base64,'
    img = Image.open(io.BytesIO(base64.decodebytes(bytes(base64_str, "utf-8"))))
    img.save('image.jpeg')

    return {"message": "worked"}

@app.post("/reduce_glare")
async def image(img: ImageData):
   #logger.info(f'recieved image data: {img}')
    base64_str = img.image_data.replace("data:image/jpeg;base64,","")
    img_io = Image.open(io.BytesIO(base64.decodebytes(bytes(base64_str, "utf-8"))))
    logger.info(f'type: {type(img_io)}')
    logger.info(f'action: {img.action}')
    open_cv_image = np.array(img_io) 
    #img_cv2 = cv2.cvtColor(img_io, cv2.COLOR_RGB2BGR)
    image = IMG(
        name=img.image_name,
        image=open_cv_image)
    image_transformed = ImageManipulate([image], ['reduce_glare']).image_collection[0].image_transformed
    cv2.imwrite(f"image_transformed.jpg", image_transformed)

    return {"message": "worked"}