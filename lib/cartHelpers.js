export function calculateTotal(cartArray) {
  return (cartArray || []).reduce(
    (s, i) => s + (i.price || 0) * (i.quantity || 1),
    0
  )
}

export default calculateTotal
