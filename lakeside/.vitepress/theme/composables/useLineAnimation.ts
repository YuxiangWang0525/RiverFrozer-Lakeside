import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue'

export function useLineAnimation(
  containerRef: Ref<HTMLElement | null>,
  options: { stagger?: number; threshold?: number } = {}
) {
  const { stagger = 120, threshold = 0.1 } = options
  const isVisible = ref(false)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (!containerRef.value) return

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true
            const items = containerRef.value?.querySelectorAll('.line-animate-item')
            items?.forEach((el, i) => {
              ;(el as HTMLElement).style.transitionDelay = `${i * stagger}ms`
              requestAnimationFrame(() => {
                el.classList.add('visible')
              })
            })
            observer?.unobserve(entry.target)
          }
        })
      },
      { threshold }
    )

    observer.observe(containerRef.value)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
  })

  return { isVisible }
}
