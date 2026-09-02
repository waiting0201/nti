#!/usr/bin/env bash
# 把 mockup/assets 上傳到 Azure Blob Storage 的 assets 容器。
#
# 為什麼要這樣做：素材 127 檔、63MB。留在 apps/web/public/assets 的話，
#   1. 吃掉 SWA Free 方案 250MB 上限的四分之一（docs/07 §7.1）；
#   2. mockup/ 未進版控，CI checkout 之後沒有這些檔案，會建出缺圖但 build 成功的站。
#
# 上傳之後，公開站與後台以環境變數指向 Blob：
#   apps/web   NEXT_PUBLIC_MEDIA_BASE=https://<account>.blob.core.windows.net
#   apps/admin VITE_MEDIA_BASE=https://<account>.blob.core.windows.net
# 容器名就叫 assets，所以只要補前綴，路徑本身不用改寫。
#
# 用法：
#   AZ_STORAGE_ACCOUNT=stntiprod tools/upload-assets.sh
#
# 需要對該儲存體有 **Storage Blob Data Contributor** 角色（--auth-mode login 走 AAD，
# 不用帳戶金鑰，也就不會有金鑰落到本機或 CI 環境變數裡）。
set -euo pipefail

: "${AZ_STORAGE_ACCOUNT:?請設定 AZ_STORAGE_ACCOUNT（例：stntiprod）}"
CONTAINER="${AZ_CONTAINER:-assets}"
SRC="$(cd "$(dirname "$0")/.." && pwd)/mockup/assets"

[ -d "$SRC" ] || { echo "找不到素材來源：$SRC" >&2; exit 1; }

echo "來源：${SRC}（$(find "$SRC" -type f | wc -l | tr -d ' ') 檔，$(du -sh "$SRC" | cut -f1)）"
echo "目標：$AZ_STORAGE_ACCOUNT / $CONTAINER"

# Cache-Control 只給 1 天：檔名沒有內容雜湊（logo.svg 就叫 logo.svg），
# 設成 immutable 的話換圖之後 CDN 與瀏覽器會抱著舊檔不放。
az storage blob upload-batch \
  --account-name "$AZ_STORAGE_ACCOUNT" \
  --destination "$CONTAINER" \
  --source "$SRC" \
  --overwrite \
  --content-cache "public, max-age=86400" \
  --auth-mode login \
  --output none

# img-size.js 只供 mockup 檢視用，正式站不掛載（與 apps/web/scripts/sync-assets.mjs 一致）
az storage blob delete \
  --account-name "$AZ_STORAGE_ACCOUNT" \
  --container-name "$CONTAINER" \
  --name img-size.js \
  --auth-mode login \
  --output none 2>/dev/null || true

echo "✓ 上傳完成：https://${AZ_STORAGE_ACCOUNT}.blob.core.windows.net/${CONTAINER}/"
