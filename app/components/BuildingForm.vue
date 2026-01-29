<script setup lang="ts">
import { ref, watch } from 'vue'
import Swal from 'sweetalert2'
import type { Building } from '~/types/building'

/* ================= PROPS & EMITS ================= */
const props = defineProps<{
  editingBuilding: Building | null
}>()

const emit = defineEmits<{
  (e: 'submit', building: Building): void
  (e: 'cancel'): void
}>()

/* ================= FORM STATE ================= */
const emptyForm: Building = {
  name: '',
  address: '',
  representative: '',
  phone: '',
  cccd: '',
  cccdDate: '',
  lat: undefined,
  lng: undefined
}

const form = ref<Building>({ ...emptyForm })

const errors = ref<Partial<Record<keyof Building, string>>>({})

/* ================= RESET ================= */
const resetForm = () => {
  form.value = { ...emptyForm }
  errors.value = {}
}

/* ================= WATCH EDIT ================= */
watch(
  () => props.editingBuilding,
  (val) => {
    if (val) {
      form.value = { ...val }
      errors.value = {}
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

/* ================= VALIDATE ================= */
const validate = () => {
  errors.value = {}

  if (!form.value.name || form.value.name.length < 3) {
    errors.value.name = 'Tên tòa nhà tối thiểu 3 ký tự'
  }

  if (!form.value.address) {
    errors.value.address = 'Địa chỉ không được để trống'
  }

  if (!form.value.representative) {
    errors.value.representative = 'Người đại diện không được để trống'
  }

  if (!/^0\d{9}$/.test(form.value.phone)) {
    errors.value.phone = 'SĐT gồm 10 số, bắt đầu bằng 0'
  }

  if (!/^\d{12}$/.test(form.value.cccd)) {
    errors.value.cccd = 'CCCD phải đúng 12 chữ số'
  }

  if (!form.value.cccdDate) {
    errors.value.cccdDate = 'Vui lòng chọn ngày cấp'
  } else if (new Date(form.value.cccdDate) > new Date()) {
    errors.value.cccdDate = 'Ngày cấp không hợp lệ'
  }
  if (
  form.value.lat === undefined ||
  form.value.lat < -90 ||
  form.value.lat > 90
  ) {
    errors.value.lat = 'Vĩ độ phải nằm trong khoảng -90 đến 90'
  }

  if (
    form.value.lat === undefined ||
    form.value.lat < -180 ||
    form.value.lat > 180
  ) {
    errors.value.lat = 'Kinh độ phải nằm trong khoảng -180 đến 180'
  }


  return Object.keys(errors.value).length === 0
}

/* ================= SUBMIT ================= */
const submitForm = () => {
  if (!validate()) {
    Swal.fire({
      icon: 'error',
      title: 'Dữ liệu không hợp lệ',
      text: 'Vui lòng kiểm tra lại thông tin'
    })
    return
  }

  emit('submit', { ...form.value })
  resetForm()
}

/* ================= CANCEL ================= */
const handleCancel = () => {
  resetForm()
  emit('cancel')
}
</script>

<template>
  <UCard>
    <template #header>
      <div>
        <h3 class="text-lg font-semibold">
          {{ form.id ? '✏️ Chỉnh sửa tòa nhà' : '➕ Thêm tòa nhà mới' }}
        </h3>
        <p class="text-sm text-gray-500 mt-1">
          Nhập đầy đủ thông tin quản lý tòa nhà
        </p>
      </div>
    </template>

    <UForm class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UFormField label="Tên tòa nhà" required :error="errors.name">
        <UInput v-model="form.name" placeholder="nhập tên tòa nhà" />
      </UFormField>

      <UFormField label="Địa chỉ" required :error="errors.address">
        <UInput v-model="form.address" placeholder="nhập địa chỉ" />
      </UFormField>

      <UFormField label="Người đại diện" required :error="errors.representative">
        <UInput v-model="form.representative" placeholder="nhập tên người đại diện" />
      </UFormField>

      <UFormField label="Số điện thoại" required :error="errors.phone">
        <UInput v-model="form.phone" placeholder="Nhập sdt" />
      </UFormField>

      <UFormField label="CCCD" required :error="errors.cccd">
        <UInput v-model="form.cccd" placeholder="Nhập cccd" />
      </UFormField>

      <UFormField label="Ngày cấp" required :error="errors.cccdDate">
        <UInput v-model="form.cccdDate" type="date"/>
      </UFormField>
      <UFormField label="Vĩ độ (Latitude)" required :error="errors.lat">
        <UInput
          v-model.number="form.lat"
          type="number"
          step="any"
          placeholder="VD: 21.0285"
        />
      </UFormField>

      <UFormField label="Kinh độ (Longitude)" required :error="errors.lng">
        <UInput
          v-model.number="form.lng"
          type="number"
          step="any"
          placeholder="VD: 105.8542"
        />
      </UFormField>

    </UForm>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton variant="soft" color="warning" @click="handleCancel">
          Hủy
        </UButton>
        <UButton color="primary" @click="submitForm">
          {{ form.id ? 'Cập nhật' : 'Lưu thông tin' }}
        </UButton>
      </div>
    </template>
  </UCard>
</template>
