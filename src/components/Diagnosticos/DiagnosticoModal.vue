<template>
  <div v-if="show" class="modal fade show d-block" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0 shadow">
        <div class="modal-header">
          <div>
            <h5 class="modal-title">
              {{ data ? 'Editar diagnostico' : 'Nuevo diagnostico' }}
            </h5>
            <small class="text-muted">Catalogo usado en el registro de pacientes</small>
          </div>
          <button class="btn-close" @click="emit('close')"></button>
        </div>

        <div class="modal-body">
          <DiagnosticoForm :data="data" @submit="guardar" />
        </div>
      </div>
    </div>
  </div>

  <div v-if="show" class="modal-backdrop fade show"></div>
</template>

<script setup lang="ts">
import DiagnosticoForm from './DiagnosticoForm.vue'
import type { Diagnostico } from '../../types/entity/Diagnosticos'

defineProps<{
  show: boolean
  data: Diagnostico | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'guardar', data: Diagnostico): void
}>()

const guardar = (formData: Diagnostico) => {
  emit('guardar', formData)
}
</script>
