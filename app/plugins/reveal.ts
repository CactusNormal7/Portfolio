// v-reveal directive: fades/slides an element in when it enters the viewport.
// Optional value = stagger delay in ms, e.g. v-reveal="150"
export default defineNuxtPlugin((nuxtApp) => {
  let observer: IntersectionObserver | null = null

  function getObserver (): IntersectionObserver {
    if (!observer) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible')
              observer!.unobserve(entry.target)
            }
          }
        },
        { threshold: 0.12 }
      )
    }
    return observer
  }

  nuxtApp.vueApp.directive('reveal', {
    mounted (el: HTMLElement, binding) {
      el.classList.add('reveal')
      if (binding.value) {
        el.style.setProperty('--reveal-delay', `${binding.value}ms`)
      }
      getObserver().observe(el)
    },
    unmounted (el: HTMLElement) {
      observer?.unobserve(el)
    },
    getSSRProps () {
      return {}
    }
  })
})
