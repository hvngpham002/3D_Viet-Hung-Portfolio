#!/bin/bash

# This script removes all PNG and JPG images in the public/images and public/icons directories.

# Find all .png and .jpg files in the specified directories and delete them
find public/images public/icons -type f \( -name "*.png" -o -name "*.jpg" \) -delete

echo "Image removal complete."
