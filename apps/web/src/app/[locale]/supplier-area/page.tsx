import type { Metadata } from 'next'
import { A } from '@/components/A'
import { SupplierDownloads, SupplierNotices, SupplierSpecs } from '@/components/cms'
import { getSupplierDownloads, getSupplierNotices, getSupplierSpecs } from '@/lib/api'
import { pageMetadata, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/supplier-area", {
    title: "Supplier Area — NTI Printing",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  const [notices, specs, downloads] = await Promise.all([
    getSupplierNotices(locale),
    getSupplierSpecs(locale),
    getSupplierDownloads(locale),
  ])
  return (
    <>
      <section className="section"><div className="wrap">
        <h1 className="sec-title reveal">Supplier Area</h1>
        <div className="sec-sub reveal">Announcements, specifications and downloadable documents for NTI Printing&rsquo;s supply partners.</div>
        <div className="sa-grid">
          <div className="reveal">
            <h2 className="sa-h">Supplier Announcements</h2>
            {notices?.length ? (
              <SupplierNotices items={notices} />
            ) : (
            <div>
            <A href="#" className="notice"><span className="nd">2026.06.20</span><span className="nt">Policy</span><span className="ns">Updated incoming board moisture tolerance — effective August 1</span></A>{' '}
            <A href="#" className="notice"><span className="nd">2026.05.30</span><span className="nt">ESG</span><span className="ns">Carbon data request: 2026 H1 upstream footprint submission opens</span></A>{' '}
            <A href="#" className="notice"><span className="nd">2026.05.12</span><span className="nt">Quality</span><span className="ns">Revised IQC sampling plan for ink and coating deliveries</span></A>{' '}
            <A href="#" className="notice"><span className="nd">2026.04.08</span><span className="nt">Logistics</span><span className="ns">New dock scheduling system goes live — booking guide inside</span></A>{' '}
            <A href="#" className="notice"><span className="nd">2026.03.15</span><span className="nt">Policy</span><span className="ns">Annual supplier evaluation criteria for 2026 published</span></A>
            </div>
            )}
            <h2 className="sa-h mt">Specifications &amp; Requirements</h2>
            {specs?.length ? (
              <SupplierSpecs items={specs} />
            ) : (
            <div className="spec-grid">
            <div className="spec"><h3>Board &amp; Paper Specifications</h3><p>Grammage tolerance, moisture range, FSC™ documentation and pallet requirements.</p></div>
            <div className="spec"><h3>Ink &amp; Coating Requirements</h3><p>Low-VOC thresholds, food-contact compliance certificates and batch COA format.</p></div>
            <div className="spec"><h3>Delivery &amp; Packaging Rules</h3><p>Labeling, palletization, dock booking and lead-time commitments.</p></div>
            <div className="spec"><h3>ESG Data Reporting</h3><p>Upstream carbon data format and submission schedule for supply partners.</p></div>
            </div>
            )}
          </div>
          <div className="dl-panel reveal" data-d="1">
            <h2><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8FB954" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>Download Area</h2>
            {downloads?.length ? (
              <SupplierDownloads items={downloads} />
            ) : (
            <div className="dl-list">
              <A href="#" className="dl-item"><span className="dl-type">PDF</span><span className="dl-name">Supplier Handbook 2026 (EN)</span><span className="dl-size">2.4 MB</span></A>{' '}
              <A href="#" className="dl-item"><span className="dl-type">PDF</span><span className="dl-name">Incoming Material Quality Standard</span><span className="dl-size">1.1 MB</span></A>{' '}
              <A href="#" className="dl-item"><span className="dl-type">XLSX</span><span className="dl-name">Carbon Data Submission Template</span><span className="dl-size">86 KB</span></A>{' '}
              <A href="#" className="dl-item"><span className="dl-type">PDF</span><span className="dl-name">Dock Booking Guide</span><span className="dl-size">640 KB</span></A>{' '}
              <A href="#" className="dl-item"><span className="dl-type">DOCX</span><span className="dl-name">Supplier Code of Conduct (signature copy)</span><span className="dl-size">120 KB</span></A>
            </div>
            )}
            <p className="dl-note">Supplier login will be required for controlled documents once the member system is live.</p>
          </div>
        </div>
      </div></section>
    </>
  )
}
