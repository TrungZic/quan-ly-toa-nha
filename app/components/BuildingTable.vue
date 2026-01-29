<script setup lang="ts">
import type { Building } from '~/types/building'
import type { TableColumn } from '@nuxt/ui'

defineProps<{
  buildings: Building[]
}>()

const emit = defineEmits<{
  (e: 'edit', building: Building): void
  (e: 'delete', id: number | string): void
  (e: 'view-map', building: Building): void
}>()

/* =====================
  TABLE COLUMNS (v4)
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

  {
    id: 'actions',
    header: 'Hành động'
  }
]
</script>

<template>
  <ClientOnly>
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">
          📋 Danh sách tòa nhà
        </h3>
      </template>

      <UTable
        v-if="buildings.length"
        :data="buildings"
        :columns="columns"
      >
        <!-- Slot name = id của column -->
<template #actions-cell="{ row }">
  <div class="flex gap-2">
    <UButton
      size="xs"
      variant="soft"
      icon="i-heroicons-pencil-square"
      @click="emit('edit', row.original)"
    >
      Sửa
    </UButton>

    <UButton
      size="xs"
      color="error"
      variant="soft"
      icon="i-heroicons-trash"
      :disabled="!row.original.id"
      @click="row.original.id && emit('delete', row.original.id)"
    >
      Xóa
    </UButton>
    <UButton
      size="xs"
      color="primary"
      variant="soft"
      icon="i-heroicons-map-pin"
      @click="emit('view-map', row.original)"
    >
      Bản đồ
    </UButton>

  </div>
</template>
      </UTable>

      <div
        v-else
        class="text-center py-12 text-gray-400"
      >
        <div class="text-5xl mb-4">📭</div>
        <p class="text-lg">Không có dữ liệu tòa nhà</p>
        <p class="text-sm mt-1">Hãy thêm tòa nhà mới để bắt đầu</p>
      </div>
    </UCard>
  </ClientOnly>
</template>
