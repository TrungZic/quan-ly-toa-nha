<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Building } from '~/types/building'

// Tắt SSR vì Leaflet dùng window
 definePageMeta({ ssr: false })

const buildings = ref<Building[]>([])
const loading = ref(false)

const loadBuildings = async () => {
  loading.value = true
  try {
    buildings.value = await $fetch<Building[]>('/api/buildings')
  } finally {
    loading.value = false
  }
}

onMounted(loadBuildings)
</script>

<template>
  <div class="max-w-7xl mx-auto p-6 space-y-4">
    <UCard>
      <h1 class="text-xl font-semibold">🗺️ Bản đồ tòa nhà Hà Nội</h1>
      <p class="text-sm text-gray-500 mt-1">
        Hiển thị vị trí các tòa nhà theo hệ tọa độ WGS84 (Leaflet)
      </p>
    </UCard>

    <UCard>
      <div v-if="loading" class="text-center py-10 text-gray-400">
        Đang tải dữ liệu bản đồ...
      </div>

      <LeafletMap
        v-else
        :buildings="buildings"
        class="h-[600px] w-full"
      />
    </UCard>
  </div>
</template>
