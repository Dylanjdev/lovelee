import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductVisual from '../components/ProductVisual.jsx'
import { useCart } from '../lib/cartContext.js'
import { useCatalog } from '../lib/catalogContext.js'
import { formatMoney } from '../lib/products.js'

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeImageProduct, setActiveImageProduct] = useState(null)
  const imageCloseButtonRef = useRef(null)
  const imageTriggerRef = useRef(null)
  const { addItem, getItemQuantity } = useCart()
  const { products, categories, status, error, refreshCatalog } = useCatalog()

  const visibleProducts = useMemo(
    () => products.filter((product) => (
      activeCategory === 'all' || product.category === activeCategory
    )),
    [activeCategory, products],
  )

  useEffect(() => {
    if (!activeImageProduct) return undefined

    const previousOverflow = document.body.style.overflow
    const imageTrigger = imageTriggerRef.current
    document.body.style.overflow = 'hidden'
    imageCloseButtonRef.current?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setActiveImageProduct(null)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      imageTrigger?.focus()
    }
  }, [activeImageProduct])

  return (
    <>
      <section className="page-hero page-hero--shop">
        <div className="page-hero__noise" aria-hidden="true" />
        <div className="page-hero__content">
          <p className="hero__eyebrow">Local Products From Southwest Virginia</p>
          <h1 className="page-hero__headline">Handmade Goods With Roots</h1>
          <p className="page-hero__lede">
            Small-batch woodworking, homesteading goods, fiber arts, and local products
            made with a maker&rsquo;s hand in rural Virginia.
          </p>
        </div>
      </section>

      <section className="shop">
        <div className="shop__inner">
          <div className="shop__intro">
            <div>
              <p className="section-label">Live Collection</p>
              <h2 className="section-heading">Made here. Meant to be used.</h2>
            </div>
            <p className="section-copy">
              Explore handmade goods shaped by Appalachian resourcefulness and everyday
              use. Prices and availability come directly from LoveLeeVA&rsquo;s inventory.
            </p>
          </div>

          <div className="shop-preview-note shop-preview-note--live" role="status">
            <span aria-hidden="true">✦</span>
            <p>
              <strong>{status === 'ready' ? 'Connected to Odoo' : 'Connecting to Odoo'}</strong>
              {status === 'ready'
                ? 'Product prices and available quantities are synced securely from the live catalog.'
                : 'Loading the latest product prices and inventory.'}
            </p>
          </div>

          {status === 'error' ? (
            <div className="commerce-empty shop-catalog-state" role="alert">
              <span aria-hidden="true">!</span>
              <p className="section-label">Catalog unavailable</p>
              <h2>We couldn&rsquo;t load the live collection.</h2>
              <p>{error}</p>
              <button type="button" className="btn btn--primary" onClick={refreshCatalog}>
                Try again
              </button>
            </div>
          ) : status === 'loading' ? (
            <div className="commerce-empty shop-catalog-state" role="status">
              <span aria-hidden="true">✦</span>
              <p className="section-label">Loading collection</p>
              <h2>Gathering the latest goods.</h2>
              <p>Checking current prices and available quantities in Odoo.</p>
            </div>
          ) : (
            <>
              {categories.length > 2 ? (
                <div className="shop-toolbar" aria-label="Filter products by category">
                  {categories.map((category) => (
                    <button
                      type="button"
                      key={category.value}
                      className={activeCategory === category.value ? 'shop-filter shop-filter--active' : 'shop-filter'}
                      aria-pressed={activeCategory === category.value}
                      onClick={() => setActiveCategory(category.value)}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              ) : null}

              <p className="shop-results" aria-live="polite">
                {visibleProducts.length} {visibleProducts.length === 1 ? 'good' : 'goods'} in this collection
              </p>

              <div className="shop__grid">
                {visibleProducts.map((product) => {
                  const quantityInCart = getItemQuantity(product.id)
                  const isSoldOut = product.inventoryCount <= 0
                  const isAtLimit = quantityInCart >= product.inventoryCount

                  return (
                    <article className="product-card" key={product.id}>
                      <button
                        type="button"
                        className="product-card__visual-button"
                        aria-label={`View ${product.name}`}
                        onClick={(event) => {
                          imageTriggerRef.current = event.currentTarget
                          setActiveImageProduct(product)
                        }}
                      >
                        <ProductVisual product={product} className="product-card__visual" />
                        {product.badge ? <span className="product-card__badge">{product.badge}</span> : null}
                        <span className="product-card__view">View piece</span>
                      </button>
                      <div className="product-card__body">
                        <p className="product-card__category">{product.categoryLabel}</p>
                        <div className="product-card__heading">
                          <h3 className="product-card__title">{product.name}</h3>
                          <strong>{formatMoney(product.price)}</strong>
                        </div>
                        <p className="product-card__desc">{product.description}</p>
                        <p className="product-card__details">{product.details}</p>
                        <div className="product-card__purchase">
                          <button
                            type="button"
                            className="btn btn--primary"
                            disabled={isAtLimit}
                            onClick={() => addItem(product.id)}
                          >
                            {isSoldOut
                              ? 'Sold out'
                              : isAtLimit
                                ? 'Max in cart'
                                : quantityInCart
                                  ? 'Add another'
                                  : 'Add to cart'}
                          </button>
                          <span aria-live="polite">
                            {quantityInCart
                              ? `${quantityInCart} in cart`
                              : isSoldOut
                                ? 'Currently unavailable'
                                : `${product.inventoryCount} available`}
                          </span>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </>
          )}

          <div className="shop__story">
            <div>
              <p className="section-label">Made in Rural Virginia</p>
              <h2>Local products for home, homesteading, and giving.</h2>
            </div>
            <div>
              <p>
                LoveLeeVa celebrates useful, small-batch work: handmade goods with a
                clear purpose, natural character, and a connection to Lee County. The
                collection brings woodworking, fiber arts, homestead goods, and work
                from local artists into one place.
              </p>
              <p>
                Choosing local products helps skilled makers keep creating and gives
                residents and visitors a tangible piece of rural Virginia to use,
                share, and remember.
              </p>
            </div>
          </div>

          <div className="shop__custom-cta">
            <div>
              <p className="section-label">Made for you</p>
              <h2>Have a one-of-a-kind piece in mind?</h2>
              <p>Start with an idea, a purpose, or a person. We&rsquo;ll build from there.</p>
            </div>
            <Link to="/customized/" className="btn btn--ghost">Request a Custom Order</Link>
          </div>
        </div>
      </section>

      {activeImageProduct ? (
        <div
          className="image-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="image-modal-title"
          onMouseDown={() => setActiveImageProduct(null)}
        >
          <div className="image-modal__content image-modal__content--product" onMouseDown={(event) => event.stopPropagation()}>
            <button
              ref={imageCloseButtonRef}
              type="button"
              className="image-modal__close"
              aria-label="Close product preview"
              onClick={() => setActiveImageProduct(null)}
            >
              ×
            </button>
            <ProductVisual product={activeImageProduct} className="image-modal__visual" eager />
            <div className="image-modal__caption">
              <p>{activeImageProduct.categoryLabel}</p>
              <h2 id="image-modal-title">{activeImageProduct.name}</h2>
              <span>{activeImageProduct.details}</span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
