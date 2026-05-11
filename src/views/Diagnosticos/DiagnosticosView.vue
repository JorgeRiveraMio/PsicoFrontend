<template>
  <div class="module-page">
    <div class="module-header">
      <div>
        <h5 class="fw-semibold text-dark mb-1">Diagnosticos</h5>
        <p class="text-muted small mb-0">Mantenimiento del catalogo clinico usado en pacientes.</p>
      </div>

      <button class="btn btn-primary" @click="abrirModal">
        <i class="bi bi-plus-lg me-1"></i> Nuevo diagnostico
      </button>
    </div>

    <DiagnosticosTable
      :items="diagnosticos"
      :loading="loading"
      @editar="editar"
      @desactivar="pedirDesactivar"
    />

    <DiagnosticoModal
      :show="showModal"
      :data="diagnosticoSeleccionado"
      @close="cerrarModal"
      @guardar="guardar"
    />

    <div v-if="diagnosticoADesactivar" class="modal fade show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content border-0 shadow">
          <div class="modal-header">
            <h6 class="modal-title">Desactivar diagnostico</h6>
            <button class="btn-close" @click="diagnosticoADesactivar = null"></button>
          </div>
          <div class="modal-body">
            <p class="mb-2">El diagnostico quedara oculto en los selects de pacientes.</p>
            <div class="alert alert-warning py-2 small mb-0">
              {{ diagnosticoADesactivar.cod_diagnostico }} -
              {{ diagnosticoADesactivar.des_diagnostico }}
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-light" @click="diagnosticoADesactivar = null">Cancelar</button>
            <button class="btn btn-danger" :disabled="saving" @click="desactivar">
              <span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
              Desactivar
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="diagnosticoADesactivar" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useToast } from 'vue-toastification'
import DiagnosticoModal from '../../components/Diagnosticos/DiagnosticoModal.vue'
import DiagnosticosTable from '../../components/Diagnosticos/DiagnosticosTable.vue'
import type { Diagnostico } from '../../types/entity/Diagnosticos'
import { insert, select, update } from '../../lib/db'

const DIAGNOSTICOS_TABLE = 'tbt_diagnostico'

const toast = useToast()
const diagnosticos = ref<Diagnostico[]>([])
const diagnosticoSeleccionado = ref<Diagnostico | null>(null)
const diagnosticoADesactivar = ref<Diagnostico | null>(null)
const showModal = ref(false)
const loading = ref(false)
const saving = ref(false)

const normalizar = (value?: string | null) => value?.trim().toUpperCase() ?? ''

const abrirModal = () => {
  diagnosticoSeleccionado.value = null
  showModal.value = true
}

const cerrarModal = () => {
  showModal.value = false
}

const editar = (item: Diagnostico) => {
  diagnosticoSeleccionado.value = item
  showModal.value = true
}

const pedirDesactivar = (item: Diagnostico) => {
  diagnosticoADesactivar.value = item
}

const cargarDiagnosticos = async () => {
  loading.value = true
  const resp = await select<Diagnostico>(DIAGNOSTICOS_TABLE)
  loading.value = false

  if (resp.isOk && resp.modelResponse) {
    diagnosticos.value = resp.modelResponse
    return
  }

  toast.error(resp.message || 'No se pudieron cargar los diagnosticos.')
}

const existeDuplicado = (data: Diagnostico) => {
  const idActual = diagnosticoSeleccionado.value?.idt_diagnostico
  const codigo = normalizar(data.cod_diagnostico)
  const descripcion = normalizar(data.des_diagnostico)

  return diagnosticos.value.some((item) => {
    if (item.idt_diagnostico === idActual) return false
    return (
      normalizar(item.cod_diagnostico) === codigo ||
      normalizar(item.des_diagnostico) === descripcion
    )
  })
}

const guardar = async (data: Diagnostico) => {
  if (existeDuplicado(data)) {
    toast.warning('Ya existe un diagnostico con el mismo codigo o descripcion.')
    return
  }

  saving.value = true
  const payload = {
    cod_diagnostico: data.cod_diagnostico,
    des_diagnostico: data.des_diagnostico,
    est_activo: data.est_activo ?? true,
  }

  const resp = diagnosticoSeleccionado.value?.idt_diagnostico
    ? await update<Diagnostico>(DIAGNOSTICOS_TABLE, payload, {
        idt_diagnostico: diagnosticoSeleccionado.value.idt_diagnostico,
      })
    : await insert<Diagnostico>(DIAGNOSTICOS_TABLE, payload)

  saving.value = false

  if (!resp.isOk) {
    toast.error(resp.message || 'No se pudo guardar el diagnostico.')
    return
  }

  toast.success(resp.message)
  cerrarModal()
  await cargarDiagnosticos()
}

const desactivar = async () => {
  if (!diagnosticoADesactivar.value?.idt_diagnostico) return

  saving.value = true
  const resp = await update<Diagnostico>(
    DIAGNOSTICOS_TABLE,
    { est_activo: false },
    { idt_diagnostico: diagnosticoADesactivar.value.idt_diagnostico },
  )
  saving.value = false

  if (!resp.isOk) {
    toast.error(resp.message || 'No se pudo desactivar el diagnostico.')
    return
  }

  toast.success('Diagnostico desactivado correctamente.')
  diagnosticoADesactivar.value = null
  await cargarDiagnosticos()
}

onMounted(cargarDiagnosticos)
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

.empty-state {
  align-items: center;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  color: #64748b;
  display: flex;
  flex-direction: column;
  padding: 44px 16px;
  text-align: center;
}

.empty-state i {
  color: #6366f1;
  font-size: 2rem;
  margin-bottom: 10px;
}

.empty-state p {
  margin: 0;
}

@media (max-width: 575.98px) {
  .module-header {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
