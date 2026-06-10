#!/usr/bin/env bash
set -euo pipefail

# gd-plan remote installer (bootstrap)
#
# Usage:
#   bash <(curl -fsSL https://raw.githubusercontent.com/pgaey/gd-plan/main/get.sh) <target-dir>
#   bash <(curl -fsSL ...) --yes <target-dir>
#   bash <(curl -fsSL ...) --version 0.2.0 <target-dir>
#   bash get.sh --src /path/to/checkout <target-dir>   # 로컬 모드 (테스트·오프라인)
#
# 구조: get.sh 는 얇은 부트스트랩 — tar.gz 1요청 다운로드 + 해제 후
#       archive 안의 install.sh 에 위임한다 (harness-kit 동형, ADR-016).

REPO="pgaey/gd-plan"
VERSION=""
SRC_DIR=""
YES_FLAG=""
TARGET_DIR=""

usage() {
  cat <<EOF
Usage:
  bash <(curl -fsSL https://raw.githubusercontent.com/${REPO}/main/get.sh) [options] <target-dir>

Options:
  --version <ver>   특정 버전 설치 (git tag v<ver> 기준)
  --src <dir>       로컬 체크아웃에서 설치 (다운로드 생략 — 테스트·오프라인)
  --yes             모든 프롬프트 자동 수락
  --help            이 도움말 출력
EOF
}

while [ $# -gt 0 ]; do
  case "$1" in
    --help)    usage; exit 0 ;;
    --version) VERSION="$2"; shift 2 ;;
    --src)     SRC_DIR="$2"; shift 2 ;;
    --yes)     YES_FLAG="--yes"; shift ;;
    -*)        printf '알 수 없는 옵션: %s\n' "$1" >&2; usage >&2; exit 1 ;;
    *)         TARGET_DIR="$1"; shift ;;
  esac
done

if [ -z "$TARGET_DIR" ]; then
  printf '✗ target-dir 가 필요합니다 (현재 repo 오설치 방지를 위해 필수)\n' >&2
  usage >&2
  exit 1
fi

if [ -n "$SRC_DIR" ]; then
  # 로컬 모드: 다운로드 생략
  if [ ! -f "$SRC_DIR/install.sh" ]; then
    printf '✗ --src 디렉토리에 install.sh 가 없음: %s\n' "$SRC_DIR" >&2
    exit 1
  fi
  bash "$SRC_DIR/install.sh" "$TARGET_DIR" $YES_FLAG
  exit $?
fi

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

if [ -n "$VERSION" ]; then
  TAR_URL="https://github.com/${REPO}/archive/refs/tags/v${VERSION}.tar.gz"
else
  TAR_URL="https://github.com/${REPO}/archive/refs/heads/main.tar.gz"
fi

printf '[get] gd-plan 다운로드 중... (%s)\n' "$TAR_URL"
if ! curl -fsSL "$TAR_URL" -o "$TMP_DIR/gd-plan.tar.gz"; then
  printf '[get] ✗ 다운로드 실패: %s\n' "$TAR_URL" >&2
  printf '[get]   --version 지정 시 git tag v%s 가 존재하는지 확인하세요.\n' "${VERSION:-}" >&2
  exit 1
fi

tar -xzf "$TMP_DIR/gd-plan.tar.gz" -C "$TMP_DIR"

SRC_ROOT="$(find "$TMP_DIR" -maxdepth 1 -type d -name "gd-plan-*" | head -1)"
if [ -z "$SRC_ROOT" ] || [ ! -f "$SRC_ROOT/install.sh" ]; then
  printf '[get] ✗ 압축 해제 실패: gd-plan 디렉토리/install.sh 를 찾을 수 없음\n' >&2
  exit 1
fi

bash "$SRC_ROOT/install.sh" "$TARGET_DIR" $YES_FLAG
