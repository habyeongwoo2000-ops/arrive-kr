#!/usr/bin/env bash
# GitHub 에 새로 올린 코드를 서버에 반영합니다:  cd ~/arrive-kr && bash deploy/update.sh
set -euo pipefail
cd "$(dirname "$0")/.."
git pull --ff-only
npm ci --no-audit --no-fund
npm run build
sudo systemctl restart arrive
sleep 2 && curl -fsS http://127.0.0.1:3000/healthz && echo " ← 새 버전 실행 중"
