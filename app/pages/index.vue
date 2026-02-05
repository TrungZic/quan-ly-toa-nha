<script setup lang="ts">
import { ref, onMounted } from 'vue'
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
const tableKey = ref(0)


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
  tableKey.value++

  await loadBuildings()
  Swal.fire('Đã xóa', 'Xóa thành công', 'success')
}

const submitBuilding = async (building: Building) => {
  const method = building.id ? 'PUT' : 'POST'

  await $fetch('/api/buildings', {
    method,
    body: building
  })
  await loadBuildings()

  tableKey.value++

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
        🏢 Quản lý tòa nhà
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
      <!-- =====================
            DATATABLES JS TABLE
        ===================== -->

        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">
              📊 Danh sách tòa nhà
            </h3>
          </template>

          <BuildingTableDataTable
          :key="tableKey"
          :data="buildings"
          @edit="handleEdit"
          @delete="handleDelete"
          @map="b => navigateTo(`/map?lat=${b.lat}&lng=${b.lng}`)"
        />
        </UCard>


 </ClientOnly>

  </div>
</template>