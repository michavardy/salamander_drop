

#!/bin/bash

# Set the input and output directories
input_dir="~/projects_mercury/gadi_salamanders/salamander_drop/testing/sample_dataset"
output_dir="~/projects_mercury/gadi_salamanders/salamander_drop/testing/rembg_dataset"

echo "creating output_dir ${output_dir}"
# Create the output directory if it doesn't already exist
mkdir -p $output_dir

# Loop over all PNG files in the input directory
for input_file in $input_dir/*.jpg; do
  # Extract the filename without extension
  filename=$(basename "$input_file" .png)
  # Set the output path for this file
  output_file="$output_dir/${filename}_rembg.png"
  echo "remove background for file: ${output_file}"
  # Run the rembg command on this file
  python -m rembg i "$input_file" "$output_file"
done

