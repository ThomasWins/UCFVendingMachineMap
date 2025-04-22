#!/bin/bash

cd /opt/bitnami/projects/cards

# Add only new files in uploads/
git add uploads/*

# If there’s nothing to commit, exit
if git diff --cached --quiet; then
  echo "No new uploads to commit."
  exit 0
fi

# Commit with timestamp
git commit -m "Auto-upload commit: $(date +"%Y-%m-%d %H:%M:%S")"

# Push to main
git push origin main
