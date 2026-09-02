#!/usr/bin/env bash
# 薄封裝：把 stdin 的 SQL 丟進本機 Docker SQL Server 執行。
#   用法： db/tools/sqlcmd.sh [資料庫名] < some.sql
#   預設連 NTI；建庫階段請傳 master。
#
# 旗標說明（三個都不能省）：
#   -C  信任伺服器憑證（mssql-tools18 預設強制加密，容器用自簽憑證）
#   -b  發生錯誤即中止並回傳非 0（讓 run-local.sh 的 set -e 生效）
#   -I  QUOTED_IDENTIFIER ON — sqlcmd 預設是 OFF，而 filtered index
#       （UX_Vlog_MainFeature 等）在 OFF 下建立會直接失敗
set -euo pipefail

DB="${1:-NTI}"
CONTAINER="${SQL_CONTAINER:-sqlserver}"

if [ -z "${SQLCMDPASSWORD:-}" ]; then
  echo "ERROR: SQLCMDPASSWORD 未設定。請先 'source db/.env.local'（範本見 db/.env.local.example）" >&2
  exit 1
fi

docker exec -i -e SQLCMDPASSWORD="$SQLCMDPASSWORD" "$CONTAINER" \
  /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -C -b -I -d "$DB"
