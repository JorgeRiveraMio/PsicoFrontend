<template>
  <div>
    <h5 class="fw-semibold text-dark mb-1">Psicólogos</h5>
    <p class="text-muted small">Listado y registro de psicólogos.</p>

    <!-- BOTÓN -->
    <button class="btn btn-primary mb-3" @click="abrirModal">
      <i class="bi bi-plus"></i> Nuevo Psicólogo
    </button>

    <!-- TABLA -->
    <PsicologosTable
      :items="psicologos"
      @editar="editar"
      @cambiar-estado="cambiarEstadoPsicologo"
    />

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
import { useToast } from 'vue-toastification'
import type { Psicologo } from '../../types/entity/Psicologo'

import PsicologosTable from '../../components/Psicologos/PsicologosTable.vue'
import PsicologoModal from '../../components/Psicologos/PsicologoModal.vue'

import { registerPsicologo } from '@/lib/auth'
import { changeActiveStatus, select, update } from '../../lib/db'

const PSICOLOGOS_TABLE = 'tbm_usuario'
const toast = useToast()

// ------------------------
// STATE
// ------------------------
const psicologos = ref<Psicologo[]>([])
const showModal = ref<boolean>(false)
const psicologoSeleccionado = ref<Psicologo | null>(null)
const saving = ref(false)

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
  const resp = await select<Psicologo>(PSICOLOGOS_TABLE)

  if (resp.isOk && resp.modelResponse) {
    psicologos.value = resp.modelResponse
  } else {
    toast.error(resp.message || 'No se pudieron cargar los psicologos.')
  }
}

// ------------------------
// GUARDAR
// ------------------------
const guardar = async (data: Psicologo) => {
  if (psicologoSeleccionado.value?.idu_usuario) {
    // UPDATE
    const resp = await update<Psicologo>(PSICOLOGOS_TABLE, data, {
      idu_usuario: psicologoSeleccionado.value.idu_usuario,
    })

    if (!resp.isOk) {
      toast.error(resp.message || 'No se pudo actualizar el psicologo.')
      return
    }
  } else {
    // REGISTRO
    const resp = await registerPsicologo(data, '12345678')

    if (!resp.isOk) {
      toast.error(resp.message)
      return
    }
  }

  toast.success('Psicologo guardado correctamente.')
  cerrarModal()
  await cargarPsicologos()
}

const cambiarEstadoPsicologo = async (psicologo: Psicologo) => {
  if (!psicologo.idu_usuario) return

  const nuevoEstado = !psicologo.est_activo
  const accion = nuevoEstado ? 'activado' : 'desactivado'
  saving.value = true

  const resp = await changeActiveStatus<Psicologo>(PSICOLOGOS_TABLE, nuevoEstado, {
    idu_usuario: psicologo.idu_usuario,
  })

  saving.value = false

  if (!resp.isOk) {
    toast.error(resp.message || 'No se pudo cambiar el estado del psicologo.')
    return
  }

  toast.success(`Psicologo ${accion} correctamente.`)
  await cargarPsicologos()
}

// ------------------------
onMounted(cargarPsicologos)
</script>
