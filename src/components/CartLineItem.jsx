import ProductVisual from './ProductVisual.jsx'
import QuantityControl from './QuantityControl.jsx'
import { formatMoney } from '../lib/products.js'

export default function CartLineItem({
  item,
  onQuantityChange,
  onRemove,
  compact = false,
}) {
  const { product, quantity, lineTotal } = item

  return (
    <article className={`cart-line${compact ? ' cart-line--compact' : ''}`}>
      <ProductVisual product={product} className="cart-line__visual" />
      <div className="cart-line__content">
        <div className="cart-line__heading">
          <div>
            <p>{product.categoryLabel}</p>
            <h3>{product.name}</h3>
          </div>
          <strong>{formatMoney(lineTotal)}</strong>
        </div>
        {!compact ? <p className="cart-line__details">{product.details}</p> : null}
        <div className="cart-line__actions">
          <QuantityControl
            compact={compact}
            label={product.name}
            quantity={quantity}
            max={product.inventoryCount}
            onChange={(nextQuantity) => onQuantityChange(product.id, nextQuantity)}
          />
          <button
            type="button"
            className="cart-line__remove"
            onClick={() => onRemove(product.id)}
          >
            Remove
          </button>
        </div>
      </div>
    </article>
  )
}
