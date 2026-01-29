<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Swal from 'sweetalert2'
import BuildingForm from '~/components/BuildingForm.vue'
import type { Building } from '~/types/building'
import type { TableColumn } from '@nuxt/ui'

/* =====================
  PAGE CONFIG
===================== */
definePageMeta({
  ssr: false
})

/* =====================
  STATE
===================== */
const buildings = ref<Building[]>([])
const editingBuilding = ref<Building | null>(null)
const loading = ref(false)
const searchQuery = ref('')

/* =====================
  LOAD DATA 
===================== */
const loadBuildings = async () => {
  loading.value = true
  try {
    buildings.value = await $fetch<Building[]>('/api/buildings')
  } finally {
    loading.value = false
  }
}

onMounted(loadBuildings)

/* =====================
  TABLE COLUMNS 
===================== */
const columns: TableColumn<Building>[] = [
  { accessorKey: 'name', header: 'Tên' },
  { accessorKey: 'address', header: 'Địa chỉ' },
  { accessorKey: 'representative', header: 'Đại diện' },
  { accessorKey: 'phone', header: 'SĐT' },
  { accessorKey: 'cccd', header: 'CCCD' },
  { accessorKey: 'cccdDate', header: 'Ngày cấp' },
  { accessorKey: 'lat', header: 'Vĩ độ' },
  { accessorKey: 'lng', header: 'Kinh độ' },
  { id: 'actions', header: 'Hành động' }
]
/* =====================
  PAGINATION & SEARCH
===================== */
const pagination = ref({
  pageIndex: 0,
  pageSize: 5
})

// 🔍 Dữ liệu sau khi lọc theo tìm kiếm
const filteredBuildings = computed(() => {
  if (!searchQuery.value.trim()) {
    return buildings.value
  }
  
  const query = searchQuery.value.toLowerCase().trim()
  
  return buildings.value.filter(building => 
    building.name.toLowerCase().includes(query) ||
    building.address.toLowerCase().includes(query) ||
    building.representative.toLowerCase().includes(query) ||
    building.phone.includes(query) ||
    building.cccd.includes(query) ||
    String(building.lat).includes(query) ||
    String(building.lng).includes(query)
  )
})

// 📄 Dữ liệu sau khi phân trang
const pagedBuildings = computed(() => {
  const start = pagination.value.pageIndex * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  return filteredBuildings.value.slice(start, end)
})

// 📊 Thông tin phân trang
const paginationInfo = computed(() => {
  const total = filteredBuildings.value.length
  const pageCount = Math.ceil(total / pagination.value.pageSize) || 1
  return {
    total,
    pageCount,
    currentPage: pagination.value.pageIndex + 1,
    hasNextPage: pagination.value.pageIndex < pageCount - 1,
    hasPrevPage: pagination.value.pageIndex > 0
  }
})

/* =====================
  SEARCH & PAGINATION HANDLERS
===================== */
const handleSearch = () => {
  // Reset về trang 1 khi tìm kiếm
  pagination.value.pageIndex = 0
}

const handlePageChange = (newPageIndex: number) => {
  pagination.value.pageIndex = newPageIndex
}

const goToNextPage = () => {
  if (paginationInfo.value.hasNextPage) {
    pagination.value.pageIndex++
  }
}

const goToPreviousPage = () => {
  if (paginationInfo.value.hasPrevPage) {
    pagination.value.pageIndex--
  }
}

/* =====================
  ACTIONS
===================== */
const handleEdit = (building: Building) => {
  editingBuilding.value = { ...building }
}

const handleDelete = async (id?: number | string | null) => {
  if (!id) {
    Swal.fire('Lỗi', 'ID không hợp lệ', 'error')
    return
  }

  const result = await Swal.fire({
    title: 'Xóa tòa nhà?',
    text: 'Bạn có chắc muốn xóa không?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy'
  })

  if (!result.isConfirmed) return

  await $fetch('/api/buildings', {
    method: 'DELETE',
    query: { id: String(id) }
  })

  await loadBuildings()
  Swal.fire('Đã xóa', 'Xóa thành công', 'success')
}

const submitBuilding = async (building: Building) => {
  const method = building.id ? 'PUT' : 'POST'

  await $fetch('/api/buildings', {
    method,
    body: building
  })

  Swal.fire('Thành công', 'Lưu dữ liệu thành công', 'success')
  editingBuilding.value = null
  await loadBuildings()
}
</script>

<template>
  <div class="max-w-7xl mx-auto p-6 space-y-6">

    <!-- TITLE -->
    <UCard>
      <h1 class="text-xl font-semibold">
        🏢 Quản lý tòa nhà Hà Nội
      </h1>
    </UCard>

    <!-- FORM -->
    <BuildingForm
      :editingBuilding="editingBuilding"
      @submit="submitBuilding"
      @cancel="editingBuilding = null"
    />

    <!-- TABLE -->
    <ClientOnly>
      <UCard>
        <template #header>
          <div class="flex items-center justify-between gap-4">
            <h3 class="text-lg font-semibold">
              📋 Danh sách tòa nhà
            </h3>
            <div class="flex gap-2 items-center flex-1">
              <!-- SEARCH INPUT -->
              <UInput
                v-model="searchQuery"
                placeholder="🔍 Tìm theo tên, địa chỉ, SĐT..."
                icon="i-heroicons-magnifying-glass"
                @input="handleSearch"
                size="sm"
                class="flex-1"
              />
              
              <UButton
                size="xs"
                variant="soft"
                icon="i-heroicons-arrow-path"
                :loading="loading"
                @click="loadBuildings"
              >
                Tải lại
              </UButton>
            </div>
          </div>
        </template>

        <!-- SEARCH RESULTS INFO -->
        <div v-if="searchQuery" class="mb-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-600">
          🔍 Tìm thấy <strong>{{ filteredBuildings.length }}</strong> kết quả
          <span v-if="filteredBuildings.length === 0"> - Không có dữ liệu phù hợp</span>
        </div>

        <!-- TABLE -->
        <UTable
          v-if="pagedBuildings.length > 0"
          :data="pagedBuildings"
          :columns="columns"
          :loading="loading"
        >
          <!-- Slot action: dùng id của column -->
          <template #actions-cell="{ row }">
            <div class="flex gap-2">
              <UButton
                size="xs"
                variant="soft"
                icon="i-heroicons-pencil-square"
                @click="handleEdit(row.original)"
              >
                Sửa
              </UButton>

              <UButton
                size="xs"
                color="error"
                variant="soft"
                icon="i-heroicons-trash"
                @click="handleDelete(row.original.id)"
              >
                Xóa
              </UButton>
              <UButton
                size="xs"
                color="primary"
                variant="soft"
                icon="i-heroicons-map-pin"
                @click="navigateTo(`/map?lat=${row.original.lat}&lng=${row.original.lng}`)"
              >
                Bản đồ
              </UButton>

            </div>
          </template>
        </UTable>

        <!-- EMPTY STATE -->
        <div
          v-else
          class="text-center text-gray-400 py-12"
        >
          <div class="text-5xl mb-3">📭</div>
          <p v-if="searchQuery" class="text-lg">
            Không tìm thấy tòa nhà nào
          </p>
          <p v-else class="text-lg">
            Không có dữ liệu tòa nhà
          </p>
        </div>

        <!-- PAGINATION CONTROLS -->
        <template #footer v-if="paginationInfo.pageCount > 1 || pagedBuildings.length > 0">
          <div class="flex items-center justify-between">
            <!-- PAGINATION INFO -->
            <div class="text-sm text-gray-600">
              Trang <strong>{{ paginationInfo.currentPage }}</strong> 
              / <strong>{{ paginationInfo.pageCount }}</strong>
              (Tổng: <strong>{{ paginationInfo.total }}</strong> tòa nhà)
            </div>

            <!-- PAGINATION BUTTONS -->
            <div class="flex gap-2 items-center">
              <UButton
                size="xs"
                variant="soft"
                icon="i-heroicons-chevron-left"
                :disabled="!paginationInfo.hasPrevPage"
                @click="goToPreviousPage"
              >
                Trước
              </UButton>

              <!-- PAGE SELECTOR -->
              <div class="flex items-center gap-2" v-if="paginationInfo.pageCount > 1">
                <span class="text-sm text-gray-500">Trang:</span>
                <USelect
                  :model-value="pagination.pageIndex"
                  :options="Array.from({ length: paginationInfo.pageCount }, (_, i) => ({
                    label: String(i + 1),
                    value: i
                  }))"
                  size="xs"
                  @update:modelValue="v => v !== undefined && handlePageChange(v as number)"
                />
              </div>

              <UButton
                size="xs"
                variant="soft"
                icon="i-heroicons-chevron-right"
                :disabled="!paginationInfo.hasNextPage"
                @click="goToNextPage"
              >
                Tiếp
              </UButton>
            </div>
          </div>
        </template>
      </UCard>
      
    </ClientOnly>

  </div>
</template>