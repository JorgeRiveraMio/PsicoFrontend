<template>
  <div v-if="show" class="modal fade show d-block">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content border-0 shadow">
        <div class="modal-header">
          <div>
            <h5 class="modal-title">
              {{ data ? 'Editar Paciente' : 'Nuevo Paciente' }}
            </h5>
            <small class="text-muted">Datos personales, diagnostico y psicologa asignada</small>
          </div>
          <button class="btn-close" @click="emit('close')"></button>
        </div>

        <div class="modal-body">
          <PacienteForm
            :data="data"
            :psicologos="psicologos"
            :diagnosticos="diagnosticos"
            @submit="guardar"
          />
        </div>
      </div>
    </div>
  </div>

  <div v-if="show" class="modal-backdrop fade show"></div>
</template>

<script setup lang="ts">
import PacienteForm from './PacienteForm.vue'
import type { Diagnostico } from '../../types/entity/Diagnosticos'
import type { Paciente } from '../../types/entity/Paciente'
import type { Psicologo } from '../../types/entity/Psicologo'

defineProps<{
  show: boolean
  data: Paciente | null
  psicologos: Psicologo[]
  diagnosticos: Diagnostico[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'guardar', data: Paciente): void
}>()

const guardar = (formData: Paciente) => {
  emit('guardar', formData)
}
</script>
