#!/bin/bash

# This script optimizes all .glb models in the src/assets/3d directory.

# Directories
MODELS_DIR="src/assets/3d"
BACKUP_DIR="src/assets/3d_backup"

# Create backup directory
echo "Creating backup directory at $BACKUP_DIR..."
mkdir -p "$BACKUP_DIR"

# Find and process all .glb files
find "$MODELS_DIR" -type f -name "*.glb" | while read -r file; do
  filename=$(basename "$file")
  
  # Backup the original file
  echo "Backing up $filename..."
  cp "$file" "$BACKUP_DIR/$filename"

  # Optimize the model in place
  echo "Optimizing $filename..."
  npx gltf-transform optimize "$file" "$file" --texture-compress webp

  echo "Finished optimizing $filename."
done

echo "
All models have been optimized. Please check your application to ensure they are working correctly.
Original models are backed up in the $BACKUP_DIR directory."
