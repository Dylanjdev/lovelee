import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductVisual from '../components/ProductVisual.jsx'
import { useCart } from '../lib/cartContext.js'
import { useCatalog } from '../lib/catalogContext.js'
import { formatMoney, isRandomizedScraperProduct } from '../lib/products.js'

const materialFilters = [
  { value: 'walnut', label: 'Walnut', pattern: /walnut/i },
  { value: 'oak', label: 'Oak', pattern: /oak/i },
  { value: 'maple', label: 'Maple', pattern: /maple/i },
  { value: 'cherry', label: 'Cherry', pattern: /cherry/i },
  { value: 'hickory', label: 'Hickory', pattern: /hickory/i },
  { value: 'pine', label: 'Pine', pattern: /pine/i },
  { value: 'poplar', label: 'Poplar', pattern: /poplar|poppler/i },
]

export default function Shop() {
  const [activeMaterial, setActiveMaterial] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [activeImageProduct, setActiveImageProduct] = useState(null)
  const imageCloseButtonRef = useRef(null)
  const imageTriggerRef = useRef(null)
  const { addItem, getItemQuantity } = useCart()
  const { products, status, error, refreshCatalog } = useCatalog()
  const shopProducts = useMemo(
    () => products.filter((product) => !isRandomizedScraperProduct(product)),
    [products],
  )

  const availableMaterials = useMemo(
    () => materialFilters.flatMap((material) => {
      const count = shopProducts.filter((product) => material.pattern.test(product.name)).length
      return count ? [{ ...material, count }] : []
    }),
    [shopProducts],
  )

  const visibleProducts = useMemo(() => {
    const activeFilter = materialFilters.find((material) => material.value === activeMaterial)
    const filteredProducts = shopProducts.filter((product) => (
      (!activeFilter || activeFilter.pattern.test(product.name))
      && (!inStockOnly || product.inventoryCount > 0)
    ))

    if (sortBy === 'price-low') {
      return [...filteredProducts].sort((a, b) => a.price - b.price)
    }

    if (sortBy === 'price-high') {
      return [...filteredProducts].sort((a, b) => b.price - a.price)
    }

    if (sortBy === 'name') {
      return [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name))
    }

    return filteredProducts
  }, [activeMaterial, inStockOnly, shopProducts, sortBy])

  const heroProduct = useMemo(
    () => shopProducts.find((product) => product.image && /board|\bbd\b/i.test(product.name))
      || shopProducts.find((product) => product.image),
    [shopProducts],
  )

  const activeImageQuantity = activeImageProduct
    ? getItemQuantity(activeImageProduct.id)
    : 0
  const activeImageAtLimit = activeImageProduct
    ? activeImageQuantity >= activeImageProduct.inventoryCount
    : false

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
        <div className="page-hero__content page-hero__content--shop">
          <div className="shop-hero__copy">
            <p className="hero__eyebrow">Handcrafted in Southwest Virginia</p>
            <h1 className="page-hero__headline">Made by hand. Built for everyday life.</h1>
            <p className="page-hero__lede">
              Thoughtful woodcraft and small-batch goods, shaped by natural materials
              and the resourceful spirit of Lee County.
            </p>
            <div className="shop-hero__actions">
              <a href="#collection" className="btn btn--primary">Shop the collection</a>
              <Link to="/customized/" className="btn btn--ghost">Explore custom work</Link>
            </div>
            <div className="shop-hero__edition" aria-label="About the collection">
              <p><span>Origin</span><strong>Lee County, Virginia</strong></p>
              <p><span>Character</span><strong>Small batch &amp; one of a kind</strong></p>
            </div>
          </div>

          <div className="shop-hero__feature" aria-label="A featured piece from the collection">
            {heroProduct ? (
              <ProductVisual product={heroProduct} className="shop-hero__visual" eager />
            ) : (
              <div className="shop-hero__placeholder" aria-hidden="true">
                <span>LoveLeeVA</span>
                <strong>Made in Virginia</strong>
              </div>
            )}
            <div className="shop-hero__feature-caption">
              <span>{heroProduct ? 'From the current collection' : 'Small-batch woodcraft'}</span>
              <strong>{heroProduct?.name || 'Useful goods with natural character'}</strong>
            </div>
            <div className="shop-hero__seal" aria-hidden="true">
              <span>Lee County</span>
              <strong>VA</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="shop-values" aria-label="What makes the collection special">
        <div className="shop-values__inner">
          <div>
            <span>01</span>
            <p><strong>Made locally</strong>Crafted in Lee County, Virginia</p>
          </div>
          <div>
            <span>02</span>
            <p><strong>Small batch</strong>Natural variation in every piece</p>
          </div>
          <div>
            <span>03</span>
            <p><strong>Live availability</strong>Current stock, checked as you shop</p>
          </div>
        </div>
      </section>

      <section className="shop" id="collection">
        <div className="shop__inner">
          <div className="shop__intro">
            <div>
              <p className="section-label">The LoveLeeVA Collection</p>
              <h2 className="section-heading">Useful pieces, naturally made.</h2>
            </div>
            <div className="shop__intro-aside">
              <p className="section-copy">
                Shop serving boards, kitchen tools, and one-of-a-kind goods designed
                to be used, shared, and kept close.
              </p>
              <p className="shop-sync" role="status">
                <span aria-hidden="true" />
                {status === 'ready' ? 'Inventory is live' : 'Checking current inventory'}
              </p>
            </div>
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
              <div className="collection-controls">
                <div className="collection-controls__main">
                  <div>
                    <p className="collection-controls__label">Shop by wood</p>
                    <div className="shop-toolbar" aria-label="Filter products by wood">
                      <button
                        type="button"
                        className={activeMaterial === 'all' ? 'shop-filter shop-filter--active' : 'shop-filter'}
                        aria-pressed={activeMaterial === 'all'}
                        onClick={() => setActiveMaterial('all')}
                      >
                        All pieces <span>{shopProducts.length}</span>
                      </button>
                      {availableMaterials.map((material) => (
                        <button
                          type="button"
                          key={material.value}
                          className={activeMaterial === material.value ? 'shop-filter shop-filter--active' : 'shop-filter'}
                          aria-pressed={activeMaterial === material.value}
                          onClick={() => setActiveMaterial(material.value)}
                        >
                          {material.label} <span>{material.count}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <label className="shop-sort">
                    <span>Sort by</span>
                    <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: low to high</option>
                      <option value="price-high">Price: high to low</option>
                      <option value="name">Name: A–Z</option>
                    </select>
                  </label>
                </div>
                <div className="collection-controls__footer">
                  <p className="shop-results" aria-live="polite">
                    Showing {visibleProducts.length} {visibleProducts.length === 1 ? 'piece' : 'pieces'}
                  </p>
                  <label className="shop-stock-filter">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(event) => setInStockOnly(event.target.checked)}
                    />
                    <span aria-hidden="true" />
                    In stock only
                  </label>
                </div>
              </div>

              {visibleProducts.length ? (
                <div className="shop__grid">
                  {visibleProducts.map((product, index) => {
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
                          <span className="product-card__index" aria-hidden="true">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="product-card__view">View piece</span>
                        </button>
                        <div className="product-card__body">
                          <div className="product-card__meta">
                            <p className="product-card__category">{product.categoryLabel}</p>
                            <span className={isSoldOut ? 'product-card__stock product-card__stock--out' : 'product-card__stock'}>
                              {isSoldOut ? 'Sold out' : 'In stock'}
                            </span>
                          </div>
                          <div className="product-card__heading">
                            <h3 className="product-card__title">{product.name}</h3>
                            <strong>{formatMoney(product.price)}</strong>
                          </div>
                          {product.hasDescription ? (
                            <p className="product-card__desc">{product.description}</p>
                          ) : null}
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
                                  : product.inventoryCount === 1
                                    ? 'One of a kind'
                                    : `${product.inventoryCount} available`}
                            </span>
                          </div>
                        </div>
                      </article>
                    )
                  })}
                </div>
              ) : (
                <div className="shop-empty-filter" role="status">
                  <span aria-hidden="true">✦</span>
                  <p className="section-label">Nothing matches those filters</p>
                  <h3>Let&rsquo;s open the collection back up.</h3>
                  <p>Clear the current filters to see every available piece.</p>
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={() => {
                      setActiveMaterial('all')
                      setInStockOnly(false)
                    }}
                  >
                    View all pieces
                  </button>
                </div>
              )}
            </>
          )}

          <div className="shop-craft">
            <div className="shop-craft__intro">
              <p className="section-label">From the Workbench</p>
              <h2>Made slowly, so it can stay with you.</h2>
              <p>
                Each piece starts with the material itself. Grain, color, and natural
                variation guide the final form, leaving every object with its own character.
              </p>
            </div>
            <ol className="shop-craft__steps">
              <li><span>01</span><strong>Choose</strong><p>Materials are selected for warmth, strength, and natural detail.</p></li>
              <li><span>02</span><strong>Shape</strong><p>Small-batch methods keep the maker close to every curve and edge.</p></li>
              <li><span>03</span><strong>Finish</strong><p>Each object is prepared for daily use, gifting, and years of stories.</p></li>
            </ol>
          </div>

          <div className="shop__story">
            <div>
              <p className="section-label">Made in Rural Virginia</p>
              <h2>Local goods with a clear sense of place.</h2>
            </div>
            <div className="shop__story-copy">
              <p>
                LoveLeeVa brings together useful, small-batch work with natural character
                and a connection to Lee County. The collection includes woodworking,
                homestead goods, and work from local artists and makers.
              </p>
              <p>
                Choosing a locally made piece supports the hands and skills behind it—and
                gives residents and visitors something of rural Virginia to use, share,
                and remember.
              </p>
              <Link to="/about/">Our story <span aria-hidden="true">→</span></Link>
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
              <strong className="image-modal__price">{formatMoney(activeImageProduct.price)}</strong>
              <p className="image-modal__description">{activeImageProduct.description}</p>
              <div className="image-modal__details">
                <span>{activeImageProduct.details}</span>
                <span>
                  {activeImageProduct.inventoryCount === 1
                    ? 'One available'
                    : `${activeImageProduct.inventoryCount} available`}
                </span>
              </div>
              <button
                type="button"
                className="btn btn--primary"
                disabled={activeImageAtLimit}
                onClick={() => addItem(activeImageProduct.id)}
              >
                {activeImageAtLimit
                  ? 'Max in cart'
                  : activeImageQuantity
                    ? 'Add another'
                    : 'Add to cart'}
              </button>
              {activeImageQuantity ? (
                <small>{activeImageQuantity} {activeImageQuantity === 1 ? 'item' : 'items'} in your cart</small>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
