type QuantityControlProps = {
  value: number
  onChange: (quantity: number) => void
  productName?: string
  testId: string
  min?: number
  max?: number
}

export function QuantityControl({
  value,
  onChange,
  productName,
  testId,
  min = 1,
  max = 9,
}: QuantityControlProps) {
  const decrease = productName ? `Decrease quantity of ${productName}` : 'Decrease quantity'
  const increase = productName ? `Increase quantity of ${productName}` : 'Increase quantity'

  return (
    <div className="qty">
      <button type="button" aria-label={decrease} onClick={() => onChange(value - 1)} disabled={value <= min}>
        −
      </button>
      <span data-testid={testId}>{value}</span>
      <button type="button" aria-label={increase} onClick={() => onChange(value + 1)} disabled={value >= max}>
        +
      </button>
    </div>
  )
}
