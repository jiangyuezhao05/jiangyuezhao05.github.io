#!/usr/bin/env bash

set -euo pipefail

preview_port="${1:-4180}"

bundle exec jekyll serve \
  --host 127.0.0.1 \
  --port "${preview_port}" \
  --livereload \
  --config _config.yml
