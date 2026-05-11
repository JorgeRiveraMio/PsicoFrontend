<template>
  <div class="card shadow-sm border-0 module-card">
    <div
      class="card-header bg-white d-flex flex-wrap gap-2 justify-content-between align-items-center"
    >
      <div>
        <h6 class="mb-0 fw-semibold text-dark">Lista de Pacientes</h6>
        <small class="text-muted">{{ items.length }} registros encontrados</small>
      </div>

      <button class="btn btn-success btn-sm" @click="exportExcel" :disabled="!rows.length">
        <i class="bi bi-file-earmark-excel me-1"></i> Excel
      </button>
    </div>

    <div class="card-body bg-white">
      <div class="row g-2 mb-3">
        <div class="col-md-5 col-lg-4">
          <div class="input-group input-group-sm">
            <span class="input-group-text bg-light"><i class="bi bi-search"></i></span>
            <input
              v-model="filters.global.value"
              class="form-control"
              placeholder="Buscar paciente..."
            />
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-center py-5 text-muted">
        <span class="spinner-border spinner-border-sm me-2"></span>
        Cargando pacientes...
      </div>

      <div v-else-if="!rows.length" class="empty-state">
        <i class="bi bi-people"></i>
        <h6>No hay pacientes registrados</h6>
        <p>Cuando registres pacientes apareceran en esta lista.</p>
      </div>

      <DataTable
        v-else
        ref="dt"
        :value="rows"
        paginator
        :rows="8"
        :filters="filters"
        :globalFilterFields="[
          'cod_paciente',
          'nombre_completo',
          'num_telefono',
          'diagnostico_nombre',
          'psicologa_nombre',
        ]"
        class="p-datatable-sm"
      >
        <Column field="cod_paciente" header="Codigo" sortable>
          <template #body="slotProps">
            <span class="badge text-bg-light border">
              {{ slotProps.data.cod_paciente || '-' }}
            </span>
          </template>
        </Column>

        <Column field="nombre_completo" header="Paciente" sortable>
          <template #body="slotProps">
            <div class="fw-semibold text-dark">{{ slotProps.data.nombre_completo }}</div>
            <small class="text-muted">{{ slotProps.data.num_telefono || 'Sin telefono' }}</small>
          </template>
        </Column>

        <Column field="fec_nacimiento" header="Nacimiento" sortable>
          <template #body="slotProps">
            {{ formatFecha(slotProps.data.fec_nacimiento) }}
          </template>
        </Column>

        <Column field="diagnostico_nombre" header="Diagnostico" sortable>
          <template #body="slotProps">
            <span class="text-muted small">
              <i class="bi bi-clipboard2-pulse me-1"></i>
              {{ slotProps.data.diagnostico_nombre || '-' }}
            </span>
          </template>
        </Column>

        <Column field="psicologa_nombre" header="Psicologa" sortable>
          <template #body="slotProps">
            <span class="text-muted small">
              <i class="bi bi-person me-1"></i>
              {{ slotProps.data.psicologa_nombre || '-' }}
            </span>
          </template>
        </Column>

        <Column field="est_activo" header="Estado" sortable>
          <template #body="slotProps">
            <span
              class="badge rounded-pill"
              :class="slotProps.data.est_activo ? 'text-bg-success' : 'text-bg-secondary'"
            >
              {{ slotProps.data.est_activo ? 'Activo' : 'Inactivo' }}
            </span>
          </template>
        </Column>

        <Column header="Acciones">
          <template #body="slotProps">
            <div class="btn-group btn-group-sm">
              <button
                class="btn btn-outline-secondary"
                title="Detalle"
                @click="emit('detalle', slotProps.data.original)"
              >
                <i class="bi bi-eye"></i>
              </button>
              <button
                class="btn btn-outline-primary"
                title="Editar"
                @click="emit('editar', slotProps.data.original)"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <button
                class="btn"
                :class="slotProps.data.est_activo ? 'btn-outline-danger' : 'btn-outline-success'"
                :title="slotProps.data.est_activo ? 'Desactivar' : 'Activar'"
                @click="emit('cambiarEstado', slotProps.data.original)"
              >
                <i
                  class="bi"
                  :class="slotProps.data.est_activo ? 'bi-slash-circle' : 'bi-check-circle'"
                ></i>
              </button>
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import * as XLSX from 'xlsx'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import type { Diagnostico } from '../../types/entity/Diagnosticos'
import type { Paciente } from '../../types/entity/Paciente'
import type { Psicologo } from '../../types/entity/Psicologo'

const props = defineProps<{
  items: Paciente[]
  psicologos: Psicologo[]
  diagnosticos: Diagnostico[]
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'editar', item: Paciente): void
  (e: 'detalle', item: Paciente): void
  (e: 'cambiarEstado', item: Paciente): void
}>()

const filters = ref({
  global: { value: null, matchMode: 'contains' },
})

const rows = computed(() =>
  props.items.map((p) => ({
    ...p,
    nombre_completo: nombrePaciente(p),
    diagnostico_nombre: getDiagnosticoNombre(p.idt_diagnostico),
    psicologa_nombre: getPsicologoNombre(p.idu_psicologa),
    original: p,
  })),
)

const dt = ref()

const nombrePaciente = (p: Paciente) => {
  return `${p.des_nombres || p.des_nombre || ''} ${p.des_ape_paterno ?? ''} ${p.des_ape_materno ?? ''}`.trim()
}

const formatFecha = (fecha?: string | null) => {
  if (!fecha) return '-'
  return new Date(fecha).toLocaleDateString()
}

const getDiagnosticoNombre = (id: number | null | undefined) => {
  if (!id) return '-'
  const diagnostico = props.diagnosticos.find((d) => d.idt_diagnostico === Number(id))
  return diagnostico ? `${diagnostico.cod_diagnostico} - ${diagnostico.des_diagnostico}` : '-'
}

const getPsicologoNombre = (id: string | null | undefined) => {
  if (!id) return '-'
  const p = props.psicologos.find((x) => x.idu_usuario === id)
  return p ? `${p.des_nombres ?? ''} ${p.ape_pater ?? ''} ${p.ape_mater ?? ''}`.trim() : '-'
}

const exportExcel = () => {
  const data = (dt.value?.filteredValue || rows.value).map((p: Paciente) => ({
    codigo: p.cod_paciente,
    paciente: (p as Paciente & { nombre_completo?: string }).nombre_completo,
    telefono: p.num_telefono,
    nacimiento: formatFecha(p.fec_nacimiento),
    ingreso: formatFecha(p.fec_ingreso),
    diagnostico: (p as Paciente & { diagnostico_nombre?: string }).diagnostico_nombre,
    psicologa: (p as Paciente & { psicologa_nombre?: string }).psicologa_nombre,
    estado: p.est_activo ? 'Activo' : 'Inactivo',
  }))

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Pacientes')
  XLSX.writeFile(wb, 'pacientes.xlsx')
}
</script>

<style scoped>
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
</style>
