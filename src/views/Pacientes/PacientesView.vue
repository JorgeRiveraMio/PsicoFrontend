<template>
  <div class="module-page">
    <div class="module-header">
      <div>
        <h5 class="fw-semibold text-dark mb-1">Pacientes</h5>
        <p class="text-muted small mb-0">
          Registro, seguimiento y asignacion clinica de pacientes.
        </p>
      </div>

      <button class="btn btn-primary" @click="abrirModal">
        <i class="bi bi-plus-lg me-1"></i> Nuevo Paciente
      </button>
    </div>

    <div v-if="error" class="alert alert-danger py-2 small mb-0">
      {{ error }}
    </div>

    <PacientesTable
      :items="pacientes"
      :psicologos="psicologos"
      :diagnosticos="diagnosticos"
      :loading="loading"
      @editar="editar"
      @detalle="verDetalle"
    />

    <PacienteModal
      :show="showModal"
      :data="pacienteSeleccionado"
      :psicologos="psicologosActivos"
      :diagnosticos="diagnosticosActivos"
      @close="cerrarModal"
      @guardar="guardar"
    />

    <div v-if="pacienteDetalle" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header">
            <h5 class="modal-title">Detalle del paciente</h5>
            <button class="btn-close" @click="pacienteDetalle = null"></button>
          </div>
          <div class="modal-body">
            <dl class="row mb-0 detail-list">
              <dt class="col-sm-4">Codigo</dt>
              <dd class="col-sm-8">{{ pacienteDetalle.cod_paciente || '-' }}</dd>

              <dt class="col-sm-4">Paciente</dt>
              <dd class="col-sm-8">{{ nombrePaciente(pacienteDetalle) }}</dd>

              <dt class="col-sm-4">Nacimiento</dt>
              <dd class="col-sm-8">{{ formatFecha(pacienteDetalle.fec_nacimiento) }}</dd>

              <dt class="col-sm-4">Telefono</dt>
              <dd class="col-sm-8">{{ pacienteDetalle.num_telefono || '-' }}</dd>

              <dt class="col-sm-4">Diagnostico</dt>
              <dd class="col-sm-8">{{ nombreDiagnostico(pacienteDetalle.idt_diagnostico) }}</dd>

              <dt class="col-sm-4">Psicologa</dt>
              <dd class="col-sm-8">{{ nombrePsicologo(pacienteDetalle.idu_psicologa) }}</dd>

              <dt class="col-sm-4">Ingreso</dt>
              <dd class="col-sm-8">{{ formatFecha(pacienteDetalle.fec_ingreso) }}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
    <div v-if="pacienteDetalle" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useToast } from 'vue-toastification'
import PacienteModal from '../../components/Pacientes/PacienteModal.vue'
import PacientesTable from '../../components/Pacientes/PacientesTable.vue'
import type { Diagnostico } from '../../types/entity/Diagnosticos'
import type { Paciente } from '../../types/entity/Paciente'
import type { Psicologo } from '../../types/entity/Psicologo'
import { insert, select, update } from '../../lib/db'

const PACIENTES_TABLE = 'tbm_paciente'
const PSICOLOGOS_TABLE = 'tbm_usuario'
const DIAGNOSTICOS_TABLE = 'tbt_diagnostico'

const toast = useToast()

const pacientes = ref<Paciente[]>([])
const psicologos = ref<Psicologo[]>([])
const diagnosticos = ref<Diagnostico[]>([])
const pacienteSeleccionado = ref<Paciente | null>(null)
const pacienteDetalle = ref<Paciente | null>(null)
const showModal = ref(false)
const loading = ref(false)
const saving = ref(false)
const error = ref('')

const psicologosActivos = computed(() => psicologos.value.filter((p) => p.est_activo !== false))
const diagnosticosActivos = computed(() => diagnosticos.value.filter((d) => d.est_activo !== false))

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

const verDetalle = (item: Paciente) => {
  pacienteDetalle.value = item
}

const cargarPacientes = async () => {
  const resp = await select<Paciente>(PACIENTES_TABLE)

  if (resp.isOk && resp.modelResponse) {
    pacientes.value = resp.modelResponse
    return
  }

  throw new Error(resp.message || 'No se pudieron cargar los pacientes.')
}

const cargarPsicologos = async () => {
  const resp = await select<Psicologo>(PSICOLOGOS_TABLE)

  if (resp.isOk && resp.modelResponse) {
    psicologos.value = resp.modelResponse
    return
  }

  throw new Error(resp.message || 'No se pudieron cargar las psicologas.')
}

const cargarDiagnosticos = async () => {
  const resp = await select<Diagnostico>(DIAGNOSTICOS_TABLE)

  if (resp.isOk && resp.modelResponse) {
    diagnosticos.value = resp.modelResponse
    return
  }

  throw new Error(resp.message || 'No se pudieron cargar los diagnosticos.')
}

const cargarDatos = async () => {
  loading.value = true
  error.value = ''

  try {
    await Promise.all([cargarPacientes(), cargarPsicologos(), cargarDiagnosticos()])
  } catch (err: any) {
    error.value = err.message
    toast.error(err.message)
  } finally {
    loading.value = false
  }
}

const buildPacientePayload = (data: Paciente) => ({
  cod_paciente: data.cod_paciente || null,
  des_nombres: data.des_nombres,
  des_ape_paterno: data.des_ape_paterno,
  des_ape_materno: data.des_ape_materno,
  num_telefono: data.num_telefono || null,
  fec_ingreso: data.fec_ingreso,
  fec_nacimiento: data.fec_nacimiento,
  idt_diagnostico: data.idt_diagnostico ? Number(data.idt_diagnostico) : null,
  idu_psicologa: data.idu_psicologa || null,
  est_activo: data.est_activo ?? true,
})

const guardar = async (data: Paciente) => {
  if (
    !data.des_nombres ||
    !data.des_ape_paterno ||
    !data.des_ape_materno ||
    !data.fec_nacimiento ||
    !data.idt_diagnostico ||
    !data.idu_psicologa
  ) {
    toast.warning('Completa los campos obligatorios antes de guardar.')
    return
  }

  saving.value = true
  const payload = buildPacientePayload(data)
  const resp = pacienteSeleccionado.value?.idm_paciente
    ? await update<Paciente>(PACIENTES_TABLE, payload, {
        idm_paciente: pacienteSeleccionado.value.idm_paciente,
      })
    : await insert<Paciente>(PACIENTES_TABLE, payload)
  saving.value = false

  if (!resp.isOk) {
    toast.error(resp.message || 'No se pudo guardar el paciente.')
    return
  }

  toast.success(resp.message)
  cerrarModal()
  await cargarDatos()
}

const nombrePaciente = (p: Paciente) => {
  return `${p.des_nombres || p.des_nombre || ''} ${p.des_ape_paterno ?? ''} ${p.des_ape_materno ?? ''}`.trim()
}

const nombreDiagnostico = (id: number | null | undefined) => {
  if (!id) return '-'
  const diagnostico = diagnosticos.value.find((d) => d.idt_diagnostico === Number(id))
  return diagnostico ? `${diagnostico.cod_diagnostico} - ${diagnostico.des_diagnostico}` : '-'
}

const nombrePsicologo = (id: string | null | undefined) => {
  if (!id) return '-'
  const p = psicologos.value.find((item) => item.idu_usuario === id)
  return p ? `${p.des_nombres ?? ''} ${p.ape_pater ?? ''} ${p.ape_mater ?? ''}`.trim() : '-'
}

const formatFecha = (fecha?: string | null) => {
  if (!fecha) return '-'
  return new Date(fecha).toLocaleDateString()
}

onMounted(cargarDatos)
</script>

<style scoped>
.module-page {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.module-header {
  align-items: center;
  display: flex;
  gap: 16px;
  justify-content: space-between;
}

.detail-list dt {
  color: #64748b;
  font-weight: 600;
}

.detail-list dd {
  color: #1e293b;
  margin-bottom: 12px;
}

@media (max-width: 575.98px) {
  .module-header {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
