import argparse
import cv2
import os
from pathlib import Path

CWD = Path.cwd()
INPUT = CWD.stem
OUTPUT = f'{INPUT}_out'
OUTPUT_DIR = CWD.parent / OUTPUT


def arg_parse():
    # Set up command line argument parser
    parser = argparse.ArgumentParser(description='test openCV image manipulation')
    parser.add_argument('--glare', action='store_true', help='flag to indicate glare reduction')
    parser.add_argument('-i', '--input', type=Path, default=CWD, help='path to input image directory')
    parser.add_argument('-o', '--output', type=Path, default=OUTPUT_DIR, help='path to output image directory')
    parser.add_argument('--image_dir', type=str, default="", help="")
    return parser.parse_args()

def reduce_glare(input_path, output_path):
    # Load the input image
    img = cv2.imread(input_path)

    # Convert the image to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Apply a Gaussian blur to the grayscale image
    blurred = cv2.GaussianBlur(gray, (11, 11), 0)

    # Apply adaptive thresholding to the blurred image
    thresh = cv2.adaptiveThreshold(blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 11, 2)

    # Invert the thresholded image
    thresh = cv2.bitwise_not(thresh)

    # Perform morphological opening to remove small objects
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3,3))
    opening = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel, iterations=1)

    # Perform morphological closing to fill in gaps
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5,5))
    closing = cv2.morphologyEx(opening, cv2.MORPH_CLOSE, kernel, iterations=3)

    # Apply the closing as a mask to the original image
    result = cv2.bitwise_and(img, img, mask=closing)

    # Save the result
    cv2.imwrite(output_path, result)

def main():
    args = arg_parse()
    print(args)


if __name__ == '__main__':
    main()