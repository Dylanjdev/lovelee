import { useState } from 'react'

export default function ProductVisual({ product, className = '', eager = false }) {
  const [failedImage, setFailedImage] = useState(null)
  const showImage = Boolean(product.image && failedImage !== product.image)

  return (
    <div
      className={`product-visual product-visual--${product.tone}${className ? ` ${className}` : ''}`}
      aria-hidden={showImage ? undefined : 'true'}
    >
      {showImage ? (
        <img
          src={product.image}
          alt={product.imageAlt || product.name}
          width={product.imageWidth}
          height={product.imageHeight}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailedImage(product.image)}
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
