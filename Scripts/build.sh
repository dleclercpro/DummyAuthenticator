#!/bin/bash

# Get the directory containing the script
dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Define constant image details
user="dleclercpro"
app="dummy-authenticator"
release="latest"

# Build app image and push it to DockerHub
docker buildx build --platform linux/amd64,linux/arm64 -t $user/$app:$release -f ./Dockerfile . --push