#!/usr/bin/env bash
# 구글·카카오 로그인 키를 서버에만 저장합니다 (GitHub 에 올라가지 않는 .env.server 파일)
#   사용: cd ~/arrive-kr && bash deploy/set-login-keys.sh
#   · 비워 두고 엔터를 누르면 그 로그인은 꺼진 채로 둡니다. 다시 실행하면 새 값으로 바뀝니다.
set -euo pipefail
cd "$(dirname "$0")/.."
F=.env.server
old() { [ -f "$F" ] && grep -E "^$1=" "$F" | head -1 | cut -d= -f2- || true; }
echo "━━ 구글 로그인 — Google Cloud 콘솔의 'OAuth 클라이언트 ID' (…apps.googleusercontent.com)"
read -r -p "GOOGLE_CLIENT_ID [$(old GOOGLE_CLIENT_ID | cut -c1-12)…]: " G; G="${G:-$(old GOOGLE_CLIENT_ID)}"
echo "━━ 카카오 로그인 — 카카오 디벨로퍼스 > 내 애플리케이션 > 앱 키의 'REST API 키'"
read -r -p "KAKAO_REST_KEY [$(old KAKAO_REST_KEY | cut -c1-6)…]: " K; K="${K:-$(old KAKAO_REST_KEY)}"
echo "━━ (선택) 카카오 'Client Secret' 을 켰다면 그 값, 아니면 엔터"
read -r -p "KAKAO_CLIENT_SECRET: " S; S="${S:-$(old KAKAO_CLIENT_SECRET)}"
umask 077
printf 'GOOGLE_CLIENT_ID=%s\nKAKAO_REST_KEY=%s\nKAKAO_CLIENT_SECRET=%s\n' "$G" "$K" "$S" > "$F"
chmod 600 "$F"
# 서비스 설정에 이 파일 읽기가 없으면(예전 설치) 다시 깔기
if ! grep -q "EnvironmentFile" /etc/systemd/system/arrive.service 2>/dev/null; then
  REGION="$(grep -E '^Environment=AWS_REGION=' /etc/systemd/system/arrive.service | cut -d= -f3)"; REGION="${REGION:-ap-southeast-2}"
  MODEL="$(grep -E '^Environment=AI_MODEL=' /etc/systemd/system/arrive.service | cut -d= -f3-)"; MODEL="${MODEL:-global.anthropic.claude-haiku-4-5-20251001-v1:0}"
  sed -e "s#__DIR__#$(pwd)#g" -e "s#__USER__#$(whoami)#g" -e "s#__REGION__#$REGION#g" -e "s#__MODEL__#$MODEL#g" deploy/arrive.service | sudo tee /etc/systemd/system/arrive.service >/dev/null
  sudo systemctl daemon-reload
fi
sudo systemctl restart arrive
sleep 2
echo
echo "✅ 저장했어요. 지금 켜진 로그인:"
curl -fsS -X POST http://127.0.0.1:3000/api/auth -H 'content-type: application/json' -d '{"action":"config"}' && echo
