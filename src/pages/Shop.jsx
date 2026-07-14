import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import rollingTrayHomepage from '../assets/RollingTrayHomepage.webp'
import wallArtHomepage from '../assets/wallArtHomepage.webp'
import walnutBoard from '../assets/walnut.webp'

export default function Shop() {
  const [activeImageProduct, setActiveImageProduct] = useState(null)
  const imageCloseButtonRef = useRef(null)
  const imageTriggerRef = useRef(null)

  const products = [
    {
      id: 'cutting-boards',
      title: 'Cutting Boards',
      description:
        'Premium hardwood, food-safe finish. Built for the kitchen, beautiful enough to display.',
      tileClassName: 'product-card__img--1',
      image: null,
    },
    {
      id: 'rolling-trays',
      title: 'Rolling Trays',
      description:
        'Custom engraved, one-of-a-kind pieces. Smooth finish, deep grain.',
      tileClassName: 'product-card__img--2',
      image: rollingTrayHomepage,
      imageWidth: 433,
      imageHeight: 577,
    },
    {
      id: 'custom-orders',
      title: 'Custom Orders',
      description: 'Tell us what you need and we will build a one-of-a-kind piece.',
      tileClassName: 'product-card__img--3',
      image: null,
    },
    {
      id: 'maple-walnut-board',
      title: 'Maple and Walnut Board',
      description:
        'Cutting board, charcuterie board, lapboard, and display board handcrafted from maple and walnut.',
      tileClassName: 'product-card__img--maple-walnut',
      image: walnutBoard,
      imageWidth: 433,
      imageHeight: 577,
      price: '$75',
      details: 'Maple + Walnut',
    },
    {
      id: 'wall-art',
      title: 'Wall Art',
      description:
        'Decorative hardwood pieces to bring warmth to any room.',
      tileClassName: 'product-card__img--wall-art',
      image: wallArtHomepage,
      imageWidth: 1600,
      imageHeight: 1200,
    },
  ]

  useEffect(() => {
    if (!activeImageProduct) return undefined

    const previousOverflow = document.body.style.overflow
    const imageTrigger = imageTriggerRef.current
    document.body.style.overflow = 'hidden'
    imageCloseButtonRef.current?.focus()

    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setActiveImageProduct(null)
      }
      if (event.key === 'Tab') {
        event.preventDefault()
        imageCloseButtonRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleEsc)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEsc)
      imageTrigger?.focus()
    }
  }, [activeImageProduct])

  return (
    <>
      <section className="page-hero page-hero--shop">
        <div className="page-hero__noise" aria-hidden="true" />
        <div className="page-hero__content">
          <p className="hero__eyebrow">Products</p>
          <h1 className="page-hero__headline">The Shop</h1>
        </div>
      </section>

      <section className="shop">
        <div className="shop__inner">
          <p className="section-label">Featured Collection</p>
          <h2 className="section-heading">Our Products</h2>
          <div className="shop-status" role="note" aria-labelledby="shop-status-title">
            <p className="shop-status__label">Under Construction</p>
            <div>
              <h3 className="shop-status__title" id="shop-status-title">Our Unicorns Are Working Their Magic</h3>
              <p className="shop-status__message">
                Unicorns are working their magic to get the online shop and cart
                functional as quickly as possible.
              </p>
            </div>
          </div>
          <div className="shop__grid">
            {products.map((product) => (
              <article className="product-card" key={product.id}>
                <div
                  className={`product-card__img ${product.tileClassName} ${product.image ? 'product-card__img--interactive' : ''}`}
                  aria-hidden={product.image ? undefined : true}
                >
                  {product.image ? (
                    <>
                      <img
                        src={product.image}
                        alt=""
                        className="product-card__image"
                        width={product.imageWidth}
                        height={product.imageHeight}
                        loading="lazy"
                        decoding="async"
                      />
                      <button
                        type="button"
                        className="product-card__zoom"
                        aria-label={`View image of ${product.title}`}
                        onClick={(event) => {
                          imageTriggerRef.current = event.currentTarget
                          setActiveImageProduct(product)
                        }}
                      >
                        View Image
                      </button>
                    </>
                  ) : null}
                </div>
                <div className="product-card__body">
                  <h3 className="product-card__title">{product.title}</h3>
                  <p className="product-card__desc">{product.description}</p>
                  {product.details ? (
                    <p className="product-card__details">{product.details}</p>
                  ) : null}
                  {/* Shopify buy button goes here */}
                  <span className="product-card__soon">
                    {product.price ? `${product.price} · Coming Soon` : 'Coming Soon'}
                  </span>
                </div>
              </article>
            ))}
          </div>
          <div className="shop__custom-cta">
            <p>Don&rsquo;t see exactly what you need?</p>
            <Link to="/customized" className="btn btn--ghost">Request a Custom Order</Link>
          </div>
        </div>
      </section>

      {activeImageProduct ? (
        <div
          className="image-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="image-modal-title"
          onClick={() => setActiveImageProduct(null)}
        >
          <div className="image-modal__content" onClick={(event) => event.stopPropagation()}>
            <h2 id="image-modal-title" className="sr-only">{activeImageProduct.title} image preview</h2>
            <button
              ref={imageCloseButtonRef}
              type="button"
              className="image-modal__close"
              aria-label="Close image preview"
              onClick={() => setActiveImageProduct(null)}
            >
              ×
            </button>
            <img
              src={activeImageProduct.image}
              alt={`${activeImageProduct.title} enlarged product view`}
              className="image-modal__img"
              width={activeImageProduct.imageWidth}
              height={activeImageProduct.imageHeight}
              decoding="async"
            />
          </div>
        </div>
      ) : null}
    </>
  )
}
