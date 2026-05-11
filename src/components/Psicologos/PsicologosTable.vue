<template>
  <div class="card shadow-sm border-0">
    <!-- HEADER -->
    <div class="card-header bg-white d-flex justify-content-between align-items-center">
      <h6 class="mb-0 fw-semibold text-dark">Lista de Psicólogos</h6>

      <button class="btn btn-success btn-sm" @click="exportExcel">
        <i class="bi bi-file-earmark-excel me-1"></i> Excel
      </button>
    </div>

    <!-- BODY -->
    <div class="card-body bg-white">
      <!-- BUSCADOR -->
      <div class="row mb-3">
        <div class="col-md-4">
          <input
            v-model="filters.global.value"
            class="form-control form-control-sm"
            placeholder="Buscar psicólogo..."
          />
        </div>
      </div>

      <!-- TABLA -->
      <DataTable
        ref="dt"
        :value="rows"
        paginator
        :rows="5"
        class="p-datatable-sm"
        :filters="filters"
        :globalFilterFields="['nombre', 'des_email', 'est_activo']"
      >
        <!-- NOMBRE -->
        <Column field="nombre" header="Nombre" sortable>
          <template #body="slotProps">
            <div class="fw-semibold text-dark">
              {{ slotProps.data.nombre }}
            </div>
          </template>
        </Column>

        <!-- CORREO -->
        <Column field="des_email" header="Correo" sortable>
          <template #body="slotProps">
            <small class="text-muted">
              <i class="bi bi-envelope me-1"></i>
              {{ slotProps.data.des_email || '-' }}
            </small>
          </template>
        </Column>

        <!-- ESTADO -->
        <Column field="est_activo" header="Estado" sortable>
          <template #body="slotProps">
            <span
              class="badge rounded-pill"
              :class="slotProps.data.est_activo ? 'bg-success' : 'bg-secondary'"
            >
              {{ slotProps.data.est_activo ? 'Activo' : 'Inactivo' }}
            </span>
          </template>
        </Column>

        <!-- ACCIONES -->
        <Column header="Acciones">
          <template #body="slotProps">
            <div class="btn-group btn-group-sm">
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

import type { Psicologo } from '../../types/entity/Psicologo'

// props
const props = defineProps<{
  items: Psicologo[]
}>()

// emits
const emit = defineEmits<{
  (e: 'editar', item: Psicologo): void
  (e: 'cambiarEstado', item: Psicologo): void
}>()

const filters = ref({
  global: { value: null, matchMode: 'contains' },
})
// transformar datos
const rows = computed(() =>
  props.items.map((p) => ({
    ...p,
    nombre: `${p.des_nombres ?? ''} ${p.ape_pater ?? ''} ${p.ape_mater ?? ''}`.trim(),
    original: p,
  })),
)

// exportar excel
const dt = ref()

const exportExcel = () => {
  const data = dt.value?.filteredValue || rows.value

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(wb, ws, 'Psicologos')
  XLSX.writeFile(wb, 'psicologos.xlsx')
}
</script>
