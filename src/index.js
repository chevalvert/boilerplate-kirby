import Barba from '@barba/core'
import lozad from 'lozad'

;(async () => {
  const views = [
    await import('/views/default')
  ]

  const components = [
    await import('/components/Hello')
  ]

  Barba.init({
    debug: true,
    prevent: ({ el }) => el?.classList?.contains('no-barba'),
    views: views.map(view => view.default)
  })

  const refs = new Set()

  Barba.hooks.afterEnter(({ next }) => {
    // Hydrate all possible components, keeping a ref
    for (const { selector, hydrate } of components) {
      for (const el of next.container.querySelectorAll(selector)) {
        refs.add(hydrate(el))
      }
    }

    // Lazyload
    const lazys = next.container.querySelectorAll('[data-lazyload=true]')
    lozad(lazys).observe()
    // Lozad set a [data-loaded] attribute when loading image, but does not detect
    // when image is fully loaded, which can cause incoherent animations
    for (const image of lazys) image.onload = () => image.setAttribute('data-decoded', true)

    // Reset scroll position
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

    // Flag document as ready
    document.body.classList.add('is-ready')
  })

  Barba.hooks.afterLeave(() => {
    // Destroy previous components refs if any
    for (const ref of refs) ref?.destroy()
    refs.clear()
  })
})()
