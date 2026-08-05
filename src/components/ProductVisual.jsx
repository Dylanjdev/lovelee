export default function ProductVisual({ product, className = '', eager = false }) {
  return (
    <div
      className={`product-visual product-visual--${product.tone}${className ? ` ${className}` : ''}`}
      aria-hidden={product.image ? undefined : 'true'}
    >
      {product.image ? (
        <img
          src={product.image}
          alt={product.imageAlt || product.name}
          width={product.imageWidth}
          height={product.imageHeight}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
        />
      ) : (
        <>
          <span className="product-visual__mark">{product.name.charAt(0)}</span>
          <span className="product-visual__label">LoveLeeVA</span>
        </>
      )}
    </div>
  )
}
