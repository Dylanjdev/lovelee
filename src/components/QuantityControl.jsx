export default function QuantityControl({
  label,
  quantity,
  max,
  onChange,
  compact = false,
}) {
  return (
    <div className={`quantity-control${compact ? ' quantity-control--compact' : ''}`}>
      <button
        type="button"
        aria-label={`Decrease ${label} quantity`}
        disabled={quantity <= 1}
        onClick={() => onChange(quantity - 1)}
      >
        −
      </button>
      <label>
        <span className="sr-only">{label} quantity</span>
        <input
          type="number"
          min="1"
          max={max}
          inputMode="numeric"
          value={quantity}
          onChange={(event) => onChange(event.target.value)}
        />
      </label>
      <button
        type="button"
        aria-label={`Increase ${label} quantity`}
        disabled={quantity >= max}
        onClick={() => onChange(quantity + 1)}
      >
        +
      </button>
    </div>
  )
}
