#!/bin/bash

# This script converts all PNG and JPG images in the public/images and public/icons directories to WebP format.

# Find all .png and .jpg files in the specified directories
find public/images public/icons -type f \( -name "*.png" -o -name "*.jpg" \) -print0 | while IFS= read -r -d $'\0' file; do
  # Get the output file name
  output_file="${file%.*}.webp"

  # Convert the image to WebP
  /opt/homebrew/bin/cwebp -q 80 "$file" -o "$output_file"

  # Optional: Remove the original file
  # rm "$file"
done

echo "Image conversion complete."