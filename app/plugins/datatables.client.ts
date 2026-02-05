import $ from 'jquery'
import 'datatables.net-dt'

export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    ;(window as any).$ = $
    ;(window as any).jQuery = $
  }
})
