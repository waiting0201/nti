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
# 結尾的 MAX_MB 斷言才是真正的安全網：路徑清單永遠可能漏掉某個歷史目錄，體積檢查不會。
#
# 作法：用暫存 index 重建 tree，不動工作目錄。每個 public commit 保留來源的訊息、
# 作者與日期，並加註 X-Source-Commit 供下次判斷進度。append-only，永不需要 force push。
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

SRC=master
DST=public
EXCLUDE="reference planning mockup mockup2 .wrangler db/local"
MAX_MB=20

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

total_mb=$(git rev-list --objects "$parent" | awk '{print $1}' \
    | git cat-file --batch-check='%(objectsize)' 2>/dev/null \
    | awk '{s+=$1} END {printf "%.1f", s/1048576}')

if [ "$(printf '%.0f' "$total_mb")" -gt "$MAX_MB" ]; then
    echo "" >&2
    echo "中止：$DST 全歷史可達物件 ${total_mb} MB，超過上限 ${MAX_MB} MB。" >&2
    echo "  代表 EXCLUDE 漏掉了某個（可能只存在於舊 commit 的）大目錄。" >&2
    echo "  查法：git rev-list <sha> | while read c; do git ls-tree --name-only \$c; done | sort -u" >&2
    echo "  $DST 分支未更新。" >&2
    exit 1
fi

git update-ref "refs/heads/$DST" "$parent"
echo "已同步 $n 個 commit 到 ${DST}（$(git rev-parse --short "$DST")），全歷史 ${total_mb} MB。"
echo "推送：git push Remote_GitHub"
