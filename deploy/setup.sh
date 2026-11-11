#!/usr/bin/env bash
# 대회 서버(Ubuntu 24.04)에 ArriveKR 을 한 번에 설치합니다.
#   사용: cd ~/arrive-kr && bash deploy/setup.sh
#   · Node 22 · Caddy(https 자동) 설치 → 빌드 → AI(Bedrock) 연결 확인 → 서비스 등록 → https 주소 열기
#   · 여러 번 실행해도 괜찮습니다.
set -euo pipefail
APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
IP="$(curl -fsS --max-time 5 https://checkip.amazonaws.com || true)"; IP="${IP:-16.178.153.55}"
DOMAIN="${DOMAIN:-$(echo "$IP" | tr . -).sslip.io}"
REGION="$(aws configure get region 2>/dev/null || true)"; REGION="${REGION:-${AWS_REGION:-ap-southeast-2}}"
MODEL="${AI_MODEL:-global.anthropic.claude-haiku-4-5-20251001-v1:0}"

echo "━━ 1/6 Node 22 설치"
if ! node -v 2>/dev/null | grep -qE '^v(2[0-9]|[3-9][0-9])\.'; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi
node -v

echo "━━ 2/6 Caddy(https) 설치"
command -v caddy >/dev/null || { sudo apt-get update -y; sudo apt-get install -y caddy; }

echo "━━ 3/6 빌드 (1~2분)"
cd "$APP_DIR"
npm ci --no-audit --no-fund
npm run build

echo "━━ 4/6 AI(Bedrock) 연결 확인 — 지역 $REGION"
AWS_REGION="$REGION" AI_PROVIDER=bedrock AI_MODEL="$MODEL" node deploy/check-ai.mjs || echo "⚠ AI 연결 확인 실패 — 사이트는 열리고, AI 기능만 기본 설명으로 동작합니다. 멘토에게 문의하세요."

echo "━━ 5/6 서비스 등록 (서버가 재시작돼도 자동 실행)"
sed -e "s#__DIR__#$APP_DIR#g" -e "s#__USER__#$(whoami)#g" -e "s#__REGION__#$REGION#g" -e "s#__MODEL__#$MODEL#g" deploy/arrive.service | sudo tee /etc/systemd/system/arrive.service >/dev/null
sudo systemctl daemon-reload
sudo systemctl enable arrive >/dev/null 2>&1 || true
sudo systemctl restart arrive
sleep 2
curl -fsS http://127.0.0.1:3000/healthz && echo " ← 앱 실행 중"

echo "━━ 6/6 https 주소 열기: $DOMAIN"
sudo tee /etc/caddy/Caddyfile >/dev/null <<CADDY
$DOMAIN {
	encode gzip
	reverse_proxy 127.0.0.1:3000
}
http://$IP {
	redir https://$DOMAIN{uri}
}
CADDY
sudo systemctl enable caddy >/dev/null 2>&1 || true
sudo systemctl restart caddy

echo
echo "✅ 완료 — 1분쯤 뒤 브라우저에서 여세요:  https://$DOMAIN"
echo "   (http://$IP 로 들어가도 위 주소로 넘어갑니다)"
echo "   상태: sudo systemctl status arrive   ·   기록: journalctl -u arrive -f"
