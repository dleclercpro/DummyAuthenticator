#!/bin/bash

# Get the directory containing the script
dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Define constant image details
user="dleclercpro"
app="dummy-authenticator"
release="latest"

# Build app image
docker build -t $user/$app:$release -f Dockerfile .

# Push app image to Dockerhub
docker push $user/$app:$release