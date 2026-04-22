<template>
  <div v-if="show" class="modal fade show d-block">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ data ? 'Editar Paciente' : 'Nuevo Paciente' }}
          </h5>
          <button class="btn-close" @click="emit('close')"></button>
        </div>

        <div class="modal-body">
          <PacienteForm :data="data" :psicologos="psicologos" @submit="guardar" />
        </div>
      </div>
    </div>
  </div>

  <div v-if="show" class="modal-backdrop fade show"></div>
</template>

<script setup lang="ts">
import PacienteForm from './PacienteForm.vue'
import type { Paciente } from '../../types/entity/Paciente'
import type { Psicologo } from '../../types/entity/Psicologo'

defineProps<{
  show: boolean
  data: Paciente | null
  psicologos: Psicologo[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'guardar', data: Paciente): void
}>()

const guardar = (formData: Paciente) => {
  emit('guardar', formData)
}
</script>
