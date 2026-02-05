import type * as JQuery from 'jquery'

declare global {
  interface Window {
    $: typeof JQuery
    jQuery: typeof JQuery
  }
}

export {}
