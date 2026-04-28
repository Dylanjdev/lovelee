import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import rollingTrayHomepage from '../assets/RollingTrayHomepage.png'
import wallArtHomepage from '../assets/wallArtHomepage.webp'

export default function Shop() {
  const [activeImageProduct, setActiveImageProduct] = useState(null)

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
    },
    {
      id: 'custom-orders',
      title: 'Custom Orders',
      description: 'Tell us what you need and we will build a one-of-a-kind piece.',
      tileClassName: 'product-card__img--3',
      image: null,
    },
    {
      id: 'wall-art',
      title: 'Wall Art',
      description:
        'Decorative hardwood pieces to bring warmth to any room.',
      tileClassName: 'product-card__img--wall-art',
      image: wallArtHomepage,
    },
  ]

  useEffect(() => {
    if (!activeImageProduct) {
      document.body.style.overflow = ''
      return undefined
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setActiveImageProduct(null)
      }
    }

    window.addEventListener('keydown', handleEsc)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEsc)
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
          <p className="shop__sub">Shopify buy buttons coming soon — check back shortly.</p>
          <div className="shop__grid">
            {products.map((product) => (
              <article className="product-card" key={product.id}>
                <div
                  className={`product-card__img ${product.tileClassName} ${product.image ? 'product-card__img--interactive' : ''}`}
                  style={
                    product.image
                      ? {
                          backgroundImage: `url(${product.image})`,
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: 'cover',
                        }
                      : undefined
                  }
                  aria-hidden="true"
                >
                  {product.image ? (
                    <button
                      type="button"
                      className="product-card__zoom"
                      onClick={() => setActiveImageProduct(product)}
                    >
                      View Image
                    </button>
                  ) : null}
                </div>
                <div className="product-card__body">
                  <h3 className="product-card__title">{product.title}</h3>
                  <p className="product-card__desc">{product.description}</p>
                  {/* Shopify buy button goes here */}
                  <span className="product-card__soon">View More</span>
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
          aria-label={`${activeImageProduct.title} image preview`}
          onClick={() => setActiveImageProduct(null)}
        >
          <div className="image-modal__content" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="image-modal__close"
              aria-label="Close image preview"
              onClick={() => setActiveImageProduct(null)}
            >
              ×
            </button>
            <img src={activeImageProduct.image} alt={activeImageProduct.title} className="image-modal__img" />
          </div>
        </div>
      ) : null}
    </>
  )
}
