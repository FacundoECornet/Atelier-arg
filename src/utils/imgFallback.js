export function handleImgFallback(fallbackSrc) {
  return (e) => {
    e.target.src = fallbackSrc
  }
}

export function hideImgOnError(e) {
  e.target.style.display = 'none'
}
