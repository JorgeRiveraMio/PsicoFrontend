<template>
  <form @submit.prevent="submit">
    <div class="mb-2">
      <label class="form-label">Nombre</label>
      <input v-model="form.des_nombre" class="form-control" required />
    </div>

    <div class="mb-2">
      <label class="form-label">Teléfono</label>
      <input v-model="form.num_telefono" class="form-control" />
    </div>

    <div class="mb-2">
      <label class="form-label">Fecha ingreso</label>
      <input v-model="form.fec_ingreso" type="date" class="form-control" required />
    </div>

    <!-- SELECT PSICOLOGO -->
    <div class="mb-2">
      <label class="form-label">Psicólogo</label>
      <select v-model="form.idu_psicologa" class="form-select">
        <option :value="null">-- Seleccionar --</option>
        <option v-for="p in psicologos" :key="p.idu_usuario!" :value="p.idu_usuario">
          {{ p.des_nombr }} {{ p.ape_pater }}
        </option>
      </select>
    </div>

    <button class="btn btn-success w-100 mt-2" :disabled="loading">
      <span v-if="loading" class="spinner-border spinner-border-sm"></span>
      <span v-else>Guardar</span>
    </button>
  </form>
</template>

<script setup lang="ts">
import { reactive, watch, ref } from 'vue'
import type { Paciente } from '../../types/entity/Paciente'
import type { Psicologo } from '../../types/entity/Psicologo'

const props = defineProps<{
  data: Paciente | null
  psicologos: Psicologo[]
}>()

const emit = defineEmits<{
  (e: 'submit', data: Paciente): void
}>()

const loading = ref(false)

const form = reactive<Paciente>({
  des_nombre: '',
  num_telefono: '',
  fec_ingreso: '',
  idu_psicologa: null,
  est_activo: true,
})

watch(
  () => props.data,
  (val) => {
    if (val) Object.assign(form, val)
    else {
      form.des_nombre = ''
      form.num_telefono = ''
      form.fec_ingreso = ''
      form.idu_psicologa = null
      form.est_activo = true
    }
  },
  { immediate: true },
)

const submit = () => {
  if (loading.value) return
  loading.value = true

  try {
    emit('submit', { ...form })
  } finally {
    loading.value = false
  }
}
</script>
