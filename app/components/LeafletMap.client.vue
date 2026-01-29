<script setup lang="ts">
import { onMounted, watch, onBeforeUnmount } from 'vue'
import * as L from 'leaflet'
import type { Building } from '~/types/building'

const props = defineProps<{
  buildings: Building[]
}>()

let map: L.Map | null = null
let markersLayer: L.LayerGroup | null = null

/* =====================
  FIX LEAFLET ICON
===================== */
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
})

/* =====================
  INIT MAP
===================== */
const initMap = () => {
  map = L.map('leaflet-map').setView([21.0278, 105.8342], 12) // Hà Nội

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  markersLayer = L.layerGroup().addTo(map)
}

/* =====================
  RENDER MARKERS
===================== */
const renderMarkers = () => {
  if (!map || !markersLayer) return

  markersLayer.clearLayers()

  props.buildings.forEach(b => {
    if (typeof b.lat !== 'number' || typeof b.lng !== 'number') return

    L.marker([b.lat, b.lng])
      .addTo(markersLayer!)
      .bindPopup(`
        <strong>${b.name}</strong><br/>
        ${b.address}<br/>
        📍 ${b.lat}, ${b.lng}
      `)
  })
}

/* =====================
  LIFECYCLE
===================== */
onMounted(() => {
  initMap()
  renderMarkers()
    setTimeout(() => {
    map?.invalidateSize()
  }, 0)
})

watch(
  () => props.buildings,
  () => renderMarkers(),
  { deep: true }
)

onBeforeUnmount(() => {
  map?.remove()
  map = null
})
</script>

<template>
 <div id="leaflet-map" class="leaflet-map"></div>

</template>

<style>
.leaflet-container {
  font-family: inherit;
}
.leaflet-map {
  width: 100%;
  height: 500px; 
}
</style>
