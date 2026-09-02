#!/usr/bin/env bash
# 本機一鍵建置：建庫 → migrations → seed → dev 帳號 → 驗證
#   用法： db/tools/run-local.sh
# 可重複執行（冪等）：第二次跑應該零錯誤，且 verify 輸出與第一次相同。
set -euo pipefail
cd "$(dirname "$0")/../.."

[ -f db/.env.local ] || { echo "ERROR: 缺少 db/.env.local，請由 db/.env.local.example 複製" >&2; exit 1; }
set -a; . ./db/.env.local; set +a

SQLCMD=db/tools/sqlcmd.sh

echo "== 建立資料庫 NTI（若已存在則跳過）"
"$SQLCMD" master < db/local/000_create_database.sql

for f in db/migrations/*.sql; do
  echo "== migration: $f"
  "$SQLCMD" NTI < "$f"
done

for f in db/seed/*.sql; do
  echo "== seed: $f"
  "$SQLCMD" NTI < "$f"
done

echo "== dev 專用管理員（不進 prod）"
"$SQLCMD" NTI < db/local/910_seed_dev_admin.sql

echo "== 驗證"
"$SQLCMD" NTI < db/verify/verify.sql
