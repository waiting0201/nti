#!/usr/bin/env bash
# 將 master 的新 commit 去除非公開路徑後接到 public 分支上。
#
# 為什麼需要這支腳本：git 無法對不同 remote 過濾路徑，同一分支推到哪裡內容都一樣。
# 因此維持兩條分支：master（完整）→ Remote_NAS；public（精簡）→ Remote_GitHub。
#
# ⚠️ EXCLUDE 必須涵蓋「歷史上出現過的路徑」，不只是現在的路徑：
#   reference/   設計 PSD 與客戶素材（約 2.5GB）—— 會撞上 GitHub 的 2GB 單次推送上限
#   planning/    reference/ 的前身（2026-06 改名前），同一批 PSD 與客戶品牌識別檔（2,479MB）
#   mockup/      靜態切版稿與圖片（66MB，今已 gitignore，但舊 commit 仍帶著）
#   mockup2/     同上，未採用的版本
#   .wrangler/   Cloudflare 部署快取
#   db/local/    只在本機執行的建庫腳本，含 dev 管理員帳號雜湊
#
# 結尾的體積斷言才是真正的安全網：路徑清單永遠可能漏掉某個歷史目錄，體積檢查不會。
# 兩層，各防各的失效模式：
#   MAX_BLOB_MB  單一檔案上限 —— reference/ 這類目錄的特徵就是「少數幾個巨大的二進位檔」，
#                這條當場擋下，且不隨原始碼成長漂移（目前最大的 blob 是 0.27MB）
#   MAX_PACK_MB  封包總量上限 —— 對應 GitHub 的 2GB 單次推送上限（目前 2.1MB）
#
# ⚠️ 量的是「封包後」而不是未壓縮總和。未壓縮總和把每個檔案的每一版都算一次全文，
#    純文字又壓得很兇，兩者差約 7 倍：2026-09-09 未壓縮 15.5MB、實際封包 2.1MB。
#    早期用未壓縮總和配 20MB 上限，會被 EF migration 的正常成長先撐爆
#    （每支 migration 固定多 ~440KB：新的 *.Designer.cs 加上改寫一版的 ModelSnapshot），
#    到時候擋下推送、訊息卻寫「EXCLUDE 漏了大目錄」—— 一個會謊報的安全網。
#
# 作法：用暫存 index 重建 tree，不動工作目錄。每個 public commit 保留來源的訊息、
# 作者與日期，並加註 X-Source-Commit 供下次判斷進度。append-only，永不需要 force push。
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

SRC=master
DST=public
EXCLUDE="reference planning mockup mockup2 .wrangler db/local"
MAX_PACK_MB=50    # 封包總量（2026-09-09 為 2.1MB）
MAX_BLOB_MB=2     # 單一檔案（2026-09-09 最大 0.27MB）

if git rev-parse --verify -q "refs/heads/$DST" >/dev/null; then
    parent=$(git rev-parse "$DST")
    last=$(git log -1 --format=%B "$DST" | sed -n 's/^X-Source-Commit: //p' | tail -1)
else
    parent=""
    last=""
fi

range="$SRC"
[ -n "$last" ] && range="$last..$SRC"

commits=$(git rev-list --reverse "$range" 2>/dev/null || true)
if [ -z "$commits" ]; then
    echo "public 已與 $SRC 同步，無需動作。"
    exit 0
fi

tmpidx=$(mktemp -t nti-sync-idx)
trap 'rm -f "$tmpidx"' EXIT

n=0
for c in $commits; do
    rm -f "$tmpidx"
    export GIT_INDEX_FILE="$tmpidx"
    git read-tree "$c"
    # 純 index plumbing：不碰工作目錄，也不做 git rm 的工作目錄掃描（快上數千倍）
    # shellcheck disable=SC2086
    git ls-files -z -- $EXCLUDE | xargs -0 -r git update-index --force-remove --
    tree=$(git write-tree)
    unset GIT_INDEX_FILE

    GIT_AUTHOR_NAME=$(git log -1 --format=%an "$c")
    GIT_AUTHOR_EMAIL=$(git log -1 --format=%ae "$c")
    GIT_AUTHOR_DATE=$(git log -1 --format=%aI "$c")
    GIT_COMMITTER_NAME=$(git log -1 --format=%cn "$c")
    GIT_COMMITTER_EMAIL=$(git log -1 --format=%ce "$c")
    GIT_COMMITTER_DATE=$(git log -1 --format=%cI "$c")
    export GIT_AUTHOR_NAME GIT_AUTHOR_EMAIL GIT_AUTHOR_DATE \
           GIT_COMMITTER_NAME GIT_COMMITTER_EMAIL GIT_COMMITTER_DATE

    msg="$(git log -1 --format=%B "$c")
X-Source-Commit: $c"

    if [ -n "$parent" ]; then
        new=$(printf '%s\n' "$msg" | git commit-tree "$tree" -p "$parent")
    else
        new=$(printf '%s\n' "$msg" | git commit-tree "$tree")
    fi
    parent=$new
    n=$((n + 1))
    printf '  %s → %s  %s\n' "$(git rev-parse --short "$c")" "$(git rev-parse --short "$new")" \
        "$(git log -1 --format=%s "$c")"
done

# 第一層：單一檔案。漏網的素材目錄會在這裡當場現形，附上檔名。
big=$(git rev-list --objects "$parent" \
    | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' 2>/dev/null \
    | awk -v max="$((MAX_BLOB_MB * 1048576))" '$1=="blob" && $3+0>max {
          p=""; for (i=4; i<=NF; i++) p = p (i>4 ? " " : "") $i
          if (p == "") p = "(無路徑)"
          printf "%8.2f MB  %s\n", $3/1048576, p
      }' | sort -rn | head -5)

if [ -n "$big" ]; then
    echo "" >&2
    echo "中止：$DST 的歷史含超過 ${MAX_BLOB_MB} MB 的檔案。" >&2
    echo "$big" >&2
    echo "  多半代表 EXCLUDE 漏掉了某個（可能只存在於舊 commit 的）素材目錄。" >&2
    echo "  $DST 分支未更新。" >&2
    exit 1
fi

# 第二層：封包總量，即實際推給 GitHub 的位元組數。
pack_mb=$(git rev-list --objects "$parent" | awk '{print $1}' \
    | git pack-objects --stdout 2>/dev/null | wc -c \
    | awk '{printf "%.1f", $1/1048576}')

if [ "$(printf '%.0f' "$pack_mb")" -gt "$MAX_PACK_MB" ]; then
    echo "" >&2
    echo "中止：$DST 封包後 ${pack_mb} MB，超過上限 ${MAX_PACK_MB} MB。" >&2
    echo "  單檔都在上限內卻總量過大，代表混進了大量檔案而不是單一大檔。" >&2
    echo "  查法：git rev-list <sha> | while read c; do git ls-tree --name-only \$c; done | sort -u" >&2
    echo "  $DST 分支未更新。" >&2
    exit 1
fi

git update-ref "refs/heads/$DST" "$parent"
echo "已同步 $n 個 commit 到 ${DST}（$(git rev-parse --short "$DST")），封包後 ${pack_mb} MB。"
echo "推送：git push Remote_GitHub"
