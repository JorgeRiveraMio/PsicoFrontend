<template>
  <div class="card shadow-sm border-0 module-card">
    <div
      class="card-header bg-white d-flex flex-wrap gap-2 justify-content-between align-items-center"
    >
      <div>
        <h6 class="mb-0 fw-semibold text-dark">Lista de diagnosticos</h6>
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
              placeholder="Buscar diagnostico..."
            />
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-center py-5 text-muted">
        <span class="spinner-border spinner-border-sm me-2"></span>
        Cargando diagnosticos...
      </div>

      <div v-else-if="!rows.length" class="empty-state">
        <i class="bi bi-clipboard2-pulse"></i>
        <h6>No hay diagnosticos registrados</h6>
        <p>Cuando agregues el primer diagnostico aparecera en esta lista.</p>
      </div>

      <DataTable
        v-else
        ref="dt"
        :value="rows"
        paginator
        :rows="8"
        :filters="filters"
        :globalFilterFields="['cod_diagnostico', 'des_diagnostico', 'estado']"
        class="p-datatable-sm"
      >
        <Column field="cod_diagnostico" header="Codigo" sortable>
          <template #body="slotProps">
            <span class="badge text-bg-light border">
              {{ slotProps.data.cod_diagnostico }}
            </span>
          </template>
        </Column>

        <Column field="des_diagnostico" header="Descripcion" sortable />

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

        <Column field="fec_registro" header="Registro" sortable>
          <template #body="slotProps">
            {{ formatFecha(slotProps.data.fec_registro) }}
          </template>
        </Column>

        <Column header="Acciones">
          <template #body="slotProps">
            <div class="btn-group btn-group-sm">
              <button
                class="btn btn-outline-primary"
                title="Editar"
                @click="emit('editar', slotProps.data)"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <button
                :class="
                  slotProps.data.est_activo ? 'btn btn-outline-danger' : 'btn btn-outline-success'
                "
                :title="slotProps.data.est_activo ? 'Desactivar' : 'Activar'"
                @click="emit('cambiarEstado', slotProps.data)"
              >
                <i
                  :class="slotProps.data.est_activo ? 'bi bi-slash-circle' : 'bi bi-check-circle'"
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

const props = defineProps<{
  items: Diagnostico[]
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'editar', item: Diagnostico): void
  (e: 'cambiarEstado', item: Diagnostico): void
}>()

const filters = ref({
  global: { value: null, matchMode: 'contains' },
})

const rows = computed(() =>
  props.items.map((item) => ({
    ...item,
    estado: item.est_activo ? 'Activo' : 'Inactivo',
  })),
)

const dt = ref()

const formatFecha = (fecha?: string | null) => {
  if (!fecha) return '-'
  return new Date(fecha).toLocaleDateString()
}

const exportExcel = () => {
  const data = (dt.value?.filteredValue || rows.value).map((d: Diagnostico) => ({
    codigo: d.cod_diagnostico,
    descripcion: d.des_diagnostico,
    estado: d.est_activo ? 'Activo' : 'Inactivo',
    registro: formatFecha(d.fec_registro),
  }))

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Diagnosticos')
  XLSX.writeFile(wb, 'diagnosticos.xlsx')
}
</script>
