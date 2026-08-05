import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { canonicalUrlForPath, getSeoForPath } from '../lib/seo.js'

export default function ScrollToTop() {
  const { pathname, hash } = useLocation()
  const isFirstRender = useRef(true)
  const pageSeo = getSeoForPath(pathname)

  useEffect(() => {
    const canonicalUrl = canonicalUrlForPath(pageSeo.path)
    const setMetaContent = (selector, content) => {
      document.querySelector(selector)?.setAttribute('content', content)
    }

    document.title = pageSeo.title
    setMetaContent('meta[name="description"]', pageSeo.description)
    setMetaContent('meta[name="robots"]', pageSeo.index ? 'index, follow' : 'noindex, follow')
    setMetaContent('meta[property="og:title"]', pageSeo.title)
    setMetaContent('meta[property="og:description"]', pageSeo.description)
    setMetaContent('meta[property="og:url"]', canonicalUrl)
    setMetaContent('meta[name="twitter:title"]', pageSeo.title)
    setMetaContent('meta[name="twitter:description"]', pageSeo.description)

    let canonicalLink = document.querySelector('link[rel="canonical"]')
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.setAttribute('href', canonicalUrl)

    window.history.scrollRestoration = 'manual'
    const scrollFrame = window.requestAnimationFrame(() => {
      if (hash) {
        document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' })
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      }
    })

    if (isFirstRender.current) {
      isFirstRender.current = false
      return undefined
    }

    const focusFrame = window.requestAnimationFrame(() => {
      document.getElementById('main-content')?.focus({ preventScroll: true })
    })

    return () => {
      window.cancelAnimationFrame(scrollFrame)
      window.cancelAnimationFrame(focusFrame)
    }
  }, [hash, pageSeo])

  return (
    <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {pageSeo.label} page loaded
    </span>
  )
}
