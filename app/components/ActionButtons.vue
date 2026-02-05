<script setup lang="ts">
import type { Building } from '~/types/building'

const props = defineProps<{
  building: Building
  onEdit: (b: Building) => void
  onDelete: (id: number) => void
  onMap: (b: Building) => void
}>()

const deleteBuilding = () => {
  if (props.building.id == null) return
  props.onDelete(Number(props.building.id))
}
</script>

<template>
  <div class="flex justify-center gap-2">
    <UButton
      icon="i-heroicons-pencil"
      size="sm"
      color="primary"
      title="Chỉnh sửa"
      variant="soft" 
      @click="props.onEdit(props.building)"
    />

    <UButton
      icon="i-heroicons-trash"
      size="sm"
      color="error"
      title="Xóa"
      variant="soft"
      @click="deleteBuilding"
    />

    <UButton
      icon="i-heroicons-map"
      size="sm"
      color="info"
      title="Bản đồ"
      variant="soft"
      @click="props.onMap(props.building)"
    />
  </div>
</template>