<template>
  <div>
    <h5 class="fw-semibold text-dark mb-1">Pacientes</h5>
    <p class="text-muted small">Listado y registro de pacientes.</p>

    <!-- BOTÓN -->
    <button class="btn btn-primary mb-3" @click="abrirModal">
      <i class="bi bi-plus"></i> Nuevo Paciente
    </button>

    <!-- TABLA -->
    <PacientesTable :items="pacientes" :psicologos="psicologos" @editar="editar" />

    <!-- MODAL -->
    <PacienteModal
      :show="showModal"
      :data="pacienteSeleccionado"
      :psicologos="psicologos"
      @close="cerrarModal"
      @guardar="guardar"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

import type { Paciente } from '../../types/entity/Paciente'
import type { Psicologo } from '../../types/entity/Psicologo'

import PacientesTable from '../../components/Pacientes/PacientesTable.vue'
import PacienteModal from '../../components/Pacientes/PacienteModal.vue'

import { select, insert, update } from '../../lib/db'

// ------------------------

const pacientes = ref<Paciente[]>([])
const psicologos = ref<Psicologo[]>([])

const showModal = ref<boolean>(false)
const pacienteSeleccionado = ref<Paciente | null>(null)

// ------------------------

const abrirModal = () => {
  pacienteSeleccionado.value = null
  showModal.value = true
}

const cerrarModal = () => {
  showModal.value = false
}

const editar = (item: Paciente) => {
  pacienteSeleccionado.value = item
  showModal.value = true
}

// ------------------------
// CARGAS
// ------------------------

const cargarPacientes = async () => {
  const resp = await select<Paciente>('tbm_paciente')

  if (resp.isOk && resp.modelResponse) {
    pacientes.value = resp.modelResponse
  } else {
    console.error(resp.message)
  }
}

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

const guardar = async (data: Paciente) => {
  if (pacienteSeleccionado.value?.idm_paciente) {
    // UPDATE
    await update<Paciente>('tbm_paciente', data, {
      idm_paciente: pacienteSeleccionado.value.idm_paciente,
    })
  } else {
    // INSERT
    await insert<Paciente>('tbm_paciente', data)
  }

  cerrarModal()
  cargarPacientes()
}

// ------------------------

onMounted(() => {
  cargarPacientes()
  cargarPsicologos()
})
</script>
