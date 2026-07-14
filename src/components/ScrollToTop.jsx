import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const pageTitles = {
  '/': 'Home',
  '/about': 'About LoveLeeVa',
  '/shop': 'Shop',
  '/contact': 'Contact Us',
  '/customized': 'Customized',
  '/directory': 'Lee County Business Directory',
  '/privacy-policy': 'Privacy Policy',
  '/terms': 'Terms of Service',
}

const pageDescriptions = {
  '/': 'LoveLeeVa grows local goods, local power, local talent, and local adventure in Lee County, Virginia.',
  '/about': 'Learn how LoveLeeVa connects goods, infrastructure, talent, and local discovery to support sustainable rural development in Lee County.',
  '/shop': 'Explore handcrafted goods and custom woodworking made in Jonesville, Virginia by LoveLeeVa.',
  '/contact': 'Contact LoveLeeVa in Jonesville, Virginia about local goods, custom work, collaborations, and community ideas.',
  '/customized': 'Request custom engraving, sizing, gift sets, and one-of-a-kind handcrafted work from LoveLeeVa.',
  '/directory': 'Discover the growing Lee County, Virginia business directory from LoveLeeVa.',
  '/privacy-policy': 'Read the LoveLeeVa Privacy Policy.',
  '/terms': 'Read the LoveLeeVa Terms of Service.',
}

export default function ScrollToTop() {
  const { pathname } = useLocation()
  const isFirstRender = useRef(true)
  const pageTitle = pageTitles[pathname] ?? 'Page Not Found'
  const pageDescription = pageDescriptions[pathname] ?? 'The requested LoveLeeVa page could not be found.'

  useEffect(() => {
    document.title = `${pageTitle} | LoveLeeVa`
    document.querySelector('meta[name="description"]')?.setAttribute('content', pageDescription)

    let canonicalLink = document.querySelector('link[rel="canonical"]')
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.setAttribute('href', `https://loveleeva.com${pathname === '/' ? '/' : pathname}`)

    window.history.scrollRestoration = 'manual'
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })

    if (isFirstRender.current) {
      isFirstRender.current = false
      return undefined
    }

    const focusFrame = window.requestAnimationFrame(() => {
      document.getElementById('main-content')?.focus({ preventScroll: true })
    })

    return () => window.cancelAnimationFrame(focusFrame)
  }, [pageDescription, pageTitle, pathname])

  return (
    <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {pageTitle} page loaded
    </span>
  )
}
