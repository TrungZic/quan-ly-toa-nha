<script setup lang="ts">
import { onMounted, watch, onBeforeUnmount } from 'vue'
import * as L from 'leaflet'
import type { Building } from '~/types/building'

const props = defineProps<{
  buildings: Building[]
  focus?: Building | null
}>()

let map: L.Map | null = null
let markersLayer: L.LayerGroup | null = null
let focusMarker: L.Marker | null = null

/* =====================
   FIX ICON
===================== */
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
})

/* =====================
   INIT MAP
===================== */
const initMap = () => {
  map = L.map('leaflet-map').setView([21.0278, 105.8342], 12)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  markersLayer = L.layerGroup().addTo(map)
}

/* =====================
   RENDER ALL BUILDINGS
===================== */
const renderMarkers = () => {
  if (!map || !markersLayer) return
  if (!Array.isArray(props.buildings)) return

  markersLayer.clearLayers()

  props.buildings.forEach(b => {
    const lat = Number(b.lat)
    const lng = Number(b.lng)
    if (isNaN(lat) || isNaN(lng)) return

    const marker = L.marker([lat, lng])
      .addTo(markersLayer!)
      .bindPopup(`
        <div style="min-width:220px">
          <strong>🏢 ${b.name}</strong><br/>
          📍 ${b.address}<br/>
          🌐 <strong>Kinh độ:</strong> ${lng}<br/>
          🧭 <strong>Vĩ độ:</strong> ${lat}
        </div>
      `)

    marker.on('click', () => {
      applyFocus(b)
    })
  })
}


/* =====================
   FOCUS 1 BUILDING
===================== */
const applyFocus = (b: Building) => {
  if (!map) return

  const lat = Number(b.lat)
  const lng = Number(b.lng)
  if (isNaN(lat) || isNaN(lng)) return

  map.flyTo([lat, lng], 16, {
    animate: true,
    duration: 0.8
  })

  if (!focusMarker) {
    focusMarker = L.marker([lat, lng]).addTo(map)
  } else {
    focusMarker.setLatLng([lat, lng])
  }

  focusMarker
    .bindPopup(`
      <div style="min-width:220px">
        <strong>🏢 ${b.name}</strong><br/>
        📍 ${b.address}<br/>
        🌐 <strong>Kinh độ:</strong> ${lng}<br/>
        🧭 <strong>Vĩ độ:</strong> ${lat}
      </div>
    `)
    
    .openPopup()
}

/* =====================
   LIFECYCLE
===================== */
onMounted(() => {
  initMap()
  renderMarkers()

  if (props.focus) {
    applyFocus(props.focus)
  }

  setTimeout(() => map?.invalidateSize(), 0)
})

watch(
  () => props.buildings,
  renderMarkers
)

watch(
  () => props.focus,
  b => b && applyFocus(b)
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
.leaflet-map {
  width: 100%;
  height: 600px;
}
</style>
