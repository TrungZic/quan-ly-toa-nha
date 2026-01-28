<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import BuildingForm from '~/components/BuildingForm.vue'
import type { Building } from '~/types/building'
import type { TableColumn } from '@nuxt/ui'
import BuildingTable from '~/components/BuildingTable.vue'
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

/* =====================
  LOAD DATA (CLIENT ONLY)
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
  TABLE COLUMNS (Nuxt UI v4)
===================== */
const columns: TableColumn<Building>[] = [
  { accessorKey: 'name', header: 'Tên' },
  { accessorKey: 'address', header: 'Địa chỉ' },
  { accessorKey: 'representative', header: 'Đại diện' },
  { accessorKey: 'phone', header: 'SĐT' },
  { accessorKey: 'cccd', header: 'CCCD' },
  { accessorKey: 'cccdDate', header: 'Ngày cấp' },
  { id: 'actions',header: 'Hành động'
  }
]

const pagination = ref({
  pageIndex: 0,
  pageSize: 5
})
const pagedBuildings = computed(() => {
  const start = pagination.value.pageIndex * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  return buildings.value.slice(start, end)
})
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
  <div class="max-w-6xl mx-auto p-6 space-y-6">

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
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">
              📋 Danh sách tòa nhà
            </h3>
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
        </template>

        <UTable
          :data="buildings"
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
            </div>
          </template>
        </UTable>

        <div
          v-if="!loading && buildings.length === 0"
          class="text-center text-gray-400 py-6"
        >
          Không có dữ liệu tòa nhà
        </div>
      </UCard>
    </ClientOnly>

  </div>
</template>
