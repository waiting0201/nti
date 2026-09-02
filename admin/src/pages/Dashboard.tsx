import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as api from '@/api/client'
import { UNITS } from '@/units'
import { isComplete } from '@/lib/completeness'
import { AUDIT_LOG } from '@/api/seed.manual'
import { useAuth } from '@/lib/auth'
import { Notice } from '@/components/ui'

/** docs §00：四張數字卡 + 最近 20 筆操作紀錄，點卡片跳到已篩選的清單 */
export function Dashboard() {
  const { session, can } = useAuth()
  const [stats, setStats] = useState({ quote: 0, contact: 0, incomplete: 0, expiring: 0 })

  useEffect(() => {
    void (async () => {
      const [quotes, contacts] = await Promise.all([api.listAll('quote'), api.listAll('contact')])
      const pendingQuote = quotes.filter((r) => r.status === 'New' || r.status === 'InProgress').length
      const pendingContact = contacts.filter((r) => r.status === 'New').length

      let incomplete = 0
      let expiring = 0
      const soon = Date.now() + 7 * 24 * 3600 * 1000
      for (const unit of UNITS) {
        if (unit.custom || unit.readOnly) continue
        const rows = await api.listAll(unit.code)
        for (const r of rows) {
          if (!isComplete(unit, r, 'zh') || !isComplete(unit, r, 'en')) incomplete++
          if (r.unpublishAt) {
            const t = new Date(String(r.unpublishAt)).getTime()
            if (t > Date.now() && t < soon) expiring++
          }
        }
      }
      setStats({ quote: pendingQuote, contact: pendingContact, incomplete, expiring })
    })()
  }, [])

  return (
    <>
      <div className="page-h">
        <h1>待辦總覽</h1>
        <div className="sub">
          {session?.displayName}，歡迎回來。以下是需要有人處理的事。
        </div>
      </div>

      <div className="stat-grid">
        {can('quote.view') && (
          <Link className={`stat ${stats.quote ? 'alert' : ''}`} to="/u/quote?status=New">
            <div className="n">{stats.quote}</div>
            <div className="l">待處理報價需求</div>
          </Link>
        )}
        {can('contact.view') && (
          <Link className={`stat ${stats.contact ? 'alert' : ''}`} to="/u/contact?status=New">
            <div className="n">{stats.contact}</div>
            <div className="l">待處理聯絡訊息</div>
          </Link>
        )}
        <Link className="stat" to="/u/news">
          <div className="n">{stats.incomplete}</div>
          <div className="l">中英未對齊的內容</div>
        </Link>
        <Link className="stat" to="/u/news?status=published">
          <div className="n">{stats.expiring}</div>
          <div className="l">7 天內即將下架</div>
        </Link>
      </div>

      {!can('quote.view') && (
        <Notice kind="info" >你的角色看不到報價與聯絡訊息，所以這裡只列內容相關的待辦。</Notice>
      )}

      {can('audit.view') && (
        <div className="card" style={{ marginTop: 18 }}>
          <div className="card-h">
            <h2>最近操作紀錄</h2>
            <Link className="btn btn-sm" style={{ marginLeft: 'auto' }} to="/u/audit">
              全部紀錄
            </Link>
          </div>
          <table className="list">
            <thead>
              <tr>
                <th style={{ width: 170 }}>時間</th>
                <th style={{ width: 140 }}>管理員</th>
                <th style={{ width: 70 }}>動作</th>
                <th>對象</th>
              </tr>
            </thead>
            <tbody>
              {AUDIT_LOG.slice(0, 8).map((a) => (
                <tr key={a.id}>
                  <td>{a.at.replace('T', ' ').replace('Z', '')}</td>
                  <td>{a.actor}</td>
                  <td>{a.action}</td>
                  <td>{a.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
