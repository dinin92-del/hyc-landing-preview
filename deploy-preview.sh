#!/usr/bin/env bash
# Deploy WIP landing to the preview repo — never touches gethyc.com.
#   cd landing && ./deploy-preview.sh
set -euo pipefail
cd "$(dirname "$0")"
REPO="dinin92-del/hyc-landing-preview" exec ./deploy-ghpages.sh
