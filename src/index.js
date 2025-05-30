import Barba from '@barba/core'
import lozad from 'lozad'

;(async () => {
  const views = [
    await import('/views/default')
  ]

  const components = {
    global: [
      // Outside barba wrapper
    ],
    local: [
      // Inside barba wrapper
      await import('/components/Hello')
    ]
  }

  Barba.init({
    prevent: ({ el }) => el?.classList?.contains('no-barba'),
    views: views.map(view => view.default),
    transitions: [{
      sync: false,
      once: data => {
        try {
          // Find and hydrate all global components
          for (const { selector, hydrate } of components.global) {
            Array.from(document.querySelectorAll(selector)).map(hydrate)
          }
        } catch (e) {
          console.error(e)
        }
      }
    }]
  })

  const refs = new Set()

  Barba.hooks.afterEnter(({ next }) => {
    try {
      // Hydrate all possible components, keeping a ref
      for (const { selector, hydrate } of components.local) {
        for (const el of next.container.querySelectorAll(selector)) {
          refs.add(hydrate(el))
        }
      }

      // Lazyload
      const lazys = next.container.querySelectorAll('[data-lazyload]')
      lozad(lazys).observe()
      // Lozad set a [data-loaded] attribute when loading image, but does not detect
      // when image is fully loaded, which can cause incoherent animations
      for (const image of lazys) image.onload = () => image.setAttribute('data-decoded', true)

      // Reset scroll position
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

      // Flag document as ready
      document.body.classList.add('is-ready')
    } catch (e) {
      console.error(e)
    }
  })

  Barba.hooks.afterLeave(() => {
    try {
      // Destroy previous components refs if any
      for (const ref of refs) ref?.destroy?.()
      refs.clear()
    } catch (e) {
      console.error(e)
    }
  })
})()
