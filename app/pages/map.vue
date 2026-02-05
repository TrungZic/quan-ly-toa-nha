<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import type { Building } from '~/types/building'

definePageMeta({ ssr: false })

const route = useRoute()
const buildings = ref<Building[]>([])
const loading = ref(false)

/* =====================
   FOCUS FROM QUERY
===================== */
const focusedBuilding = computed<Building | null>(() => {
  const lat = Number(route.query.lat)
  const lng = Number(route.query.lng)

  if (isNaN(lat) || isNaN(lng)) return null

  return buildings.value.find(b =>
    Number(b.lat) === lat && Number(b.lng) === lng
  ) || null
})

/* =====================
   LOAD DATA
===================== */
interface BuildingsResponse {
  data: Building[]
}

const loadBuildings = async () => {
  loading.value = true
  try {
    const res = await $fetch<BuildingsResponse>('/api/buildings')
    buildings.value = res.data
  } finally {
    loading.value = false
  }
}

onMounted(loadBuildings)
</script>

<template>
  <div class="max-w-7xl mx-auto p-6 space-y-4">
    <UCard>
      <h1 class="text-xl font-semibold">🗺️ Bản đồ tòa nhà</h1>
    </UCard>

    <UCard>
      <div v-if="loading" class="text-center py-10 text-gray-400">
        Đang tải bản đồ...
      </div>

      <LeafletMap
        v-else
        :buildings="buildings"
        :focus="focusedBuilding"
        class="h-[600px] w-full"
      />
    </UCard>
  </div>
</template>
