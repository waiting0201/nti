# Claude Code Harness 設定說明

本文件記錄此專案使用 Claude Code（Anthropic 官方 CLI agent）的相關設定與慣例，供協作者了解開發環境如何運作。

## 一、目錄結構

```
NTI/
├── CLAUDE.md                  # 專案規範與索引（agent 每次載入）
├── .claude/
│   └── settings.local.json    # 本機 harness 設定（權限等，不進版控）
├── docs/                      # 文件區
│   ├── harness.md             # 本檔，harness 設定說明
│   └── reference-website-analysis.md
└── planning/                  # 規劃案原始文件
```

## 二、settings.local.json（權限設定）

位置：`.claude/settings.local.json`

目前已允許的指令（避免每次執行都跳出權限確認）：

| 權限 | 用途 |
|------|------|
| `Bash(python3 -c ":*")` | 執行 inline Python |
| `Bash(pip3 install python-pptx)` | 安裝簡報產生套件 |
| `Bash(python3 generate_pptx.py)` | 產生規劃書 PPTX |
| `Bash(python3:*)` | 一般 Python 指令 |

> `settings.local.json` 為本機個人設定，通常不納入版控。若要團隊共用設定，改寫入 `.claude/settings.json`。
> 調整權限可用 `/permissions` 或 `update-config` skill。

## 三、可用的 Skills（斜線指令）

此 harness 內建多個 skill，常用於本專案：

| Skill | 用途 |
|-------|------|
| `frontend-design` | 產生高品質前端介面（建置官網頁面時使用） |
| `run` | 啟動並驗證專案 app |
| `verify` | 實際執行 app 驗證改動是否如預期 |
| `review` / `security-review` | 程式碼／安全審查 |
| `init` | 初始化 CLAUDE.md |
| `update-config` | 調整 harness 設定（權限、env、hooks） |

## 四、Memory（持久記憶）

Agent 具備檔案式持久記憶，位於使用者層級：
`~/.claude/projects/-Users-tim-webapps-NTI/memory/`

用於跨 session 記住使用者偏好、專案決策等。專案本身的規範請寫入 `CLAUDE.md`，而非 memory。

## 五、慣例

- 文件一律放 `docs/`，規劃原始檔放 `planning/`。
- `CLAUDE.md` 為單一索引入口，新增重要文件時於其中補上連結。
- 此專案目前**非 git repo**；若要進版控需先 `git init`。
