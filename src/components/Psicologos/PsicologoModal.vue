<template>
  <div v-if="show" class="modal fade show d-block" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ data ? 'Editar Psicólogo' : 'Nuevo Psicólogo' }}
          </h5>
          <button class="btn-close" @click="emit('close')"></button>
        </div>

        <div class="modal-body">
          <PsicologoForm :data="data" @submit="guardar" />
        </div>
      </div>
    </div>
  </div>

  <!-- BACKDROP -->
  <div v-if="show" class="modal-backdrop fade show"></div>
</template>

<script setup lang="ts">
import PsicologoForm from './PsicologoForm.vue'
import type { Psicologo } from '../../types/entity/Psicologo'

defineProps<{
  show: boolean
  data: Psicologo | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'guardar', data: Psicologo): void
}>()

// ✅ Parámetro tipado
const guardar = (formData: Psicologo) => {
  emit('guardar', formData)
}
</script>
