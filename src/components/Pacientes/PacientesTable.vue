<template>
  <div class="card shadow-sm border-0">
    <!-- HEADER -->
    <div class="card-header bg-white d-flex justify-content-between align-items-center">
      <h6 class="mb-0 fw-semibold text-dark">Lista de Pacientes</h6>

      <button class="btn btn-success btn-sm" @click="exportExcel">
        <i class="bi bi-file-earmark-excel me-1"></i> Excel
      </button>
    </div>

    <div class="card-body bg-white">
      <!-- BUSCADOR -->
      <div class="row mb-3">
        <div class="col-md-4">
          <input
            v-model="filters.global.value"
            class="form-control form-control-sm"
            placeholder="Buscar paciente..."
          />
        </div>
      </div>

      <!-- TABLA -->
      <DataTable
        ref="dt"
        :value="rows"
        paginator
        :rows="5"
        :filters="filters"
        :globalFilterFields="['cod_paciente', 'des_nombre', 'num_telefono']"
        class="p-datatable-sm"
      >
        <Column field="cod_paciente" header="Código" sortable>
          <template #body="slotProps">
            <span class="badge bg-light text-dark border">
              {{ slotProps.data.cod_paciente }}
            </span>
          </template>
        </Column>

        <Column field="des_nombre" header="Nombre" sortable />

        <Column field="num_telefono" header="Teléfono" />

        <Column field="fec_ingreso" header="Ingreso" sortable>
          <template #body="slotProps">
            {{ formatFecha(slotProps.data.fec_ingreso) }}
          </template>
        </Column>
        <Column header="Psicóloga">
          <template #body="slotProps">
            <span class="text-muted small">
              <i class="bi bi-person me-1"></i>
              {{ getPsicologoNombre(slotProps.data.idu_psicologa) }}
            </span>
          </template>
        </Column>
        <Column field="est_activo" header="Estado">
          <template #body="slotProps">
            <span class="badge" :class="slotProps.data.est_activo ? 'bg-success' : 'bg-secondary'">
              {{ slotProps.data.est_activo ? 'Activo' : 'Inactivo' }}
            </span>
          </template>
        </Column>

        <Column header="Acciones">
          <template #body="slotProps">
            <button class="btn btn-sm btn-outline-primary" @click="emit('editar', slotProps.data)">
              <i class="bi bi-pencil"></i>
            </button>
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

import type { Paciente } from '../../types/entity/Paciente'
import type { Psicologo } from '../../types/entity/Psicologo'

const props = defineProps<{
  items: Paciente[]
  psicologos: Psicologo[]
}>()

const emit = defineEmits<{
  (e: 'editar', item: Paciente): void
}>()

const filters = ref({
  global: { value: null, matchMode: 'contains' },
})

const rows = computed(() => props.items)

const formatFecha = (f: string) => {
  return new Date(f).toLocaleDateString()
}

const dt = ref()

const exportExcel = () => {
  const data = (dt.value?.filteredValue || rows.value).map((p: Paciente) => ({
    codigo: p.cod_paciente,
    nombre: p.des_nombre,
    telefono: p.num_telefono,
    ingreso: formatFecha(p.fec_ingreso),
    estado: p.est_activo ? 'Activo' : 'Inactivo',
  }))

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(wb, ws, 'Pacientes')
  XLSX.writeFile(wb, 'pacientes.xlsx')
}
const getPsicologoNombre = (id: string | null | undefined) => {
  if (!id) return '-'

  if (!props.psicologos || props.psicologos.length === 0) return '-'

  const p = props.psicologos.find((x) => x.idu_usuario === id)

  if (!p) return '-'

  return `${p.des_nombr ?? ''} ${p.ape_pater ?? ''}`.trim()
}
</script>
