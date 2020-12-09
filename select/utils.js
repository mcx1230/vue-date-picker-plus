export function debounce (fn) {
  let waiting
  return function () {
    if (waiting) return
    waiting = true
    const context = this
    let args = arguments
    const later = function () {
      waiting = false
      fn.apply(context, args)
    }
    this.$nextTick(later)
  }
}
