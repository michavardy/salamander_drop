import argparse
from argparse import Namespace
import cv2
import os
from pathlib import Path
import logging
import sys
from dataclasses import dataclass
import numpy as np
from typing import List
from tqdm import tqdm
from rembg import remove
from .ShadowHighlighCorrection import correction
from .logger_setup import logger
#from ShadowHighlighCorrection import correction
#from logger_setup import logger

CWD = Path.cwd()
INPUT = CWD.stem
OUTPUT = f'{INPUT}_out'
OUTPUT_DIR = CWD.parent / OUTPUT


"""
    for testing
    # python imageTransformation.py -i ../../testing/sample_dataset -o ../../testing/test_2 --remove_background
"""

@dataclass
class Image:
    name: str
    image: np.ndarray
    input_dir: Path = None
    output_dir: Path = None
    input_path: Path = None
    output_path: Path = None
    image_transformed: np.ndarray = None
    transformation_list: list = None

    def __post_init__(self):
        self.image_transformed = self.image
        self.transformation_list = []
class ImageManipulate:
    """
        A class for manipulating a collection of images using various transformations.

        Args:
        - image_collection (list[dict]): A list of dictionaries, where each dictionary represents an image and contains
        the following keys:
            - 'name' (str): The name of the image
            - 'image' (numpy.ndarray): The image data as a numpy array
        - actions (list): A list of strings representing the transformations to be applied to the images. Valid options are:
            - 'grey_image': Converts the image to grayscale.
            - 'color_image': Converts the image to color.
            - 'reduce_glare': Removes glare from the image.
            - 'remove_background': Removes the background from the image.
            - 'rotate_image': Rotates the image by 90 degrees counterclockwise.

        Returns:
        - An instance of the ImageManipulate class.

        Example usage:

        ```
        image_collection = [Image(path='image1.jpg', name ='Image 1', image = img1),
                            Image(path='image2.jpg', name ='Image 2', image = img2),
                            Image(path='image3.jpg', name ='Image 3', image = img3)]

        actions = ['grey_image', 'remove_background', 'rotate_image']

        img_manipulator = ImageManipulate(image_collection, actions)

        # Access the transformed images
        transformed_images = [img.image_transformed for img in img_manipulator.image_collection]
        ```
    """
    def __init__(self, image_collection:list[Image], actions: list):
        """
        Creates an instance of the ImageManipulate class.

        Args:
        - image_collection (list[dict]): A list of dictionaries, where each dictionary represents an image and contains
        the following keys:
            - 'path' (str): The path to the image file
            - 'name' (str): The name of the image
            - 'image' (numpy.ndarray): The image data as a numpy array
        - kwargs (): optional arguments
            - 'glare' (bool): removes glare from image
            - 'remove_background' (bool): removes background from image

        Returns:
        - An updated image collection (list[dict]): A list of dictionaries, where each dictionary represents an image and contains
        the following keys:
            - 'path' (str): The path to the image file
            - 'name' (str): The name of the image
            - 'image' (numpy.ndarray): The image data as a numpy array
            - 'transformations' (list[str]): list of transformations
            - 'image_transformed' (numpy.ndarray):

        """
        self.image_collection = image_collection
        self.action = None
        self.handle_actions(actions)  
        self.correct_color()
    def handle_actions(self, actions: list[str]):
        """
            Handles the specified list of image transformations.

            Args:
            - actions (list): A list of strings representing the transformations to be applied to the images.

            Returns:
            - None.
        """
        logger.info(f"show actions: {actions}")
        for action in actions:
            # load action into the action class attribute
            self.action = action
            # call the function
            getattr(self, action)()
    def grey_image(self):
        """
            Converts the image to grayscale.
        """
        logger.info(f'{self.GREY} image')
        for img in self.image_collection:
            img.image_transformed = cv2.cvtColor(img.image_transformed, cv2.COLOR_BGR2GRAY)
            img.transformation_list.append(self.GREY)
    def reduce_glare(self):
        """
            Removes glare from the image.
        """
        logger.info(self.action)
        for img in tqdm(self.image_collection, desc=f"apply {self.action}"):
            img.image_transformed = correction(
                    img=img.image_transformed,
                    shadow_amount_percent=0.3, 
                    shadow_tone_percent=0.4, 
                    shadow_radius=5,
                    highlight_amount_percent=0.8, 
                    highlight_tone_percent=0.5, 
                    highlight_radius=5,
                    color_percent=0.1)
            img.transformation_list.append(self.action)
    def remove_background(self):
        """
            Removes background from the image.
        """
        logger.info(self.action)
        for img in tqdm(self.image_collection, desc=f"apply {self.action}"):
            img.image_transformed = remove(img.image_transformed)
            img.transformation_list.append(self.action)
    def rotate_image(self):
        """
            Rotates the image 90 degrees counterclockwise
        """
        logger.info(self.action)
        for img in tqdm(self.image_collection, desc=f"apply {self.action}"):
            img.image_transformed = cv2.rotate(img.image_transformed, cv2.ROTATE_90_COUNTERCLOCKWISE)
            img.transformation_list.append(self.action)
    def correct_color(self):
        """
            makes sure the image color palate is correct
        """
        for img in tqdm(self.image_collection, desc=f'correct color'):
            img.image_transformed = cv2.cvtColor(img.image_transformed, cv2.COLOR_BGR2RGB)
            img.transformation_list.append("color_correction")




def arg_parse():
    # Set up command line argument parser
    parser = argparse.ArgumentParser(description='test openCV image manipulation')
    parser.add_argument('--reduce_glare', action='store_true', help='flag to indicate glare reduction')
    parser.add_argument('--remove_background', action='store_true', help='flag to remove background')
    parser.add_argument('-i', '--input', type=Path, default=CWD, help='path to input image directory')
    parser.add_argument('-o', '--output', type=Path, default=OUTPUT_DIR, help='path to output image directory')
    parser.add_argument('--image_input', type=Path, default=None, help="path to input image file")
    parser.add_argument('--image_output', type=Path, default=None, help="path to output image file")
    return parser.parse_args()
def read_images_to_collection(input_dir: Path, output_dir: Path)->list[dict]:
    # Load the input image
    image_collection = [
        Image(
            name=img_path.stem,
            image=cv2.imread(str(img_path)),
            input_dir = input_dir,
            output_dir = output_dir,
            input_path = img_path,
            output_path  = None)
        for img_path in input_dir.iterdir() if img_path.suffix in [".jpg", ".jpeg", ".png"]]
    return image_collection
def write_images_to_file(output_dir: Path, image_collection:list[dict]):
    # write images to output directory
    for imgObj in image_collection:
        logger.debug(f'name: {imgObj.name}, shape: {imgObj.image_transformed.shape}')
    [cv2.imwrite(f"{str(output_dir/imgObj.name)}_out.jpg", imgObj.image_transformed) for imgObj in image_collection]
def main():
    args = arg_parse()
    if not args.input.is_dir():
        logger.error(f'invalid input directory: {args.input} script exit')
        sys.exit(0)
    if not args.output.is_dir():
        logger.info(f'creating new output dir: {args.output}')
        args.output.mkdir(mode=0o755)
    image_collection = read_images_to_collection(args.input, args.output)
    actions = [action for action in vars(args).keys() if (type(vars(args)[action]) == bool and vars(args)[action])]
    im = ImageManipulate(image_collection, actions)
    write_images_to_file(args.output, im.image_collection)


if __name__ == '__main__':
    #main()
    pass
