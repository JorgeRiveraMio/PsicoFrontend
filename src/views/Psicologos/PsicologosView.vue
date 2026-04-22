<template>
  <div>
    <h5 class="fw-semibold text-dark mb-1">Psicólogos</h5>
    <p class="text-muted small">Listado y registro de psicólogos.</p>

    <!-- BOTÓN -->
    <button class="btn btn-primary mb-3" @click="abrirModal">
      <i class="bi bi-plus"></i> Nuevo Psicólogo
    </button>

    <!-- TABLA -->
    <PsicologosTable :items="psicologos" @editar="editar" />

    <!-- MODAL -->
    <PsicologoModal
      :show="showModal"
      :data="psicologoSeleccionado"
      @close="cerrarModal"
      @guardar="guardar"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Psicologo } from '../../types/entity/Psicologo'

import PsicologosTable from '../../components/Psicologos/PsicologosTable.vue'
import PsicologoModal from '../../components/Psicologos/PsicologoModal.vue'

import { registerPsicologo } from '@/lib/auth'
import { select, update } from '../../lib/db'

// ------------------------
// STATE
// ------------------------
const psicologos = ref<Psicologo[]>([])
const showModal = ref<boolean>(false)
const psicologoSeleccionado = ref<Psicologo | null>(null)

// ------------------------
// UI ACTIONS
// ------------------------
const abrirModal = () => {
  psicologoSeleccionado.value = null
  showModal.value = true
}

const cerrarModal = () => {
  showModal.value = false
}

const editar = (item: Psicologo) => {
  psicologoSeleccionado.value = item
  showModal.value = true
}

// ------------------------
// DATA
// ------------------------
const cargarPsicologos = async () => {
  const resp = await select<Psicologo>('tbm_usuario')

  if (resp.isOk && resp.modelResponse) {
    psicologos.value = resp.modelResponse
  } else {
    console.error(resp.message)
  }
}

// ------------------------
// GUARDAR
// ------------------------
const guardar = async (data: Psicologo) => {
  if (psicologoSeleccionado.value?.idu_usuario) {
    // UPDATE
    await update<Psicologo>('tbm_usuario', data, {
      idu_usuario: psicologoSeleccionado.value.idu_usuario,
    })
  } else {
    // REGISTRO
    const resp = await registerPsicologo(data, '12345678')

    if (!resp.isOk) {
      console.error(resp.message)
      return
    }
  }

  cerrarModal()
  await cargarPsicologos()
}

// ------------------------
onMounted(cargarPsicologos)
</script>
