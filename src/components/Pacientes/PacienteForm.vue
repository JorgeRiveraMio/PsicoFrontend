<template>
  <form class="paciente-form" @submit.prevent="submit">
    <div v-if="error" class="alert alert-danger py-2 small">
      {{ error }}
    </div>

    <div class="row g-3">
      <div class="col-md-4">
        <label class="form-label">Codigo</label>
        <input v-model.trim="form.cod_paciente" class="form-control" placeholder="Autogenerado" />
      </div>

      <div class="col-md-8">
        <label class="form-label">Nombres</label>
        <input v-model.trim="form.des_nombres" class="form-control" required />
      </div>

      <div class="col-md-6">
        <label class="form-label">Apellido paterno</label>
        <input v-model.trim="form.des_ape_paterno" class="form-control" required />
      </div>

      <div class="col-md-6">
        <label class="form-label">Apellido materno</label>
        <input v-model.trim="form.des_ape_materno" class="form-control" required />
      </div>

      <div class="col-md-4">
        <label class="form-label">Telefono</label>
        <input v-model.trim="form.num_telefono" class="form-control" />
      </div>

      <div class="col-md-4">
        <label class="form-label">Fecha nacimiento</label>
        <input v-model="form.fec_nacimiento" type="date" class="form-control" required />
      </div>

      <div class="col-md-4">
        <label class="form-label">Fecha ingreso</label>
        <input v-model="form.fec_ingreso" type="date" class="form-control" required />
      </div>

      <div class="col-md-6">
        <label class="form-label">Diagnostico</label>
        <select v-model="form.idt_diagnostico" class="form-select" required>
          <option :value="null">Seleccionar diagnostico</option>
          <option
            v-for="diagnostico in diagnosticos"
            :key="diagnostico.idt_diagnostico"
            :value="diagnostico.idt_diagnostico"
          >
            {{ diagnostico.cod_diagnostico }} - {{ diagnostico.des_diagnostico }}
          </option>
        </select>
      </div>

      <div class="col-md-6">
        <label class="form-label">Psicologa</label>
        <select v-model="form.idu_psicologa" class="form-select" required>
          <option :value="null">Seleccionar psicologa</option>
          <option v-for="p in psicologos" :key="p.idu_usuario!" :value="p.idu_usuario">
            {{ nombrePsicologo(p) }}
          </option>
        </select>
      </div>

      <div class="col-12">
        <div class="form-check form-switch">
          <input
            id="pacienteActivo"
            v-model="form.est_activo"
            class="form-check-input"
            type="checkbox"
          />
          <label class="form-check-label" for="pacienteActivo">Activo</label>
        </div>
      </div>
    </div>

    <button class="btn btn-primary w-100 mt-4" :disabled="loading">
      <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
      Guardar paciente
    </button>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { Diagnostico } from '../../types/entity/Diagnosticos'
import type { Paciente } from '../../types/entity/Paciente'
import type { Psicologo } from '../../types/entity/Psicologo'

const props = defineProps<{
  data: Paciente | null
  psicologos: Psicologo[]
  diagnosticos: Diagnostico[]
}>()

const emit = defineEmits<{
  (e: 'submit', data: Paciente): void
}>()

const loading = ref(false)
const error = ref('')

const form = reactive<Paciente>({
  cod_paciente: '',
  des_nombres: '',
  des_ape_paterno: '',
  des_ape_materno: '',
  num_telefono: '',
  fec_ingreso: '',
  fec_nacimiento: '',
  idt_diagnostico: null,
  idu_psicologa: null,
  est_activo: true,
})

watch(
  () => props.data,
  (val) => {
    error.value = ''
    if (val) {
      Object.assign(form, {
        ...val,
        des_nombres: val.des_nombres || val.des_nombre || '',
      })
    } else {
      form.cod_paciente = ''
      form.des_nombres = ''
      form.des_ape_paterno = ''
      form.des_ape_materno = ''
      form.num_telefono = ''
      form.fec_ingreso = ''
      form.fec_nacimiento = ''
      form.idt_diagnostico = null
      form.idu_psicologa = null
      form.est_activo = true
    }
  },
  { immediate: true },
)

const nombrePsicologo = (p: Psicologo) => {
  return `${p.des_nombres ?? ''} ${p.ape_pater ?? ''} ${p.ape_mater ?? ''}`.trim()
}

const submit = () => {
  error.value = ''

  if (
    !form.des_nombres?.trim() ||
    !form.des_ape_paterno?.trim() ||
    !form.des_ape_materno?.trim() ||
    !form.fec_nacimiento ||
    !form.fec_ingreso ||
    !form.idt_diagnostico ||
    !form.idu_psicologa
  ) {
    error.value = 'Completa los campos obligatorios antes de guardar.'
    return
  }

  if (loading.value) return
  loading.value = true

  try {
    emit('submit', {
      cod_paciente: form.cod_paciente?.trim() || null,
      des_nombres: form.des_nombres.trim(),
      des_ape_paterno: form.des_ape_paterno.trim(),
      des_ape_materno: form.des_ape_materno.trim(),
      num_telefono: form.num_telefono?.trim() || null,
      fec_nacimiento: form.fec_nacimiento,
      fec_ingreso: form.fec_ingreso,
      idt_diagnostico: Number(form.idt_diagnostico),
      idu_psicologa: form.idu_psicologa,
      est_activo: Boolean(form.est_activo),
    })
  } finally {
    loading.value = false
  }
}
</script>
