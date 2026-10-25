import type { Metadata } from 'next'
import { T } from '@/lib/t'
import { PageBanner, PageMidBanner } from '@/components/cms'
import { bannerSrc, cmsMedia, getPage, midBannerSrc } from '@/lib/api'
import { A } from '@/components/A'
import { VideoJsonLd } from '@/components/VideoJsonLd'
import { TourGallery, type TourPhoto } from '@/components/behaviors/TourGallery'
import { mediaUrl, youtubeEmbedSrc } from '@/lib/media'
import { pageMetadata, withLocale, type Locale } from '@/lib/i18n'

type Props = { params: Promise<{ locale: Locale }> }

/** 沒接 API 時的英文相簿：mockup 那 12 張（舊站 /home/factory 的相簿；db/content 匯入的也是這 12 張） */
const MOCKUP_PHOTOS: TourPhoto[] = [
  { src: mediaUrl("/assets/fac-gallery-01.webp"), alt: "NTI Printing headquarters — building exterior" },
  { src: mediaUrl("/assets/fac-gallery-02.webp"), alt: "NTI Printing headquarters at night" },
  { src: mediaUrl("/assets/fac-gallery-03.webp"), alt: "Ground-floor lobby" },
  { src: mediaUrl("/assets/fac-gallery-04.webp"), alt: "Ground-floor lobby reception lounge" },
  { src: mediaUrl("/assets/fac-gallery-05.webp"), alt: "Ground-floor meeting room" },
  { src: mediaUrl("/assets/fac-gallery-06.webp"), alt: "Second-floor staff restaurant" },
  { src: mediaUrl("/assets/fac-gallery-07.webp"), alt: "Second-floor office" },
  { src: mediaUrl("/assets/fac-gallery-08.webp"), alt: "Second-floor pantry" },
  { src: mediaUrl("/assets/fac-gallery-09.webp"), alt: "Fourth-floor operations room" },
  { src: mediaUrl("/assets/fac-gallery-10.webp"), alt: "Second-floor post-press production area" },
  { src: mediaUrl("/assets/fac-gallery-11.webp"), alt: "Ground-floor paper cutting area" },
  { src: mediaUrl("/assets/fac-gallery-12.webp"), alt: "Offset press line on the production floor" },
]

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return pageMetadata(locale, "/facility-tour", {
    title: "Factory Tour — NTI Printing",
    description: "Tour NTI's fully air-conditioned printing plant in Tainan — production floor, wastewater treatment and staff facilities. Visits by appointment, Mon–Fri.",
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  // 後台「頁面文字」的覆寫（單元 15）；沒接 API 或沒改過就是 undefined，照 mockup 原文
  const page = await getPage(locale, 'facility-tour')
  // 頁面影片（單元 15 該頁的「頁面影片」），只有中文版顯示；沒接 API 或沒填就是 mockup 那支
  const video = youtubeEmbedSrc(page?.youtubeId, "https://www.youtube.com/embed/vECuYIiFSSM")
  // 英文版的相簿（單元 15 該頁英文分頁的「相簿照片」）；中文版是影片。
  // 沒接 API → mockup 那三張；接了 API 但後台一張都沒放 → 空陣列，整塊不顯示
  const photos = page
    ? (page.galleryImages ?? []).map((g) => ({ src: cmsMedia(g.imagePath), alt: g.imageAlt }))
    : MOCKUP_PHOTOS
  const l = withLocale(locale)
  return (
    <T locale={locale} overrides={page?.texts}>
      <PageBanner src={bannerSrc(page, "/assets/fac-tour-main.webp")} alt="Inside the NTI factory floor — palletised packaging stock and clean production aisles" />
      <section className="section subhead"><div className="wrap">
        <div className="crumb reveal"><A href={l("/")}>Home</A><span>&rsaquo;</span><A href={l("/differences")}>About Us</A><span>&rsaquo;</span><A href={l("/facility")}>Facilities &amp; Equipment</A><span>&rsaquo;</span><b>Factory Tour</b></div>
        <h1 className="sec-title reveal">Factory Tour</h1>
        <div className="sec-sub reveal">People are part of our sustainability journey</div>
        <nav className="pr-tabs reveal" aria-label="Section pages">
          <A href={l("/facility-pre-press")}>Prepress Equipment</A>{' '}
          <A href={l("/facility-eco-printing")}>Environmentally Friendly Printing</A>{' '}
          <A href={l("/facility-post-press")}>Post-Press Processing</A>{' '}
          <A href={l("/facility-quality")}>Quality Inspection</A>{' '}
          <A href={l("/facility-tour")} className="active">Factory Tour</A>
        </nav>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p className="prose wide">At NTI Printing, ESG begins with people. Our state-of-the-art, fully air-conditioned facility is designed to provide a safe, comfortable, and inspiring workplace for every member of our team. From modern offices and efficient production floors to staff restaurants, library, dormitories, and shared spaces, we continually invest in the wellbeing of both our local and international employees. By creating an environment where people can thrive, we build a stronger culture, deliver better quality, and support a more sustainable future as a trusted sustainable packaging manufacturer in Taiwan.</p>
        {locale === 'zh' ? (
        <>
        <div className="video-frame reveal mt-l">
          <iframe src={video} title="Integrated Low-Carbon Production — NTI Printing company film" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        </div>
        {/* 只在接了 CMS 時發：沒接 API 的輸出要與 mockup 逐字相同（verify:markup） */}
        {page && <VideoJsonLd id={video.slice(video.lastIndexOf('/') + 1)} />}
        </>
        ) : photos.length > 0 && <TourGallery photos={photos} />}
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <div className="dtitle">On the floor</div>
        <p className="prose wide">The plant runs on a well-planned production area with a dedicated wastewater treatment zone, supporting an environmentally friendly workplace. Alongside production there is an employee cafeteria, dormitories and training rooms &mdash; the site is built for the people running it, not only for the presses.</p>
      </div></section>
      {/* panoramas (2880x620 / 2880x750) run full-width so they are never cropped */}
      <PageMidBanner src={midBannerSrc(page, 1, "/assets/fac-tour1.webp")} alt="NTI factory floor — press hall lighting and overhead services" loading="lazy" />
      <PageMidBanner src={midBannerSrc(page, 2, "/assets/fac-tour2.webp")} alt="NTI production aisle — palletised stock between press and finishing" loading="lazy" />
      <section className="section tight"><div className="wrap reveal">
        <div className="dtitle">Booking a visit</div>
        <p className="prose wide">Factory visits run by appointment, Monday to Friday, 08:30&ndash;17:30 (GMT+8) at the Tainan plant. Tell us what you produce and we will shape the route around it.</p>
        <p className="mt-m"><A href={l("/contact")} className="btn btn-out">Arrange a visit</A></p>
      </div></section>
      <section className="section tight"><div className="wrap reveal">
        <p className="prose">Want this applied to your packaging? Send us the brief and we will come back with a spec and a quote.</p>
        <p className="mt-m"><A href={l("/get-a-quote")} className="btn btn-solid">Get a Quote</A></p>
        <p className="mt-m reveal"><A href={l("/facility-pre-press")} className="blink">Next: Prepress Equipment</A></p>
      </div></section>
    </T>
  )
}
