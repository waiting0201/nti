#!/usr/bin/env bash
# 將 master 的新 commit 去除非公開路徑後接到 public 分支上。
#
# 為什麼需要這支腳本：git 無法對不同 remote 過濾路徑，同一分支推到哪裡內容都一樣。
# 因此維持兩條分支：master（完整）→ Remote_NAS；public（精簡）→ Remote_GitHub。
#
# 排除項（EXCLUDE）：
#   reference/  設計 PSD 與客戶素材，約 2.5GB —— 會撞上 GitHub 的 2GB 單次推送上限
#   db/local/   只在本機執行的建庫腳本，含 dev 管理員帳號雜湊，不應公開
#
# 作法：用暫存 index 重建 tree，不動工作目錄（毫秒級，不會複製 2.5GB）。
# 每個 public commit 保留來源的訊息、作者與日期，並在結尾加 X-Source-Commit 標記，
# 供下次同步判斷進度。**append-only，永遠不需要 force push。**
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

SRC=master
DST=public
EXCLUDE="reference db/local"

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
    GIT_INDEX_FILE="$tmpidx" git read-tree "$c"
    # shellcheck disable=SC2086
    GIT_INDEX_FILE="$tmpidx" git rm -r --cached -q --ignore-unmatch -- $EXCLUDE
    tree=$(GIT_INDEX_FILE="$tmpidx" git write-tree)

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

git update-ref "refs/heads/$DST" "$parent"
echo "已同步 $n 個 commit 到 ${DST}（$(git rev-parse --short "$DST")）。"
echo "推送：git push Remote_GitHub"
