import { useEffect } from 'react'
import { useI18n } from '../hooks/useI18n'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: string
  canonicalUrl?: string
  structuredData?: object
}

export default function SEOHead({ 
  title, 
  description, 
  keywords = [], 
  ogImage,
  canonicalUrl,
  structuredData 
}: SEOHeadProps) {
  const { language, t } = useI18n()

  // 기본 SEO 데이터
  const defaultKeywords = {
    th: [
      'บาธบอม',
      'Bath Bomb',
      'Bubble Bath Bomb', 
      'Bathbomb Thailand',
      'Bubble Bath Gel',
      'Family Bath Bomb',
      'บาธบอมธรรมชาติ',
      'อุปกรณ์อาบน้ำ',
      'สปา',
      'ผ่อนคลาย',
      'ของขวัญ',
      'Bath Products Thailand',
      'Natural Bath Bomb',
      'Luxury Bath Bomb',
      'Aromatherapy Bath Bomb'
    ],
    en: [
      'Bath Bomb',
      'Bubble Bath Bomb',
      'Bathbomb Thailand', 
      'Bubble Bath Gel',
      'Family Bath Bomb',
      'Natural Bath Bomb',
      'Bath Products',
      'Spa Products',
      'Relaxation',
      'Gift Ideas',
      'Luxury Bath',
      'Aromatherapy',
      'Bath Accessories',
      'Premium Bath Bomb',
      'Organic Bath Bomb'
    ]
  }

  const defaultTitle = language === 'th' 
    ? 'Daddy Bath Bomb - บาธบอมพรีเมียมจากวัตถุดิบธรrrมชาติ | Bath Bomb Thailand'
    : 'Daddy Bath Bomb - Premium Natural Bath Bombs Thailand | Luxury Bath Products'

  const defaultDescription = language === 'th'
    ? 'ร้านบาธบอมออนไลน์ชั้นนำของไทย จำหน่าย Bath Bomb, Bubble Bath Bomb คุณภาพสูงจากวัตถุดิบธรรมชาติ 100% เพื่อประสบการณ์อาบน้ำสุดพิเศษ ส่งฟรีทั่วไทย'
    : 'Premium Thai bath bomb store offering natural Bath Bombs, Bubble Bath Bombs, and luxury bath products. Experience the ultimate relaxation with our organic bath bomb collection. Free shipping across Thailand.'

  const finalTitle = title || defaultTitle
  const finalDescription = description || defaultDescription
  const finalKeywords = [...defaultKeywords[language], ...keywords].join(', ')
  const finalOgImage = ogImage || '/og-image.jpg'

  useEffect(() => {
    // Update document title
    document.title = finalTitle

    // Update meta tags
    updateMetaTag('description', finalDescription)
    updateMetaTag('keywords', finalKeywords)
    updateMetaTag('author', 'Daddy Bath Bomb')
    updateMetaTag('robots', 'index, follow')
    
    // Open Graph tags
    updateMetaProperty('og:title', finalTitle)
    updateMetaProperty('og:description', finalDescription)
    updateMetaProperty('og:image', finalOgImage)
    updateMetaProperty('og:type', 'website')
    updateMetaProperty('og:site_name', 'Daddy Bath Bomb')
    updateMetaProperty('og:locale', language === 'th' ? 'th_TH' : 'en_US')
    
    // Twitter Card tags
    updateMetaName('twitter:card', 'summary_large_image')
    updateMetaName('twitter:title', finalTitle)
    updateMetaName('twitter:description', finalDescription)
    updateMetaName('twitter:image', finalOgImage)
    
    // Canonical URL
    if (canonicalUrl) {
      updateCanonical(canonicalUrl)
    }

    // Structured Data (JSON-LD)
    if (structuredData) {
      updateStructuredData(structuredData)
    } else {
      // Default organization structured data
      const defaultStructuredData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Daddy Bath Bomb",
        "description": finalDescription,
        "url": "https://daddybathbomb.com",
        "logo": "https://daddybathbomb.com/logo.png",
        "sameAs": [
          "https://www.facebook.com/daddybathbomb",
          "https://www.instagram.com/daddybathbomb",
          "https://line.me/ti/p/@daddybathbomb"
        ],
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "TH"
        }
      }
      updateStructuredData(defaultStructuredData)
    }

  }, [finalTitle, finalDescription, finalKeywords, finalOgImage, canonicalUrl, structuredData, language])

  return null // This component doesn't render anything
}

// Helper functions
function updateMetaTag(name: string, content: string) {
  let meta = document.querySelector(`meta[name="${name}"]`)
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('name', name)
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', content)
}

function updateMetaProperty(property: string, content: string) {
  let meta = document.querySelector(`meta[property="${property}"]`)
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('property', property)
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', content)
}

function updateMetaName(name: string, content: string) {
  let meta = document.querySelector(`meta[name="${name}"]`)
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('name', name)
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', content)
}

function updateCanonical(url: string) {
  let canonical = document.querySelector('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    document.head.appendChild(canonical)
  }
  canonical.setAttribute('href', url)
}

function updateStructuredData(data: object) {
  // Remove existing structured data
  const existing = document.querySelector('script[type="application/ld+json"]')
  if (existing) {
    existing.remove()
  }

  // Add new structured data
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)
}

// Product structured data helper
export function createProductStructuredData(product: any, language: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description || '',
    "image": product.image_url || product.images?.[0],
    "brand": {
      "@type": "Brand",
      "name": "Daddy Bath Bomb"
    },
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "THB",
      "availability": product.stock_quantity > 0 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Daddy Bath Bomb"
      }
    },
    "category": product.category || "Bath Products",
    "inLanguage": language === 'th' ? 'th-TH' : 'en-US'
  }
}
