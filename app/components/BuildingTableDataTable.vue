<script setup lang="ts">
import { ref  } from 'vue'
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-dt'
import type { Building } from '~/types/building'
import { createApp } from 'vue'
import ActionButtons from '~/components/ActionButtons.vue'
DataTable.use(DataTablesCore)

/* =====================
  EMITS
===================== */
const emit = defineEmits<{
  (e: 'edit', building: Building): void
  (e: 'delete', id: number | string | null | undefined): void
  (e: 'map', building: Building): void
}>()

const tableRef = ref()

/* =====================
  DATATABLE OPTIONS
===================== */
const options = {
  processing: true,
  serverSide: true,
  pageLength: 5,
  lengthMenu: [5, 10, 25, 50],
    drawCallback: () => {
    const table = tableRef.value.dt
    const rows: Building[] = table.rows().data().toArray()

    document.querySelectorAll('.dt-action').forEach((el) => {
      if (el.childElementCount) return

      const id = Number(el.getAttribute('data-id'))
      const building = rows.find(b => b.id === id)
      if (!building) return

      createApp(ActionButtons, {
        building,
        onEdit: (b:Building) => emit('edit', b),
        onDelete: (id:number) => emit('delete', id),
        onMap: (b:Building) => emit('map', b)
      }).mount(el)
    })
  },


  ajax: {
    url: '/api/buildings',
    type: 'POST',
    contentType: 'application/json',

    data: (d: any) => {
      return JSON.stringify({
        page: Math.floor(d.start / d.length) + 1,
        pageSize: d.length,
        search: d.search.value,
        order: d.order?.[0] ?? null
      })
    },

    dataSrc(res: any) {
      return res.data
    }
    
  },

  language: {
    processing: '⏳ Đang tải dữ liệu tòa nhà...',
    search: 'Tìm kiếm:',
    searchPlaceholder: '🔍 Tìm theo tên, địa chỉ, SĐT...',
    lengthMenu: 'Hiển thị _MENU_ dòng',
    info: 'Hiển thị _START_ – _END_ / _TOTAL_ bản ghi ',
    infoFiltered: '(lọc từ _MAX_ bản ghi)',
    emptyTable: 'Không có dữ liệu',
  }
}
/* ============
  COLUMNS 
=============== */
const columns = [
  { data: 'name', className: 'border border-gray-300 px-3 py-2 text-left whitespace-nowrap' },
  { data: 'address', className: 'border border-gray-300 px-3 py-2 text-left' },
  { data: 'representative', className: 'border border-gray-300 px-3 py-2 text-left' },
  { data: 'phone', className: 'border border-gray-300 px-3 py-2 text-left' },
  { data: 'cccd', className: 'border border-gray-300 px-3 py-2 text-left' },
  { data: 'cccdDate', className: 'border border-gray-300 px-3 py-2 text-left' },
  { data: 'lat', className: 'border border-gray-300 px-3 py-2 text-center' },
  { data: 'lng', className: 'border border-gray-300 px-3 py-2 text-center' },

  {
    data: "id",
    orderable: false,
    searchable: false,
    className: 'border border-gray-300 px-2 py-1 text-center',
    render: (id: number) => {
      return `<div class="dt-action" data-id="${id}"></div> `
    }
  }
]

/* =====================
  RELOAD (CRUD)
===================== */
const reloadTable = () => {
  tableRef.value?.dt.ajax.reload(null, false)
}

defineExpose({ reloadTable })
</script> 

<template>
  <ClientOnly>
    <div >
      <div class="overflow-x-auto relative">
        <DataTable
          ref="tableRef"
          class="display w-full text-sm border-collapse"
          :options="options"
          :columns="columns"
        >
          <thead>
            <tr class="bg-gray-200 text-gray-800 font-semibold">
              <th class="border border-gray-400 px-2 py-1 text-left">Tên</th>
              <th class="border border-gray-400 px-2 py-1 text-left">Địa chỉ</th>
              <th class="border border-gray-400 px-2 py-1 text-left">Đại diện</th>
              <th class="border border-gray-400 px-2 py-1 text-center">SĐT</th>
              <th class="border border-gray-400 px-2 py-1 text-center">CCCD</th>
              <th class="border border-gray-400 px-2 py-1 text-center">Ngày cấp</th>
              <th class="border border-gray-400 px-2 py-1 text-center">Vĩ độ</th>
              <th class="border border-gray-400 px-2 py-1 text-center">Kinh độ</th>
              <th class="border border-gray-400 px-2 py-1 text-center">Hành động</th>
            </tr>
          </thead>
        </DataTable>
      </div>
    </div>
  </ClientOnly>
</template>
<style scoped>

:deep(.dt-search input) {
  width: 280px;
  padding: 8px 12px;
  border: 1px solid #9ca3af;
  border-radius: 0.5rem;
}

:deep(.dt-paging button) {
  border: 1px solid #d1d5db;
  padding: 6px 10px;
  border-radius: 6px;
}

:deep(.dt-length select) {
  border: 1px solid #9ca3af;
  padding: 6px 10px;
  border-radius: 6px;
}
:deep(.dt-paging) {
  display: flex;
  justify-content: flex-end;
}
:deep(.dataTables_processing) {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.9);
  padding: 14px 22px;
  border-radius: 10px;
  font-weight: 600;
  z-index: 30;
  border: 1px solid #d1d5db;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
:deep(.dt-info ) {
  width: 250px;
  padding: 8px 12px;
  border: 1px solid #9ca3af;
  border-radius: 0.5rem;
}
</style>