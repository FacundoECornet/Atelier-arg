export function formatPrice(price) {
  if (!price) return null
  const priceStr = String(price).trim()
  if (priceStr.includes('$') || priceStr.includes('USD') || priceStr.includes('ARS')) {
    return priceStr
  }
  const numPrice = parseFloat(priceStr.replace(/[^\d.]/g, ''))
  if (!isNaN(numPrice)) {
    if (numPrice > 10000000) {
      return `$${numPrice.toLocaleString('es-AR')} ARS`
    }
    return `US$${numPrice.toLocaleString('es-AR')}`
  }
  return priceStr
}
