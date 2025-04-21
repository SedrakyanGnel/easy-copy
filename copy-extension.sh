#!/bin/bash

# Get the name of the current directory
EXTENSION_NAME=$(basename "$(pwd)")

# Copy the current directory to $HOME/.vscode/extensions
cp -r "$(pwd)" "$HOME/.vscode/extensions/$EXTENSION_NAME"

echo "Extension copied to $HOME/.vscode/extensions/$EXTENSION_NAME"
